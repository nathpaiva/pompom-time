import { useCallback, useRef, useState } from 'react'

const PULSE_LIMIT = 5
const PULSE_INTERVAL = 500

export const usePulse = () => {
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
      if (_pulse === PULSE_LIMIT) {
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
    }, PULSE_INTERVAL)
  }, [isPulseStarted])

  const handleStartStopPulse = () => {
    setIsPulseStarted((prev) => !prev)
    pulseTimer()
  }

  return {
    pulseInterval,
    isPulseStarted,
    handleStartStopPulse,
    pulseTimer,
  }
}
