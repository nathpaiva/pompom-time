import { Variety_Enum, Workouts } from '@graph/types'
import { renderHook } from '@testing-library/react'

import { useWorkoutPhaseDisplay } from './useWorkoutPhaseDisplay'

const baseWorkout = {
  squeeze: 6,
  goal_per_day: 5,
  variety: Variety_Enum.Pulse,
} as Workouts

const basePulseResult = {
  phase: 'idle' as const,
  repIndex: 0,
  setIndex: 0,
  countingDownInterval: 3,
  restingInterval: 40,
}

describe('useWorkoutPhaseDisplay', () => {
  it('should show "Ready" and 0/squeeze while idle', () => {
    const { result } = renderHook(() =>
      useWorkoutPhaseDisplay(basePulseResult, baseWorkout),
    )

    expect(result.current.phaseLabel).toBe('Ready')
    expect(result.current.statusText).toBe('0/6')
    expect(result.current.completedReps).toBe(0)
    expect(result.current.isPrimaryDisabled).toBe(false)
    expect(result.current.isResetDisabled).toBe(true)
    expect(result.current.primaryLabel).toBe('Start workout')
  })

  it('should show the countdown digit and disable the primary button', () => {
    const { result } = renderHook(() =>
      useWorkoutPhaseDisplay(
        { ...basePulseResult, phase: 'countdown', countingDownInterval: 2 },
        baseWorkout,
      ),
    )

    expect(result.current.phaseLabel).toBe('Get ready')
    expect(result.current.statusText).toBe('2')
    expect(result.current.isPrimaryDisabled).toBe(true)
  })

  it('should show rep progress during contract/hold/release, with completedReps trailing the current rep', () => {
    const { result } = renderHook(() =>
      useWorkoutPhaseDisplay(
        { ...basePulseResult, phase: 'contract', repIndex: 2 },
        baseWorkout,
      ),
    )

    expect(result.current.phaseLabel).toBe('Squeeze')
    expect(result.current.statusText).toBe('3/6')
    expect(result.current.completedReps).toBe(2)
    expect(result.current.isPrimaryDisabled).toBe(false)
    expect(result.current.primaryLabel).toBe('Pause')
  })

  it('should show all reps completed and disable the primary button during resting', () => {
    const { result } = renderHook(() =>
      useWorkoutPhaseDisplay(
        { ...basePulseResult, phase: 'resting', restingInterval: 12 },
        baseWorkout,
      ),
    )

    expect(result.current.phaseLabel).toBe('Resting')
    expect(result.current.statusText).toBe('12')
    expect(result.current.completedReps).toBe(6)
    expect(result.current.isPrimaryDisabled).toBe(true)
  })

  it('should show "Done" with all reps completed and Start workout re-enabled', () => {
    const { result } = renderHook(() =>
      useWorkoutPhaseDisplay(
        { ...basePulseResult, phase: 'done' },
        baseWorkout,
      ),
    )

    expect(result.current.phaseLabel).toBe('Done')
    expect(result.current.statusText).toBe('6/6')
    expect(result.current.completedReps).toBe(6)
    expect(result.current.isPrimaryDisabled).toBe(false)
    expect(result.current.isResetDisabled).toBe(true)
    expect(result.current.primaryLabel).toBe('Start workout')
  })
})
