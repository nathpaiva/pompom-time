import { useCallback, useMemo, useRef, useState } from 'react'

const PULSE_LIMIT = 20
const PULSE_INTERVAL = 500

interface IUsePulse {
  pulseInterval: number
  isPulseStarted: boolean
  handleStartStopPulse: () => void
}

interface IUsePulseParams {
  pulseLimit?: number
  pulseIntervalTimer?: number
}

type TUsePulse = (param?: IUsePulseParams) => IUsePulse

export const usePulse: TUsePulse = (param) => {
  const { _PULSE_INTERVAL, _PULSE_LIMIT } = useMemo(
    () => ({
      _PULSE_INTERVAL: param?.pulseIntervalTimer ?? PULSE_INTERVAL,
      _PULSE_LIMIT: param?.pulseLimit ?? PULSE_LIMIT,
    }),
    [param?.pulseIntervalTimer, param?.pulseLimit],
  )

  const [isPulseStarted, setIsPulseStarted] = useState(false)
  const [pulseInterval, setPulseInterval] = useState(1)
  const interval = useRef<NodeJS.Timeout>()

  const pulseTimer = useCallback(() => {
    let _pulse = 1
    /**
     * if has interval and the pulse is running:
     * - clean the interval
     * - reset the pulse interval
     * - reset internal interval
     */
    if (interval.current && isPulseStarted) {
      _pulse = 1
      clearInterval(interval.current)

      interval.current = undefined
      setPulseInterval(_pulse)
      return
    }

    // start the pulse
    interval.current = setInterval(() => {
      /**
       * if get the pulse limit stop pulsing:
       * - clean the interval
       * - reset the pulse interval
       * - reset internal interval
       */
      if (_pulse === _PULSE_LIMIT) {
        _pulse = 1
        clearInterval(interval.current)

        interval.current = undefined
        setPulseInterval(_pulse)
        setIsPulseStarted((prev) => !prev)

        return
      }

      // increase the pulse
      _pulse += 1
      setPulseInterval(_pulse)
    }, _PULSE_INTERVAL)
  }, [isPulseStarted, _PULSE_INTERVAL, _PULSE_LIMIT])

  const handleStartStopPulse = () => {
    setIsPulseStarted((prev) => !prev)
    pulseTimer()
  }

  return {
    pulseInterval,
    isPulseStarted,
    handleStartStopPulse,
  }
}
