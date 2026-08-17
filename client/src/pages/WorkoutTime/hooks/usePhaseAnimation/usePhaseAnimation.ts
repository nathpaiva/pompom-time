import { Variety_Enum } from '@graph/types'
import { useEffect, useState } from 'react'

import { computePhaseState, type TPhase } from '../usePulse/phaseMath'

const ACTIVE_PHASES: TPhase[] = ['contract', 'hold', 'release']

export const usePhaseAnimation = (
  phase: TPhase,
  phaseStartedAt: number,
  isPaused: boolean,
  variety: Variety_Enum,
  repIndex: number,
  holdSeconds: number,
) => {
  const [state, setState] = useState(() =>
    computePhaseState(phase, 0, variety, repIndex, holdSeconds),
  )

  useEffect(() => {
    if (!ACTIVE_PHASES.includes(phase) || isPaused) return

    let rafId: number

    const tick = () => {
      const elapsedMs = Date.now() - phaseStartedAt
      setState(
        computePhaseState(phase, elapsedMs, variety, repIndex, holdSeconds),
      )
      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(rafId)
  }, [phase, phaseStartedAt, isPaused, variety, repIndex, holdSeconds])

  return state
}
