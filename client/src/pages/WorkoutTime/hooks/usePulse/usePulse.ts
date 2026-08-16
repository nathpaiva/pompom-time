import { useCallback, useEffect, useRef, useState } from 'react'

import { PULSE_INTERVAL_RESTING } from '../../constants'
import { phaseDurationMs, type TPhase } from './phaseMath'
import { Variety_Enum, type TUsePulse } from './types'

const COUNTDOWN_START = 3

export const usePulse: TUsePulse = (data) => {
  const {
    variety,
    squeeze,
    rest,
    repeat,
    goal_per_day: sets,
    interval,
  } = data ?? {}
  const holdSeconds = variety === Variety_Enum.Resistance ? (interval ?? 0) : 0

  const [phase, setPhase] = useState<TPhase>('idle')
  const [repIndex, setRepIndex] = useState(0)
  const [setIndex, setSetIndex] = useState(0)
  const [countingDownInterval, setCountingDownInterval] =
    useState(COUNTDOWN_START)
  const [restingInterval, setRestingInterval] = useState(rest ?? 0)

  // refs mirror the state above so timer callbacks always read the latest
  // value, instead of a value captured in a stale useCallback closure
  const phaseRef = useRef<TPhase>('idle')
  const repIndexRef = useRef(0)
  const setIndexRef = useRef(0)
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const phaseStartedAtRef = useRef(0)
  const pausedElapsedMsRef = useRef<number | undefined>(undefined)

  const setPhaseState = useCallback((next: TPhase) => {
    phaseRef.current = next
    setPhase(next)
  }, [])

  const setRepIndexState = useCallback((next: number) => {
    repIndexRef.current = next
    setRepIndex(next)
  }, [])

  const setSetIndexState = useCallback((next: number) => {
    setIndexRef.current = next
    setSetIndex(next)
  }, [])

  const clearPendingTimer = useCallback(() => {
    clearTimeout(timeoutRef.current)
    timeoutRef.current = undefined
  }, [])

  // mutually-recursive phase functions can't be plain useCallbacks (each
  // would need the other in its deps, which would recreate both every
  // render and re-trigger effects) — they're kept in refs, updated after
  // every render via the effect below (keyed on the values they close
  // over), and always called through the ref.
  const enterPhaseRef = useRef<(next: TPhase, elapsedMs?: number) => void>(
    () => undefined,
  )
  const advancePhaseRef = useRef<() => void>(() => undefined)
  const startRestingRef = useRef<() => void>(() => undefined)
  const startCountdownRef = useRef<() => void>(() => undefined)

  // countdown/resting also run through enterPhase/advancePhase, one 1s
  // tick at a time, so the same setTimeout + pause/resume mechanism as
  // contract/hold/release applies uniformly to every active phase.
  const tickCountdownRef = useRef<() => void>(() => undefined)
  const tickRestingRef = useRef<() => void>(() => undefined)

  // countingDownInterval/restingInterval need a synchronous read inside
  // tickCountdownRef/tickRestingRef (state updates aren't visible until
  // the next render), same reason phase/repIndex/setIndex use refs above
  const countingDownIntervalRef = useRef(COUNTDOWN_START)
  const restingIntervalRef = useRef(rest ?? 0)

  useEffect(() => {
    enterPhaseRef.current = (next: TPhase, elapsedMs = 0) => {
      setPhaseState(next)
      phaseStartedAtRef.current = Date.now() - elapsedMs

      if (next === 'countdown') {
        timeoutRef.current = setTimeout(
          () => tickCountdownRef.current(),
          PULSE_INTERVAL_RESTING - elapsedMs,
        )
        return
      }

      if (next === 'resting') {
        timeoutRef.current = setTimeout(
          () => tickRestingRef.current(),
          PULSE_INTERVAL_RESTING - elapsedMs,
        )
        return
      }

      if (!variety) return

      const durationMs = phaseDurationMs(next, variety, holdSeconds)
      if (durationMs <= 0) return

      timeoutRef.current = setTimeout(() => {
        advancePhaseRef.current()
      }, durationMs - elapsedMs)
    }

    startCountdownRef.current = () => {
      setCountingDownInterval(COUNTDOWN_START)
      enterPhaseRef.current('countdown')
    }

    tickCountdownRef.current = () => {
      const remaining = countingDownIntervalRef.current - 1

      if (remaining === 0) {
        setCountingDownInterval(COUNTDOWN_START)
        setRepIndexState(0)
        enterPhaseRef.current('contract')
        return
      }

      countingDownIntervalRef.current = remaining
      setCountingDownInterval(remaining)
      enterPhaseRef.current('countdown')
    }

    startRestingRef.current = () => {
      if (!rest) {
        setPhaseState('done')
        return
      }

      restingIntervalRef.current = rest
      setRestingInterval(rest)
      enterPhaseRef.current('resting')
    }

    tickRestingRef.current = () => {
      const remaining = restingIntervalRef.current - 1

      if (remaining === 0) {
        setRestingInterval(rest ?? 0)
        startCountdownRef.current()
        return
      }

      restingIntervalRef.current = remaining
      setRestingInterval(remaining)
      enterPhaseRef.current('resting')
    }

    advancePhaseRef.current = () => {
      const current = phaseRef.current

      if (current === 'contract') {
        if (variety === Variety_Enum.Resistance && holdSeconds > 0) {
          enterPhaseRef.current('hold')
          return
        }
        enterPhaseRef.current('release')
        return
      }

      if (current === 'hold') {
        enterPhaseRef.current('release')
        return
      }

      if (current === 'release') {
        const nextRep = repIndexRef.current + 1
        setRepIndexState(nextRep)

        if (!squeeze || nextRep < squeeze) {
          enterPhaseRef.current('contract')
          return
        }

        const nextSet = setIndexRef.current + 1
        setSetIndexState(nextSet)
        setRepIndexState(0)

        if (!sets || nextSet >= sets || !repeat) {
          setPhaseState('done')
          return
        }

        startRestingRef.current()
      }
    }
  }, [
    variety,
    holdSeconds,
    squeeze,
    sets,
    repeat,
    rest,
    setPhaseState,
    setRepIndexState,
    setSetIndexState,
  ])

  useEffect(() => {
    countingDownIntervalRef.current = countingDownInterval
  }, [countingDownInterval])
  useEffect(() => {
    restingIntervalRef.current = restingInterval
  }, [restingInterval])

  useEffect(() => {
    return () => clearPendingTimer()
  }, [clearPendingTimer])

  const pause = useCallback(() => {
    pausedElapsedMsRef.current = Date.now() - phaseStartedAtRef.current
    clearPendingTimer()
  }, [clearPendingTimer])

  const resume = useCallback(() => {
    const elapsedMs = pausedElapsedMsRef.current ?? 0
    pausedElapsedMsRef.current = undefined
    enterPhaseRef.current(phaseRef.current, elapsedMs)
  }, [])

  const reset = useCallback(() => {
    clearPendingTimer()
    pausedElapsedMsRef.current = undefined
    setRepIndexState(0)
    setSetIndexState(0)
    setCountingDownInterval(COUNTDOWN_START)
    setRestingInterval(rest ?? 0)
    setPhaseState('idle')
  }, [
    clearPendingTimer,
    rest,
    setPhaseState,
    setRepIndexState,
    setSetIndexState,
  ])

  const handleStartStopPulse = useCallback(() => {
    const current = phaseRef.current

    if (current === 'idle' || current === 'done') {
      startCountdownRef.current()
      return
    }

    // every other active phase (countdown/contract/hold/release/resting)
    // pauses or resumes in place — it never discards progress
    if (pausedElapsedMsRef.current !== undefined) {
      resume()
    } else {
      pause()
    }
  }, [pause, resume])

  const handleReset = useCallback(() => {
    reset()
  }, [reset])

  return {
    phase,
    repIndex,
    setIndex,
    countingDownInterval,
    restingInterval,
    handleStartStopPulse,
    handleReset,
  }
}
