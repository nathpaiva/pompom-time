import { act, renderHook, waitFor } from '@testing-library/react'

import { mockDataResponse } from '../../__tests__/mockDataResponse'
import { usePulse } from './usePulse'

describe('usePulse', () => {
  it('should start and stop pulse after get the limit', async () => {
    const data = mockDataResponse[1]
    const { result } = renderHook(() =>
      usePulse({
        interval: data.interval,
        squeeze: data.squeeze,
        repeat: data.repeat,
        rest: data.rest,
        sets: data.goal_per_day,
        type: data.type,
      }),
    )

    // should be paused
    expect(result.current.isPulsing).toBeFalsy()
    expect(result.current.pulseInterval).toEqual(1)

    // call start pulse
    act(() => result.current.handleStartStopPulse())

    // should be started
    expect(result.current.isPulsing).toBeTruthy()
    await waitFor(() => expect(result.current.pulseInterval).toEqual(2))
    await waitFor(() => expect(result.current.pulseInterval).toEqual(3))
    await waitFor(() => expect(result.current.pulseInterval).toEqual(4))
    await waitFor(() => expect(result.current.pulseInterval).toEqual(5))
    await waitFor(() => expect(result.current.pulseInterval).toEqual(6))
    await waitFor(() => expect(result.current.isPulsing).toBeFalsy())

    expect(result.current.pulseInterval).toEqual(1)

    // start the resting time
    if (data.repeat) {
      await waitFor(() => expect(result.current.restingInterval).toEqual(3))
      await waitFor(() => expect(result.current.restingInterval).toEqual(2))
      await waitFor(() => expect(result.current.restingInterval).toEqual(1))
      await waitFor(() => expect(result.current.isResting).toBeTruthy())
      await waitFor(() => expect(result.current.restingInterval).toEqual(3))
      await waitFor(() => expect(result.current.isResting).toBeFalsy())
    }
  })

  it('should start and stop pulse after call handleStartStopPulse', async () => {
    const data = mockDataResponse[1]
    const { result } = renderHook(() =>
      usePulse({
        interval: data.interval,
        squeeze: data.squeeze,
        repeat: data.repeat,
        rest: data.rest,
        sets: data.goal_per_day,
        type: data.type,
      }),
    )

    // should be paused
    expect(result.current.isPulsing).toBeFalsy()
    expect(result.current.pulseInterval).toEqual(1)

    // call start pulse
    act(() => result.current.handleStartStopPulse())

    // should be started
    expect(result.current.isPulsing).toBeTruthy()
    await waitFor(() => expect(result.current.pulseInterval).toEqual(2))
    await waitFor(() => expect(result.current.pulseInterval).toEqual(3))
    expect(result.current.isPulsing).toBeTruthy()

    // call stop pulse
    act(() => result.current.handleStartStopPulse())

    expect(result.current.isPulsing).toBeFalsy()
    expect(result.current.pulseInterval).toEqual(1)
  })
})
