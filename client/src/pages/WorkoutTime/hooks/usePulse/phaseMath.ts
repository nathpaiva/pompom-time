import { Variety_Enum } from '@graph/types'

import { varietyColorMap } from '../../../../utils'

export type TPhase =
  'idle' | 'countdown' | 'contract' | 'hold' | 'release' | 'resting' | 'done'

export const ACTIVE_PHASES: TPhase[] = ['contract', 'hold', 'release']

interface IPhaseState {
  scale: number
  color: string
  translateY: number
  ringOffset: number
}

const RELAXED_COLOR = '#F2C6B6'
const RESTING_COLOR = '#B9C6D1'
const RING_CIRCUMFERENCE = 628.3
const STRENGTH_MAX_LIFT_PX = -40

const CONTRACT_MS: Record<Variety_Enum, number> = {
  [Variety_Enum.Pulse]: 280,
  [Variety_Enum.Intensity]: 480,
  [Variety_Enum.Resistance]: 600,
  [Variety_Enum.Strength]: 500,
}

const RELEASE_MS: Record<Variety_Enum, number> = {
  [Variety_Enum.Pulse]: 280,
  [Variety_Enum.Intensity]: 380,
  [Variety_Enum.Resistance]: 400,
  [Variety_Enum.Strength]: 500,
}

const minScaleFor = (variety: Variety_Enum, repIndex: number): number => {
  if (variety === Variety_Enum.Intensity) {
    return Math.max(0.42, 0.7 - 0.045 * repIndex)
  }

  const fixedMinScale: Record<Variety_Enum, number> = {
    [Variety_Enum.Pulse]: 0.62,
    [Variety_Enum.Intensity]: 0.7,
    [Variety_Enum.Resistance]: 0.6,
    [Variety_Enum.Strength]: 0.58,
  }

  return fixedMinScale[variety]
}

const easeOut = (t: number): number => 1 - (1 - t) ** 2
const easeInOut = (t: number): number =>
  t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2

const clampProgress = (elapsedMs: number, durationMs: number): number =>
  durationMs <= 0 ? 1 : Math.min(1, Math.max(0, elapsedMs / durationMs))

const lerp = (from: number, to: number, t: number): number =>
  from + (to - from) * t

const hexToRgb = (hex: string): [number, number, number] => {
  const value = hex.replace('#', '')
  return [
    parseInt(value.slice(0, 2), 16),
    parseInt(value.slice(2, 4), 16),
    parseInt(value.slice(4, 6), 16),
  ]
}

const rgbToHex = (r: number, g: number, b: number): string =>
  `#${[r, g, b].map((c) => Math.round(c).toString(16).padStart(2, '0')).join('')}`.toUpperCase()

const lerpColor = (from: string, to: string, t: number): string => {
  const [r1, g1, b1] = hexToRgb(from)
  const [r2, g2, b2] = hexToRgb(to)

  return rgbToHex(lerp(r1, r2, t), lerp(g1, g2, t), lerp(b1, b2, t))
}

export const phaseDurationMs = (
  phase: TPhase,
  variety: Variety_Enum,
  holdSeconds: number,
): number => {
  if (phase === 'contract') return CONTRACT_MS[variety]
  if (phase === 'release') return RELEASE_MS[variety]
  if (phase === 'hold') return holdSeconds * 1000
  return 0
}

interface IPhaseCalculatorArgs {
  elapsedMs: number
  variety: Variety_Enum
  repIndex: number
  holdSeconds: number
}

type TPhaseCalculator = (args: IPhaseCalculatorArgs) => IPhaseState

const contractState: TPhaseCalculator = ({ elapsedMs, variety, repIndex }) => {
  const varietyColor = varietyColorMap[variety].background
  const minScale = minScaleFor(variety, repIndex)
  const t = easeOut(clampProgress(elapsedMs, CONTRACT_MS[variety]))
  const translateY =
    variety === Variety_Enum.Strength ? lerp(0, STRENGTH_MAX_LIFT_PX, t) : 0

  return {
    scale: lerp(1, minScale, t),
    color: lerpColor(RELAXED_COLOR, varietyColor, t),
    translateY,
    ringOffset: 0,
  }
}

const holdState: TPhaseCalculator = ({
  elapsedMs,
  variety,
  repIndex,
  holdSeconds,
}) => {
  const varietyColor = varietyColorMap[variety].background
  const minScale = minScaleFor(variety, repIndex)
  const t = clampProgress(elapsedMs, holdSeconds * 1000)
  const translateY =
    variety === Variety_Enum.Strength ? STRENGTH_MAX_LIFT_PX : 0

  return {
    scale: minScale,
    color: varietyColor,
    translateY,
    ringOffset: lerp(RING_CIRCUMFERENCE, 0, t),
  }
}

const releaseState: TPhaseCalculator = ({ elapsedMs, variety, repIndex }) => {
  const varietyColor = varietyColorMap[variety].background
  const minScale = minScaleFor(variety, repIndex)
  const t = easeInOut(clampProgress(elapsedMs, RELEASE_MS[variety]))
  const translateY =
    variety === Variety_Enum.Strength ? lerp(STRENGTH_MAX_LIFT_PX, 0, t) : 0

  return {
    scale: lerp(minScale, 1, t),
    color: lerpColor(varietyColor, RELAXED_COLOR, t),
    translateY,
    ringOffset: 0,
  }
}

const restingState: TPhaseCalculator = () => ({
  scale: 1,
  color: RESTING_COLOR,
  translateY: 0,
  ringOffset: 0,
})

const relaxedState: TPhaseCalculator = () => ({
  scale: 1,
  color: RELAXED_COLOR,
  translateY: 0,
  ringOffset: 0,
})

const PHASE_CALCULATORS: Record<TPhase, TPhaseCalculator> = {
  idle: relaxedState,
  countdown: relaxedState,
  contract: contractState,
  hold: holdState,
  release: releaseState,
  resting: restingState,
  done: relaxedState,
}

export const computePhaseState = (
  phase: TPhase,
  elapsedMs: number,
  variety: Variety_Enum,
  repIndex: number,
  holdSeconds = 0,
): IPhaseState =>
  PHASE_CALCULATORS[phase]({ elapsedMs, variety, repIndex, holdSeconds })
