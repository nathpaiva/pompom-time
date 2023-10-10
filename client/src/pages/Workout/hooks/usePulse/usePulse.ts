import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { EnumWorkoutType } from '../../../../../../serverless/functions/add-workout-by-user/types'

const PULSE_LIMIT = 20
const PULSE_INTERVAL_FALLBACK = 500
const PULSE_INTERVAL_RESTING = 1000

const intervalByWorkoutType: Record<keyof typeof EnumWorkoutType, number> = {
  [EnumWorkoutType.pulse]: 500,
  [EnumWorkoutType.intensity]: 500,
  [EnumWorkoutType.resistance]: 500,
  [EnumWorkoutType.strength]: 1500,
} as const

// EnumWorkoutType
interface IUsePulse {
  pulseInterval: number
  isPulsing: boolean
  handleStartStopPulse: () => void
  counter: number
  restingInterval: number
  isResting: boolean
  isCountingDown: boolean
  countingDownInterval: number
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
        _PULSE_INTERVAL: !type
          ? PULSE_INTERVAL_FALLBACK
          : type === EnumWorkoutType.resistance && interval
          ? interval * 1000
          : intervalByWorkoutType[type],
        _PULSE_LIMIT: squeeze,
        _REST: rest,
        _REPEAT: repeat,
        _SETS: sets,
      }
    }, [type, interval, squeeze, rest, repeat, sets])

  // workout counter
  const [counter, setCounter] = useState(0)
  // workout
  const [isPulsing, setIsPulsing] = useState(false)
  const [pulseInterval, setPulseInterval] = useState(1)
  const _pulseIntervalRef = useRef<NodeJS.Timeout>()
  const _pulseInterval = useRef(1)
  // rest
  const [isResting, setIsResting] = useState(false)
  const [restingInterval, setRestingInterval] = useState(_REST ?? 0)
  const _restingIntervalRef = useRef<NodeJS.Timeout>()
  const _restingInterval = useRef(_REST ?? 0)
  // workout will start
  const [isCountingDown, setIsCountingDown] = useState(false)
  const [countingDownInterval, setCountingDownInterval] = useState(3)
  const _countingDownIntervalRef = useRef<NodeJS.Timeout>()
  const _countingDownInterval = useRef(3)

  const countingDownTimer = useCallback((callback: () => void) => {
    _countingDownIntervalRef.current = setInterval(() => {
      if (_countingDownInterval.current === 1) {
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

  const restingTimer = useCallback(
    (callback: () => void) => {
      if (!_REST) return
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
      }, PULSE_INTERVAL_RESTING)
    },
    [_REST],
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

  const start = useCallback(() => {
    setIsPulsing((prev) => !prev)
    pulseTimer()
  }, [pulseTimer])

  const handleStartStopPulse = useCallback(() => {
    setIsCountingDown((prev) => !prev)
    countingDownTimer(start)
  }, [countingDownTimer, start])

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
    isCountingDown,
    countingDownInterval,
  }
}
