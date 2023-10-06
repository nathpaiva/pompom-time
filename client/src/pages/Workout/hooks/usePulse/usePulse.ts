import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { EnumWorkoutType } from '../../../../../../serverless/functions/add-workout-by-user/types'

const PULSE_LIMIT = 20
const PULSE_INTERVAL = 500

interface IUsePulse {
  pulseInterval: number
  isPulseStarted: boolean
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
  const { _PULSE_INTERVAL, _PULSE_LIMIT, _REST } = useMemo(() => {
    console.log(`"rest"`, rest)

    return {
      _PULSE_INTERVAL: PULSE_INTERVAL,
      _PULSE_LIMIT: squeeze ?? PULSE_LIMIT,
      _REST: rest ?? 0,
    }
  }, [squeeze, rest])
  console.log(`"_REST"`, _REST)
  // workout counter
  const [counter, setCounter] = useState(0)
  // workout
  const [isPulseStarted, setIsPulseStarted] = useState(false)
  const [pulseInterval, setPulseInterval] = useState(1)
  const _intervalRef = useRef<NodeJS.Timeout>()
  const _pulse = useRef(1)
  // rest
  const [isResting, setIsResting] = useState(false)
  const [restingInterval, setRestingInterval] = useState(_REST)
  const _restingRef = useRef<NodeJS.Timeout>()
  const _interval = useRef(_REST)

  const pulseTimer = useCallback(() => {
    /**
     * if has interval and the pulse is running:
     * - clean the interval
     * - reset the pulse interval
     * - reset internal interval
     */
    if (_intervalRef.current && isPulseStarted) {
      _pulse.current = 1
      clearInterval(_intervalRef.current)

      _intervalRef.current = undefined
      setPulseInterval(_pulse.current)
      return
    }

    // start the pulse
    _intervalRef.current = setInterval(() => {
      /**
       * if get the pulse limit stop pulsing:
       * - clean the interval
       * - reset the pulse interval
       * - reset internal interval
       */
      if (_pulse.current === _PULSE_LIMIT) {
        _pulse.current = 1
        clearInterval(_intervalRef.current)

        _intervalRef.current = undefined
        setPulseInterval(_pulse.current)
        setIsPulseStarted((prev) => !prev)
        setCounter((prev) => prev + 1)
        return
      }

      // increase the pulse
      _pulse.current += 1
      setPulseInterval(_pulse.current)
    }, _PULSE_INTERVAL)
  }, [isPulseStarted, _PULSE_INTERVAL, _PULSE_LIMIT])

  const restingTimer = useCallback(() => {
    console.log(`veio`)
    /**
     * if has interval and the pulse is running:
     * - clean the interval
     * - reset the pulse interval
     * - reset internal interval
     */
    if (_restingRef.current && isResting) {
      _interval.current = _REST
      clearInterval(_restingRef.current)

      _restingRef.current = undefined
      setRestingInterval(_interval.current)
      return
    }

    console.log(`passou`)

    // start the pulse
    _restingRef.current = setInterval(() => {
      /**
       * if get the pulse limit stop pulsing:
       * - clean the interval
       * - reset the pulse interval
       * - reset internal interval
       */
      console.log(`"_interval"`, _interval)
      if (_interval.current === 0) {
        _interval.current = _REST
        clearInterval(_restingRef.current)

        // _restingRef.current = undefined
        setRestingInterval(_REST)
        setIsResting((prev) => !prev)
        // setCounter((prev) => prev + 1)
        return
      }

      // increase the pulse
      _interval.current -= 1
      console.log(
        '🚀 ~ file: usePulse.ts:138 ~ _restingRef.current=setInterval ~ _interval.current:',
        _interval.current,
      )
      setRestingInterval(_interval.current)
    }, _PULSE_INTERVAL)
  }, [_PULSE_INTERVAL, _REST, isResting])

  useEffect(() => {
    if (!counter || !repeat || !rest || !sets) return

    if (counter < sets) {
      console.log(`vai chamar o timer`)
      restingTimer()
      setTimeout(() => {
        console.log(`veio depois do time`)
        pulseTimer()
      }, rest * 1000)
    }

    if (counter === sets) {
      console.log(`zerou o counter`)
      setCounter(0)
    }
  }, [counter, sets, repeat, rest, pulseTimer, restingTimer])

  const handleStartStopPulse = () => {
    setIsPulseStarted((prev) => !prev)
    pulseTimer()
  }

  return {
    pulseInterval,
    isPulseStarted,
    handleStartStopPulse,
    counter,
    isResting,
    restingInterval,
  }
}
