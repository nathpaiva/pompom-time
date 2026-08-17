import { Variety_Enum } from '@graph/types'
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

  it('should start idle and move through countdown into contract', () => {
    const data = mockDataResponse[1] // squeeze: 6, rest: 3, goal_per_day: 5
    const { result } = renderHook(() => usePulse(data))

    expect(result.current.phase).toBe('idle')

    act(() => result.current.handleStartStopPulse())
    expect(result.current.phase).toBe('countdown')
    expect(result.current.countingDownInterval).toBe(3)

    act(() => vi.advanceTimersByTime(3000))
    expect(result.current.phase).toBe('contract')
    expect(result.current.repIndex).toBe(0)
  })

  it('should loop contract -> release for a Pulse workout with no hold', () => {
    const data = mockDataResponse[1]
    const { result } = renderHook(() => usePulse(data))

    act(() => result.current.handleStartStopPulse())
    act(() => vi.advanceTimersByTime(3000)) // countdown done -> contract
    expect(result.current.phase).toBe('contract')

    act(() => vi.advanceTimersByTime(280)) // contract done -> release
    expect(result.current.phase).toBe('release')

    act(() => vi.advanceTimersByTime(280)) // release done -> next rep contract
    expect(result.current.phase).toBe('contract')
    expect(result.current.repIndex).toBe(1)
  })

  it('should enter hold after contract for a Resistance workout, sized to the workout interval', () => {
    const data = {
      ...mockDataResponse[1],
      variety: Variety_Enum.Resistance,
      interval: 2,
    }
    const { result } = renderHook(() => usePulse(data))

    act(() => result.current.handleStartStopPulse())
    act(() => vi.advanceTimersByTime(3000))
    expect(result.current.phase).toBe('contract')

    act(() => vi.advanceTimersByTime(600)) // Resistance contract = 600ms
    expect(result.current.phase).toBe('hold')

    act(() => vi.advanceTimersByTime(1999))
    expect(result.current.phase).toBe('hold')

    act(() => vi.advanceTimersByTime(1))
    expect(result.current.phase).toBe('release')
  })

  it('should move to resting after the final rep of a set, then back to countdown', () => {
    const data = mockDataResponse[1] // squeeze: 6, rest: 3, goal_per_day: 5
    const { result } = renderHook(() => usePulse(data))

    act(() => result.current.handleStartStopPulse())
    act(() => vi.advanceTimersByTime(3000)) // -> contract, rep 0

    // squeeze=6: run 6 full contract+release cycles (280ms each)
    for (let rep = 0; rep < 6; rep += 1) {
      act(() => vi.advanceTimersByTime(280)) // contract -> release
      act(() => vi.advanceTimersByTime(280)) // release -> next contract (or resting)
    }

    expect(result.current.phase).toBe('resting')
    expect(result.current.setIndex).toBe(1)
    expect(result.current.restingInterval).toBe(data.rest)

    act(() => vi.advanceTimersByTime(data.rest * 1000))
    expect(result.current.phase).toBe('countdown')
  })

  it('should reach done after the final set, with no more resting or countdown', () => {
    const data = {
      ...mockDataResponse[1],
      goal_per_day: 1,
      squeeze: 1,
    }
    const { result } = renderHook(() => usePulse(data))

    act(() => result.current.handleStartStopPulse())
    act(() => vi.advanceTimersByTime(3000)) // -> contract
    act(() => vi.advanceTimersByTime(280)) // -> release
    act(() => vi.advanceTimersByTime(280)) // rep complete, only set -> done

    expect(result.current.phase).toBe('done')
  })

  it('should preserve elapsed time across a pause and resume mid-contract', () => {
    const data = { ...mockDataResponse[1], variety: Variety_Enum.Strength }
    const { result } = renderHook(() => usePulse(data))

    act(() => result.current.handleStartStopPulse())
    act(() => vi.advanceTimersByTime(3000)) // -> contract (500ms total)
    expect(result.current.phase).toBe('contract')

    act(() => vi.advanceTimersByTime(300)) // 300ms into a 500ms contract
    act(() => result.current.handleStartStopPulse()) // pause

    // advancing time while paused must not progress the phase
    act(() => vi.advanceTimersByTime(5000))
    expect(result.current.phase).toBe('contract')

    act(() => result.current.handleStartStopPulse()) // resume
    act(() => vi.advanceTimersByTime(199)) // short of the remaining 200ms
    expect(result.current.phase).toBe('contract')

    act(() => vi.advanceTimersByTime(1)) // remaining 200ms elapses
    expect(result.current.phase).toBe('release')
  })

  it('should pause and resume during countdown without losing progress', () => {
    const data = mockDataResponse[1]
    const { result } = renderHook(() => usePulse(data))

    act(() => result.current.handleStartStopPulse())
    act(() => vi.advanceTimersByTime(1000)) // 1 tick into countdown (3 -> 2)
    expect(result.current.countingDownInterval).toBe(2)

    act(() => result.current.handleStartStopPulse()) // pause
    act(() => vi.advanceTimersByTime(5000))
    expect(result.current.phase).toBe('countdown')
    expect(result.current.countingDownInterval).toBe(2)

    act(() => result.current.handleStartStopPulse()) // resume
    act(() => vi.advanceTimersByTime(2000)) // remaining 2 ticks
    expect(result.current.phase).toBe('contract')
  })

  it('should pause and resume during resting without losing progress', () => {
    const data = mockDataResponse[1] // rest: 3
    const { result } = renderHook(() => usePulse(data))

    act(() => result.current.handleStartStopPulse())
    act(() => vi.advanceTimersByTime(3000)) // -> contract
    for (let rep = 0; rep < 6; rep += 1) {
      act(() => vi.advanceTimersByTime(280))
      act(() => vi.advanceTimersByTime(280))
    }
    expect(result.current.phase).toBe('resting')

    act(() => vi.advanceTimersByTime(1000)) // 1 tick into resting (3 -> 2)
    expect(result.current.restingInterval).toBe(2)

    act(() => result.current.handleStartStopPulse()) // pause
    act(() => vi.advanceTimersByTime(5000))
    expect(result.current.phase).toBe('resting')
    expect(result.current.restingInterval).toBe(2)

    act(() => result.current.handleStartStopPulse()) // resume
    act(() => vi.advanceTimersByTime(2000)) // remaining 2 ticks
    expect(result.current.phase).toBe('countdown')
  })

  it('should always reset to idle via handleReset, regardless of phase', () => {
    const data = mockDataResponse[1]
    const { result } = renderHook(() => usePulse(data))

    act(() => result.current.handleStartStopPulse())
    act(() => vi.advanceTimersByTime(3000)) // -> contract
    act(() => vi.advanceTimersByTime(140)) // mid-contract

    act(() => result.current.handleReset())

    expect(result.current.phase).toBe('idle')
    expect(result.current.repIndex).toBe(0)
    expect(result.current.setIndex).toBe(0)
  })

  it('should keep pausing (not reset) when the primary button is tapped during resting', () => {
    const data = mockDataResponse[1]
    const { result } = renderHook(() => usePulse(data))

    act(() => result.current.handleStartStopPulse())
    act(() => vi.advanceTimersByTime(3000)) // -> contract
    for (let rep = 0; rep < 6; rep += 1) {
      act(() => vi.advanceTimersByTime(280))
      act(() => vi.advanceTimersByTime(280))
    }
    expect(result.current.phase).toBe('resting')
    expect(result.current.setIndex).toBe(1)

    act(() => result.current.handleStartStopPulse()) // pause, not reset

    expect(result.current.phase).toBe('resting')
    expect(result.current.setIndex).toBe(1) // progress preserved
  })

  it('should expose phaseStartedAt and isPaused, tracking pause state', () => {
    const data = { ...mockDataResponse[1], variety: Variety_Enum.Strength }
    const { result } = renderHook(() => usePulse(data))

    expect(result.current.isPaused).toBe(false)

    act(() => result.current.handleStartStopPulse())
    act(() => vi.advanceTimersByTime(3000)) // -> contract
    expect(result.current.phase).toBe('contract')
    expect(result.current.isPaused).toBe(false)
    const startedAt = result.current.phaseStartedAt
    expect(startedAt).toBeGreaterThan(0)

    act(() => vi.advanceTimersByTime(100))
    act(() => result.current.handleStartStopPulse()) // pause
    expect(result.current.isPaused).toBe(true)

    act(() => result.current.handleStartStopPulse()) // resume
    expect(result.current.isPaused).toBe(false)
    // phaseStartedAt shifts backward on resume so elapsed time is preserved
    expect(result.current.phaseStartedAt).toBeLessThanOrEqual(startedAt)
  })
})
