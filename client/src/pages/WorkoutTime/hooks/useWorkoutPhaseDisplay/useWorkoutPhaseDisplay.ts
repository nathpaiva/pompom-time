import { Workouts } from '@graph/types'

import type { TPhase } from '../usePulse/phaseMath'

interface IUsePulseResult {
  phase: TPhase
  repIndex: number
  setIndex: number
  countingDownInterval: number
  restingInterval: number
}

interface IWorkoutPhaseDisplay {
  phaseLabel: string
  statusText: string
  completedReps: number
  primaryLabel: string
  isPrimaryDisabled: boolean
  isResetDisabled: boolean
}

const PHASE_LABEL: Record<TPhase, string> = {
  idle: 'Ready',
  countdown: 'Get ready',
  contract: 'Squeeze',
  hold: 'Squeeze',
  release: 'Squeeze',
  resting: 'Resting',
  done: 'Done',
}

export const useWorkoutPhaseDisplay = (
  { phase, repIndex, countingDownInterval, restingInterval }: IUsePulseResult,
  workout?: Workouts,
): IWorkoutPhaseDisplay => {
  const squeeze = workout?.squeeze ?? 0
  const phaseLabel = PHASE_LABEL[phase]

  const statusText = {
    idle: `0/${squeeze}`,
    countdown: String(countingDownInterval),
    contract: `${repIndex + 1}/${squeeze}`,
    hold: `${repIndex + 1}/${squeeze}`,
    release: `${repIndex + 1}/${squeeze}`,
    resting: String(restingInterval),
    done: `${squeeze}/${squeeze}`,
  }[phase]

  const completedReps = {
    idle: 0,
    countdown: 0,
    contract: repIndex,
    hold: repIndex,
    release: repIndex,
    resting: squeeze,
    done: squeeze,
  }[phase]

  return {
    phaseLabel,
    statusText,
    completedReps,
    primaryLabel:
      phase === 'contract' || phase === 'hold' || phase === 'release'
        ? 'Pause'
        : 'Start workout',
    isPrimaryDisabled: phase === 'countdown' || phase === 'resting',
    isResetDisabled: phase === 'idle' || phase === 'done',
  }
}
