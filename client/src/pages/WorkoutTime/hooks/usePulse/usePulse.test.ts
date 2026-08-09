import { act, renderHook } from '@testing-library/react'

import { mockDataResponse } from '../../../Workout/__tests__/mockDataResponse'
import { usePulse } from './usePulse'

describe('usePulse', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should start and stop pulse after get the limit', () => {
    const data = mockDataResponse[1]
    const { result } = renderHook(() => usePulse(data))

    // should be paused
    expect(result.current.isPulsing).toBeFalsy()
    expect(result.current.pulseInterval).toEqual(1)

    // call start pulse
    act(() => result.current.handleStartStopPulse())

    // should count down before it starts
    expect(result.current.isCountingDown).toBeTruthy()
    act(() => vi.advanceTimersByTime(4000))
    expect(result.current.isCountingDown).toBeFalsy()

    // should be started
    expect(result.current.isPulsing).toBeTruthy()
    act(() => vi.advanceTimersByTime(5000))
    expect(result.current.isPulsing).toBeFalsy()
    expect(result.current.pulseInterval).toEqual(1)

    // start the resting time
    if (data.repeat) {
      expect(result.current.isResting).toBeTruthy()
      expect(result.current.restingInterval).toEqual(data.rest)

      act(() => vi.advanceTimersByTime(data.rest * 1000))
      expect(result.current.isResting).toBeFalsy()
    }
  })

  it('should start and stop pulse after call handleStartStopPulse', () => {
    const data = mockDataResponse[1]
    const { result } = renderHook(() => usePulse(data))

    // should be paused
    expect(result.current.isPulsing).toBeFalsy()
    expect(result.current.pulseInterval).toEqual(1)

    // call start pulse
    act(() => result.current.handleStartStopPulse())

    // should count down before it starts
    expect(result.current.isCountingDown).toBeTruthy()
    act(() => vi.advanceTimersByTime(4000))
    expect(result.current.isCountingDown).toBeFalsy()

    // should be started
    expect(result.current.isPulsing).toBeTruthy()
    act(() => vi.advanceTimersByTime(2000))
    expect(result.current.isPulsing).toBeTruthy()

    // call stop pulse
    act(() => result.current.handleStartStopPulse())

    expect(result.current.isPulsing).toBeFalsy()
    expect(result.current.pulseInterval).toEqual(1)
  })
})
