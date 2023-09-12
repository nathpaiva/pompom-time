import { act, renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { usePulse } from './usePulse'

describe('usePulse', () => {
  it('should start and stop pulse after get the lime', async () => {
    const { result } = renderHook(() =>
      usePulse({
        pulseLimit: 5,
        pulseIntervalTimer: 500,
      }),
    )

    // should be paused
    expect(result.current.isPulseStarted).toBeFalsy()
    expect(result.current.pulseInterval).toEqual(1)

    // call start pulse
    act(() => result.current.handleStartStopPulse())

    // should be started
    expect(result.current.isPulseStarted).toBeTruthy()
    await waitFor(() => expect(result.current.pulseInterval).toEqual(2))
    await waitFor(() => expect(result.current.pulseInterval).toEqual(3))
    await waitFor(() => expect(result.current.pulseInterval).toEqual(4))
    await waitFor(() => expect(result.current.pulseInterval).toEqual(5))
    await waitFor(() => expect(result.current.isPulseStarted).toBeFalsy())

    expect(result.current.pulseInterval).toEqual(1)
  })

  it('should start and stop pulse after call handleStartStopPulse', async () => {
    const { result } = renderHook(() =>
      usePulse({
        pulseLimit: 5,
        pulseIntervalTimer: 500,
      }),
    )

    // should be paused
    expect(result.current.isPulseStarted).toBeFalsy()
    expect(result.current.pulseInterval).toEqual(1)

    // call start pulse
    act(() => result.current.handleStartStopPulse())

    // should be started
    expect(result.current.isPulseStarted).toBeTruthy()
    await waitFor(() => expect(result.current.pulseInterval).toEqual(2))
    await waitFor(() => expect(result.current.pulseInterval).toEqual(3))
    expect(result.current.isPulseStarted).toBeTruthy()

    // call stop pulse
    act(() => result.current.handleStartStopPulse())

    expect(result.current.isPulseStarted).toBeFalsy()
    expect(result.current.pulseInterval).toEqual(1)
  })
})
