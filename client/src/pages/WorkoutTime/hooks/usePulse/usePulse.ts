import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import {
  PULSE_INTERVAL_FALLBACK,
  PULSE_INTERVAL_RESTING,
  intervalByWorkoutType,
} from '../../constants'
import { type TUsePulse, Variety_Enum } from './types'

export const usePulse: TUsePulse = (data) => {
  const { interval, squeeze, repeat, rest, variety } = data ?? {}
  const sets = data?.goal_per_day

  const { _PULSE_INTERVAL, _PULSE_LIMIT, _REST, _REPEAT, _SETS } =
    useMemo(() => {
      return {
        _PULSE_INTERVAL: !variety
          ? PULSE_INTERVAL_FALLBACK
          : variety === Variety_Enum.Resistance && interval
            ? interval * 1000
            : intervalByWorkoutType[variety],
        _PULSE_LIMIT: squeeze,
        _REST: rest,
        _REPEAT: repeat,
        _SETS: sets,
      }
    }, [variety, interval, squeeze, rest, repeat, sets])

  // workout counter
  const [counter, setCounter] = useState(0)
  const _counter = useRef(0)
  // workout
  const [isPulsing, setIsPulsing] = useState(false)
  const [pulseInterval, setPulseInterval] = useState(1)
  const _pulseIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const _pulseInterval = useRef(1)
  // rest
  const [isResting, setIsResting] = useState(false)
  const [restingInterval, setRestingInterval] = useState(_REST ?? 0)
  const _restingIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const _restingInterval = useRef(_REST ?? 0)
  // workout will start
  const [isCountingDown, setIsCountingDown] = useState(false)
  const [countingDownInterval, setCountingDownInterval] = useState(3)
  const _countingDownIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const _countingDownInterval = useRef(3)
  const _handleStartStopPulseRef = useRef<(() => void) | undefined>(undefined)

  const countingDownTimer = useCallback((callback: () => void) => {
    _countingDownIntervalRef.current = setInterval(() => {
      if (_countingDownInterval.current === 0) {
        _countingDownInterval.current = 3
        clearInterval(_countingDownIntervalRef.current)

        _countingDownIntervalRef.current = undefined
        setCountingDownInterval(3)
        setIsCountingDown((prev) => !prev)

        callback()
        return
      }

      // decrease the resting
      _countingDownInterval.current -= 1
      setCountingDownInterval(_countingDownInterval.current)
    }, PULSE_INTERVAL_RESTING)
  }, [])

  const resetRestingInterval = useCallback((value: number) => {
    _restingInterval.current = value
    setRestingInterval(value)
  }, [])

  const restingTimer = useCallback(
    (callback: () => void) => {
      if (!_REST) return

      // seed the countdown with the current rest value before starting
      resetRestingInterval(_REST)

      // start resting
      _restingIntervalRef.current = setInterval(() => {
        /**
         * if get the resting limit stop resting:
         * - clean the interval
         * - reset the resting interval
         * - reset internal resting
         */
        if (_restingInterval.current === 1) {
          resetRestingInterval(_REST)
          clearInterval(_restingIntervalRef.current)

          _restingIntervalRef.current = undefined
          setIsResting((prev) => !prev)

          callback()
          return
        }

        // decrease the resting
        _restingInterval.current -= 1
        setRestingInterval(_restingInterval.current)
      }, PULSE_INTERVAL_RESTING)
    },
    [_REST, resetRestingInterval],
  )

  const advanceSet = useCallback(
    (nextCounter: number) => {
      if (!nextCounter || !_REPEAT || !_REST || !_SETS) return

      if (
        nextCounter < _SETS &&
        !_restingIntervalRef.current &&
        !_pulseIntervalRef.current
      ) {
        setIsResting((prev) => !prev)
        restingTimer(() => _handleStartStopPulseRef.current?.())
      }

      if (nextCounter === _SETS) {
        _counter.current = 0
        setCounter(0)
      }
    },
    [_REPEAT, _REST, _SETS, restingTimer],
  )

  const pulseTimer = useCallback(() => {
    /**
     * if has interval and the pulse is running:
     * - clean the interval
     * - reset the pulse interval
     * - reset internal interval
     */
    if (_pulseIntervalRef.current && isPulsing) {
      _pulseInterval.current = 1
      clearInterval(_pulseIntervalRef.current)
      _counter.current = 0
      setCounter(0)

      _pulseIntervalRef.current = undefined
      setPulseInterval(_pulseInterval.current)
      setIsPulsing(false)
      return
    }

    // start the pulse
    _pulseIntervalRef.current = setInterval(() => {
      /**
       * if get the pulse limit stop pulsing:
       * - clean the interval
       * - reset the pulse interval
       * - reset internal interval
       */
      if (_pulseInterval.current === _PULSE_LIMIT) {
        _pulseInterval.current = 1
        clearInterval(_pulseIntervalRef.current)

        _pulseIntervalRef.current = undefined
        setPulseInterval(_pulseInterval.current)
        setIsPulsing((prev) => !prev)

        const next = _counter.current + 1
        _counter.current = next
        setCounter(next)
        advanceSet(next)

        return
      }

      // increase the pulse
      _pulseInterval.current += 1
      setPulseInterval(_pulseInterval.current)
    }, _PULSE_INTERVAL)
  }, [isPulsing, _PULSE_INTERVAL, _PULSE_LIMIT, advanceSet])

  const start = useCallback(() => {
    setIsPulsing((prev) => !prev)
    pulseTimer()
  }, [pulseTimer])

  const handleStartStopPulse = useCallback(() => {
    if (isPulsing) {
      pulseTimer()
      return
    }

    setIsCountingDown((prev) => !prev)
    countingDownTimer(start)
  }, [isPulsing, pulseTimer, countingDownTimer, start])

  useEffect(() => {
    _handleStartStopPulseRef.current = handleStartStopPulse
  }, [handleStartStopPulse])

  return {
    pulseInterval,
    isPulsing,
    handleStartStopPulse,
    counter,
    isResting,
    restingInterval,
    isCountingDown,
    countingDownInterval,
  }
}
