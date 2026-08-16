import { Variety_Enum } from '@graph/types'

import { computePhaseState } from './phaseMath'

describe('computePhaseState', () => {
  describe('Pulse', () => {
    it('should hold scale 1 and relaxed color at the start of contract', () => {
      const result = computePhaseState('contract', 0, Variety_Enum.Pulse, 0)

      expect(result.scale).toBeCloseTo(1)
      expect(result.color).toBe('#F2C6B6')
      expect(result.translateY).toBe(0)
    })

    it('should reach minScale and the variety color at the end of contract', () => {
      const result = computePhaseState('contract', 280, Variety_Enum.Pulse, 0)

      expect(result.scale).toBeCloseTo(0.62)
      expect(result.color).toBe('#D885A3')
    })

    it('should ease back to scale 1 at the end of release', () => {
      const result = computePhaseState('release', 280, Variety_Enum.Pulse, 0)

      expect(result.scale).toBeCloseTo(1)
    })

    it('should have no translateY lift, unlike Strength', () => {
      const result = computePhaseState('contract', 280, Variety_Enum.Pulse, 0)

      expect(result.translateY).toBe(0)
    })
  })

  describe('Intensity', () => {
    it('should use minScale 0.7 minus 0.045 per rep, floored at 0.42', () => {
      const rep0 = computePhaseState('contract', 480, Variety_Enum.Intensity, 0)
      const rep2 = computePhaseState('contract', 480, Variety_Enum.Intensity, 2)
      const rep20 = computePhaseState(
        'contract',
        480,
        Variety_Enum.Intensity,
        20,
      )

      expect(rep0.scale).toBeCloseTo(0.7)
      expect(rep2.scale).toBeCloseTo(0.7 - 0.045 * 2)
      expect(rep20.scale).toBeCloseTo(0.42)
    })
  })

  describe('Resistance', () => {
    it('should reach minScale 0.6 at the end of contract', () => {
      const result = computePhaseState(
        'contract',
        600,
        Variety_Enum.Resistance,
        0,
      )

      expect(result.scale).toBeCloseTo(0.6)
    })

    it('should stay flat at minScale through hold', () => {
      const start = computePhaseState('hold', 0, Variety_Enum.Resistance, 0)
      const mid = computePhaseState('hold', 5000, Variety_Enum.Resistance, 0)

      expect(start.scale).toBeCloseTo(0.6)
      expect(mid.scale).toBeCloseTo(0.6)
    })

    it('should sweep ringOffset from 628.3 to 0 across the hold duration', () => {
      const holdSeconds = 10
      const start = computePhaseState(
        'hold',
        0,
        Variety_Enum.Resistance,
        0,
        holdSeconds,
      )
      const mid = computePhaseState(
        'hold',
        5000,
        Variety_Enum.Resistance,
        0,
        holdSeconds,
      )
      const end = computePhaseState(
        'hold',
        10000,
        Variety_Enum.Resistance,
        0,
        holdSeconds,
      )

      expect(start.ringOffset).toBeCloseTo(628.3)
      expect(mid.ringOffset).toBeCloseTo(314.15, 1)
      expect(end.ringOffset).toBeCloseTo(0)
    })

    it('should have ringOffset 0 outside of hold', () => {
      const result = computePhaseState(
        'contract',
        300,
        Variety_Enum.Resistance,
        0,
      )

      expect(result.ringOffset).toBe(0)
    })
  })

  describe('Strength', () => {
    it('should reach minScale 0.58 at the end of contract', () => {
      const result = computePhaseState(
        'contract',
        500,
        Variety_Enum.Strength,
        0,
      )

      expect(result.scale).toBeCloseTo(0.58)
    })

    it('should lift translateY toward -40px proportional to contraction depth', () => {
      const start = computePhaseState('contract', 0, Variety_Enum.Strength, 0)
      const end = computePhaseState('contract', 500, Variety_Enum.Strength, 0)

      expect(start.translateY).toBeCloseTo(0)
      expect(end.translateY).toBeCloseTo(-40)
    })
  })

  describe('resting / idle / countdown / done', () => {
    it('should return scale 1 and the flat resting color', () => {
      const result = computePhaseState('resting', 0, Variety_Enum.Pulse, 0)

      expect(result.scale).toBeCloseTo(1)
      expect(result.color).toBe('#B9C6D1')
      expect(result.translateY).toBe(0)
      expect(result.ringOffset).toBe(0)
    })

    it('should return relaxed scale/color for idle, countdown and done', () => {
      ;(['idle', 'countdown', 'done'] as const).forEach((phase) => {
        const result = computePhaseState(phase, 0, Variety_Enum.Pulse, 0)

        expect(result.scale).toBeCloseTo(1)
        expect(result.color).toBe('#F2C6B6')
      })
    })
  })
})
