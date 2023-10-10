import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { EnumWorkoutType } from '../../../../../../serverless/functions/add-workout-by-user/types'

const PULSE_LIMIT = 20
const PULSE_INTERVAL = 500

interface IUsePulse {
  pulseInterval: number
  isPulsing: boolean
  handleStartStopPulse: () => void
  counter: number
  restingInterval: number
  isResting: boolean
}

interface IUsePulseParams {
  interval?: number
  squeeze?: number
  repeat?: boolean
  rest?: number
  sets?: number
  type?: EnumWorkoutType
}

type TUsePulse = (param: IUsePulseParams) => IUsePulse

export const usePulse: TUsePulse = ({
  interval,
  squeeze,
  repeat,
  rest,
  sets,
  type,
}) => {
  const { _PULSE_INTERVAL, _PULSE_LIMIT, _REST, _REPEAT, _SETS } =
    useMemo(() => {
      return {
        _PULSE_INTERVAL: PULSE_INTERVAL,
        _PULSE_LIMIT: squeeze ?? PULSE_LIMIT,
        _REST: rest ?? 0,
        _REPEAT: repeat,
        _SETS: sets,
      }
    }, [squeeze, rest, repeat, sets])

  // workout counter
  const [counter, setCounter] = useState(0)
  // workout
  const [isPulsing, setIsPulsing] = useState(false)
  const [pulseInterval, setPulseInterval] = useState(1)
  const _pulseIntervalRef = useRef<NodeJS.Timeout>()
  const _pulseInterval = useRef(1)
  // rest
  const [isResting, setIsResting] = useState(false)
  const [restingInterval, setRestingInterval] = useState(0)
  const _restingIntervalRef = useRef<NodeJS.Timeout>()
  const _restingInterval = useRef(0)

  const restingTimer = useCallback(
    (callback: () => void) => {
      // start resting
      _restingIntervalRef.current = setInterval(() => {
        /**
         * if get the resting limit stop resting:
         * - clean the interval
         * - reset the resting interval
         * - reset internal resting
         */
        if (_restingInterval.current === 1) {
          _restingInterval.current = _REST
          clearInterval(_restingIntervalRef.current)

          _restingIntervalRef.current = undefined
          setRestingInterval(_REST)
          setIsResting((prev) => !prev)

          callback()
          return
        }

        // decrease the resting
        _restingInterval.current -= 1
        setRestingInterval(_restingInterval.current)
      }, _PULSE_INTERVAL)
    },
    [_PULSE_INTERVAL, _REST],
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
      setCounter(0)

      _pulseIntervalRef.current = undefined
      setPulseInterval(_pulseInterval.current)
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
        setCounter((prev) => prev + 1)

        // callFunctionToRest(pulseTimer)
        return
      }

      // increase the pulse
      _pulseInterval.current += 1
      setPulseInterval(_pulseInterval.current)
    }, _PULSE_INTERVAL)
  }, [isPulsing, _PULSE_INTERVAL, _PULSE_LIMIT])

  const handleStartStopPulse = useCallback(() => {
    setIsPulsing((prev) => !prev)
    pulseTimer()
  }, [pulseTimer])

  useEffect(() => {
    if (!counter || !_REPEAT || !_REST || !_SETS) return

    if (
      counter < _SETS &&
      !_restingIntervalRef.current &&
      !_pulseIntervalRef.current
    ) {
      setIsResting((prev) => !prev)
      restingTimer(handleStartStopPulse)
    }

    if (counter === _SETS) {
      setCounter(0)
    }
  }, [counter, _SETS, _REPEAT, _REST, restingTimer, handleStartStopPulse])

  useEffect(() => {
    if (_REST) {
      setRestingInterval(_REST)
      _restingInterval.current = _REST
    }
  }, [_REST])

  return {
    pulseInterval,
    isPulsing,
    handleStartStopPulse,
    counter,
    isResting,
    restingInterval,
  }
}
