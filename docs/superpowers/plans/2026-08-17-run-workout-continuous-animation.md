# Run Workout Continuous Animation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire the already-tested `computePhaseState` math from `phaseMath.ts` into the actual render path via a `requestAnimationFrame` loop, so the breathing circle animates smoothly through contract/hold/release instead of snapping between discrete states.

**Architecture:** `usePulse` exposes two new fields (`phaseStartedAt`, `isPaused`) that already exist internally as refs. A new `usePhaseAnimation` hook runs a rAF loop only during `contract`/`hold`/`release`, calling `computePhaseState` every frame and returning `{ scale, color, translateY, ringOffset }`. `BreathingCircle` gets an optional `animatedStyle` prop it applies as inline style when present, and renders a new isolated `ProgressRing` SVG component when `ringOffset > 0`. `WorkoutTime.tsx` wires the three hooks together.

**Tech Stack:** React 18, TypeScript, Chakra UI, Vitest, Playwright.

**Spec:** `docs/superpowers/specs/2026-08-16-run-workout-continuous-animation-design.md`

## Global Constraints

- No change to `usePulse`'s state machine transitions or timing table — only exposing two already-tracked internal values.
- No change to `phaseMath.ts`'s calculation logic — `computePhaseState` is correct and fully tested (13 tests), this plan only adds a caller.
- `usePhaseAnimation` gets **no unit test** — confirmed in the spec's Testing section, correctness comes from `phaseMath.test.ts` (the math) plus visual verification (the wiring). Do not add one.
- `BreathingCircle`'s existing static-rendering behavior (idle/countdown/resting/done, no `animatedStyle` passed) must not change — existing tests in `BreathingCircle.test.tsx` must keep passing unmodified.
- `playwright.config.ts`'s `use.video` changes from `'retain-on-failure'` to `'on'` — global change, applies to every e2e spec, not just this feature's.
- Follow the project's hook-folder convention: `use<X>/{use<X>.ts, index.ts}` (no `types.ts` needed here — types live inline or import from `phaseMath.ts`).
- Follow the project's component-folder convention: `<Component>/{<Component>.tsx, <Component>.test.tsx, index.ts}`.

---

## File Structure

```
client/src/pages/WorkoutTime/
  hooks/
    usePulse/
      usePulse.ts              MODIFY — expose phaseStartedAt, isPaused
      types.ts                  MODIFY — add 2 fields to IUsePulse
    usePhaseAnimation/          NEW folder
      usePhaseAnimation.ts      NEW — rAF loop hook
      index.ts                  NEW — barrel
    index.ts                    MODIFY — export usePhaseAnimation
  components/
    ProgressRing/                NEW folder
      ProgressRing.tsx           NEW — SVG ring component
      ProgressRing.test.tsx      NEW — render test
      index.ts                    NEW — barrel
    BreathingCircle/
      BreathingCircle.tsx        MODIFY — animatedStyle prop, renders ProgressRing
      BreathingCircle.test.tsx   MODIFY — add animatedStyle test case
    index.ts                    MODIFY — export ProgressRing
  WorkoutTime.tsx                MODIFY — wire usePhaseAnimation, build animatedStyle
playwright.config.ts             MODIFY — video: 'on'
e2e/workout-time.spec.ts         MODIFY — Resistance workout animation video capture
```

---

## Task 1: Expose `phaseStartedAt` and `isPaused` from `usePulse`

**Files:**
- Modify: `client/src/pages/WorkoutTime/hooks/usePulse/usePulse.ts`
- Modify: `client/src/pages/WorkoutTime/hooks/usePulse/types.ts`
- Test: `client/src/pages/WorkoutTime/hooks/usePulse/usePulse.test.ts`

**Interfaces:**
- Consumes: nothing new — `usePulse` already tracks `phaseStartedAtRef` (a `useRef<number>`) and `pausedElapsedMsRef` (a `useRef<number | undefined>`) internally.
- Produces: `IUsePulse` gains two fields consumed by Task 3 (`usePhaseAnimation`):
  - `phaseStartedAt: number` — timestamp (ms since epoch) the current phase began, already adjusted for any prior pause via the existing `enterPhaseRef.current(phase, elapsedMs)` logic.
  - `isPaused: boolean` — `true` when `pausedElapsedMsRef.current !== undefined`.

`usePulse.ts` currently keeps `phaseStartedAtRef` and `pausedElapsedMsRef` as refs only — refs don't trigger re-renders, so a consumer reading them via the hook's return value needs them mirrored into state (same pattern already used for `phase`/`repIndex`/`setIndex` earlier in this file) so the returned value updates when they change.

- [ ] **Step 1: Write the failing test**

Add to `client/src/pages/WorkoutTime/hooks/usePulse/usePulse.test.ts` (existing file, uses `vi.useFakeTimers()` throughout — follow that pattern):

```ts
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
```

This test file already imports `Variety_Enum` from `@graph/types`, `act`/`renderHook` from `@testing-library/react`, and `mockDataResponse` from `../../../Workout/__tests__/mockDataResponse` — no new imports needed.

- [ ] **Step 2: Run test to verify it fails**

Run: `yarn test usePulse`
Expected: FAIL — `result.current.phaseStartedAt` and `result.current.isPaused` are `undefined` (not yet returned by the hook).

- [ ] **Step 3: Add the two fields to `IUsePulse`**

In `client/src/pages/WorkoutTime/hooks/usePulse/types.ts`, add to the `IUsePulse` interface:

```ts
interface IUsePulse {
  phase: TPhase
  repIndex: number
  setIndex: number
  countingDownInterval: number
  restingInterval: number
  phaseStartedAt: number
  isPaused: boolean
  handleStartStopPulse: () => void
  handleReset: () => void
}
```

- [ ] **Step 4: Mirror the two refs into state and return them**

In `client/src/pages/WorkoutTime/hooks/usePulse/usePulse.ts`, add state alongside the existing `phase`/`repIndex`/`setIndex` state declarations (near line 20-25):

```ts
const [phaseStartedAt, setPhaseStartedAt] = useState(0)
const [isPaused, setIsPaused] = useState(false)
```

The hook already writes to `phaseStartedAtRef.current` inside `enterPhaseRef.current` (the block starting `enterPhaseRef.current = (next: TPhase, elapsedMs = 0) => { setPhaseState(next); phaseStartedAtRef.current = Date.now() - elapsedMs ...`). Add a state sync right after that assignment:

```ts
enterPhaseRef.current = (next: TPhase, elapsedMs = 0) => {
  setPhaseState(next)
  phaseStartedAtRef.current = Date.now() - elapsedMs
  setPhaseStartedAt(phaseStartedAtRef.current)

  // ...rest unchanged
}
```

The hook already writes to `pausedElapsedMsRef.current` in `pause()` and clears it in `resume()`. Add state syncs there:

```ts
const pause = useCallback(() => {
  pausedElapsedMsRef.current = Date.now() - phaseStartedAtRef.current
  setIsPaused(true)
  clearPendingTimer()
}, [clearPendingTimer])

const resume = useCallback(() => {
  const elapsedMs = pausedElapsedMsRef.current ?? 0
  pausedElapsedMsRef.current = undefined
  setIsPaused(false)
  enterPhaseRef.current(phaseRef.current, elapsedMs)
}, [])
```

Finally, add both to the hook's return statement at the bottom:

```ts
return {
  phase,
  repIndex,
  setIndex,
  countingDownInterval,
  restingInterval,
  phaseStartedAt,
  isPaused,
  handleStartStopPulse,
  handleReset,
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `yarn test usePulse`
Expected: PASS — all tests in the file, including the new one.

- [ ] **Step 6: Run the full test suite and lint**

Run: `yarn test && yarn lint`
Expected: All tests pass, 0 lint errors (the pre-existing `AddWorkout.tsx` React Compiler warning is expected and unrelated).

- [ ] **Step 7: Commit**

```bash
git add client/src/pages/WorkoutTime/hooks/usePulse/usePulse.ts client/src/pages/WorkoutTime/hooks/usePulse/types.ts client/src/pages/WorkoutTime/hooks/usePulse/usePulse.test.ts
git commit -m "feat: expose phaseStartedAt and isPaused from usePulse"
```

---

## Task 2: Build `ProgressRing` component

**Files:**
- Create: `client/src/pages/WorkoutTime/components/ProgressRing/ProgressRing.tsx`
- Create: `client/src/pages/WorkoutTime/components/ProgressRing/ProgressRing.test.tsx`
- Create: `client/src/pages/WorkoutTime/components/ProgressRing/index.ts`
- Modify: `client/src/pages/WorkoutTime/components/index.ts`

**Interfaces:**
- Consumes: nothing from earlier tasks — pure presentational component.
- Produces: `ProgressRing` component consumed by Task 4 (`BreathingCircle`):
  ```ts
  interface ProgressRingProps {
    ringOffset: number  // 0-628.3, the stroke-dashoffset value
    color: string        // hex color for the stroke
  }
  ```

Per the spec: `r=100`, `stroke-width=6`, `stroke-dasharray=628.3` (the ring's fixed circumference — matches `RING_CIRCUMFERENCE` in `phaseMath.ts`), `stroke-dashoffset={ringOffset}`. `ProgressRing` always renders when mounted — the decision of *whether* to mount it (only when `ringOffset > 0`) belongs to its parent (`BreathingCircle`, Task 4), not to `ProgressRing` itself.

- [ ] **Step 1: Write the failing test**

```tsx
// client/src/pages/WorkoutTime/components/ProgressRing/ProgressRing.test.tsx
import { render } from '@utils/test'

import { ProgressRing } from './ProgressRing'

describe('Component::ProgressRing', () => {
  it('should render a circle with the given stroke-dashoffset and color', () => {
    const { container } = render(
      <ProgressRing ringOffset={314.15} color="#655D8A" />,
    )

    const circle = container.querySelector('circle')
    expect(circle).not.toBeNull()
    expect(circle).toHaveAttribute('stroke-dashoffset', '314.15')
    expect(circle).toHaveAttribute('stroke', '#655D8A')
    expect(circle).toHaveAttribute('r', '100')
    expect(circle).toHaveAttribute('stroke-width', '6')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `yarn test ProgressRing`
Expected: FAIL — `Cannot find module './ProgressRing'`.

- [ ] **Step 3: Write the component**

```tsx
// client/src/pages/WorkoutTime/components/ProgressRing/ProgressRing.tsx
const RING_CIRCUMFERENCE = 628.3

interface ProgressRingProps {
  ringOffset: number
  color: string
}

export const ProgressRing = ({ ringOffset, color }: ProgressRingProps) => {
  return (
    <svg
      width="220"
      height="220"
      viewBox="0 0 220 220"
      style={{ position: 'absolute', transform: 'rotate(-90deg)' }}
    >
      <circle
        cx="110"
        cy="110"
        r="100"
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeDasharray={RING_CIRCUMFERENCE}
        strokeDashoffset={ringOffset}
        strokeLinecap="round"
      />
    </svg>
  )
}
```

Note: `strokeDasharray`/`strokeDashoffset` are React camelCase props that render to the `stroke-dasharray`/`stroke-dashoffset` DOM attributes the test asserts on. `rotate(-90deg)` makes the sweep start from the top of the circle (12 o'clock) rather than the default 3 o'clock — matches the visual convention of a "loading ring."

- [ ] **Step 4: Create the barrel export**

```ts
// client/src/pages/WorkoutTime/components/ProgressRing/index.ts
export * from './ProgressRing'
```

- [ ] **Step 5: Add to the components barrel**

Modify `client/src/pages/WorkoutTime/components/index.ts`:

```ts
export * from './BreathingCircle'
export * from './ProgressRing'
export * from './RepDots'
export * from './VarietySwitcher'
export * from './WorkoutControls'
```

- [ ] **Step 6: Run test to verify it passes**

Run: `yarn test ProgressRing`
Expected: PASS.

- [ ] **Step 7: Run lint**

Run: `yarn lint`
Expected: 0 errors.

- [ ] **Step 8: Commit**

```bash
git add client/src/pages/WorkoutTime/components/ProgressRing client/src/pages/WorkoutTime/components/index.ts
git commit -m "feat: add ProgressRing SVG component"
```

---

## Task 3: Build `usePhaseAnimation` hook

**Files:**
- Create: `client/src/pages/WorkoutTime/hooks/usePhaseAnimation/usePhaseAnimation.ts`
- Create: `client/src/pages/WorkoutTime/hooks/usePhaseAnimation/index.ts`
- Modify: `client/src/pages/WorkoutTime/hooks/index.ts`

**Interfaces:**
- Consumes:
  - `computePhaseState` from `../usePulse/phaseMath` — signature `(phase: TPhase, elapsedMs: number, variety: Variety_Enum, repIndex: number, holdSeconds?: number) => { scale: number; color: string; translateY: number; ringOffset: number }` (already exists, from #103, fully tested).
  - `TPhase` type from `../usePulse/phaseMath`.
- Produces: `usePhaseAnimation` hook consumed by Task 5 (`WorkoutTime.tsx`):
  ```ts
  const usePhaseAnimation: (
    phase: TPhase,
    phaseStartedAt: number,
    isPaused: boolean,
    variety: Variety_Enum,
    repIndex: number,
    holdSeconds: number,
  ) => { scale: number; color: string; translateY: number; ringOffset: number }
  ```

**No unit test for this task** — per the Global Constraints and the spec's Testing section. `phaseMath.test.ts` (existing, 13 tests) already covers the math this hook calls; the hook itself has no independent logic beyond "run rAF, call the math, store the result." Verification is visual (Task 6).

- [ ] **Step 1: Write the hook**

```ts
// client/src/pages/WorkoutTime/hooks/usePhaseAnimation/usePhaseAnimation.ts
import { useEffect, useState } from 'react'

import { Variety_Enum } from '@graph/types'

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
      setState(computePhaseState(phase, elapsedMs, variety, repIndex, holdSeconds))
      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(rafId)
  }, [phase, phaseStartedAt, isPaused, variety, repIndex, holdSeconds])

  return state
}
```

Note: `Variety_Enum` is imported from `@graph/types` directly (per the project's documented gotcha — never from a function's `__generated__` folder or a re-export chain).

- [ ] **Step 2: Create the barrel export**

```ts
// client/src/pages/WorkoutTime/hooks/usePhaseAnimation/index.ts
export * from './usePhaseAnimation'
```

- [ ] **Step 3: Add to the hooks barrel**

Modify `client/src/pages/WorkoutTime/hooks/index.ts`:

```ts
export * from './usePhaseAnimation'
export * from './usePulse'
export * from './useWorkoutPhaseDisplay'
```

- [ ] **Step 4: Run the full test suite and lint to confirm nothing broke**

Run: `yarn test && yarn lint`
Expected: All existing tests still pass (this task adds no new tests, per the constraint above), 0 lint errors.

- [ ] **Step 5: Commit**

```bash
git add client/src/pages/WorkoutTime/hooks/usePhaseAnimation client/src/pages/WorkoutTime/hooks/index.ts
git commit -m "feat: add usePhaseAnimation rAF hook"
```

---

## Task 4: Wire `animatedStyle` and `ProgressRing` into `BreathingCircle`

**Files:**
- Modify: `client/src/pages/WorkoutTime/components/BreathingCircle/BreathingCircle.tsx`
- Modify: `client/src/pages/WorkoutTime/components/BreathingCircle/BreathingCircle.test.tsx`

**Interfaces:**
- Consumes: `ProgressRing` from `../ProgressRing` (Task 2).
- Produces: `BreathingCircle`'s new prop shape consumed by Task 5 (`WorkoutTime.tsx`):
  ```ts
  interface BreathingCircleProps {
    variety: Variety_Enum
    phaseLabel: string
    statusText: string
    motionDescription: string
    animatedStyle?: {
      scale: number
      color: string
      translateY: number
      ringOffset: number
    }
  }
  ```

When `animatedStyle` is `undefined` (idle/countdown/resting/done), rendering is byte-identical to today — this is the regression guard the existing test in `BreathingCircle.test.tsx` already covers and must keep passing unmodified.

- [ ] **Step 1: Write the failing test**

Add to `client/src/pages/WorkoutTime/components/BreathingCircle/BreathingCircle.test.tsx` (existing file — keep the existing `it` block unchanged, add a new one):

```tsx
it('should apply animatedStyle and render the progress ring when ringOffset > 0', () => {
  const { container } = render(
    <BreathingCircle
      variety={Variety_Enum.Resistance}
      phaseLabel="Squeeze"
      statusText="hold"
      motionDescription="Hold the squeeze, then let go slow."
      animatedStyle={{
        scale: 0.6,
        color: '#655D8A',
        translateY: 0,
        ringOffset: 314.15,
      }}
    />,
  )

  const circle = container.querySelector('circle')
  expect(circle).not.toBeNull()
  expect(circle).toHaveAttribute('stroke-dashoffset', '314.15')
})

it('should not render the progress ring when animatedStyle is absent', () => {
  const { container } = render(
    <BreathingCircle
      variety={Variety_Enum.Pulse}
      phaseLabel="Ready"
      statusText="0/6"
      motionDescription="Quick squeeze and release, light and fast."
    />,
  )

  expect(container.querySelector('circle')).toBeNull()
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `yarn test BreathingCircle`
Expected: FAIL — the two new tests fail (`animatedStyle` prop doesn't exist yet, `ProgressRing` never renders).

- [ ] **Step 3: Update the component**

```tsx
// client/src/pages/WorkoutTime/components/BreathingCircle/BreathingCircle.tsx
import { Box, Text } from '@chakra-ui/react'
import { Variety_Enum } from '@graph/types'

import { varietyColorMap } from '../../../../utils'
import { ProgressRing } from '../ProgressRing'

interface AnimatedStyle {
  scale: number
  color: string
  translateY: number
  ringOffset: number
}

interface BreathingCircleProps {
  variety: Variety_Enum
  phaseLabel: string
  statusText: string
  motionDescription: string
  animatedStyle?: AnimatedStyle
}

export const BreathingCircle = ({
  variety,
  phaseLabel,
  statusText,
  motionDescription,
  animatedStyle,
}: BreathingCircleProps) => {
  const varietyColor = varietyColorMap[variety]
  const backgroundColor = animatedStyle?.color ?? varietyColor.background
  const transform = animatedStyle
    ? `scale(${animatedStyle.scale}) translateY(${animatedStyle.translateY}px)`
    : undefined

  return (
    <Box display="grid" justifyContent="center" rowGap="3">
      <Box
        width="240px"
        height="240px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        position="relative"
      >
        {animatedStyle && animatedStyle.ringOffset > 0 && (
          <ProgressRing
            ringOffset={animatedStyle.ringOffset}
            color={varietyColor.background}
          />
        )}
        <Box
          width="210px"
          height="210px"
          borderRadius="pompomPill"
          bg={backgroundColor}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          gap="1"
          style={{ transform }}
        >
          <Text
            fontFamily="heading"
            fontWeight="700"
            fontSize="11px"
            textTransform="uppercase"
            color="white"
            opacity="0.8"
          >
            {phaseLabel}
          </Text>
          <Text
            fontFamily="heading"
            fontWeight="700"
            fontSize="38px"
            color="white"
          >
            {statusText}
          </Text>
        </Box>
      </Box>

      <Text fontSize="13px" color="pompom.textMuted" textAlign="center">
        {motionDescription}
      </Text>
    </Box>
  )
}
```

Note: `bg` (Chakra style prop, string) is used for the static case exactly as before; when `animatedStyle` is present, `backgroundColor` becomes the interpolated hex string from `computePhaseState` — still a valid `bg` value (Chakra accepts any CSS color string, not just theme tokens). `transform` is applied via the native `style` prop (not a Chakra style prop) since it changes every frame — routing 60fps updates through Chakra's style-prop-to-emotion pipeline would be slower than a plain inline `style` object.

- [ ] **Step 4: Run test to verify it passes**

Run: `yarn test BreathingCircle`
Expected: PASS — all three tests (the original + two new ones).

- [ ] **Step 5: Run the full test suite and lint**

Run: `yarn test && yarn lint`
Expected: All tests pass, 0 lint errors.

- [ ] **Step 6: Commit**

```bash
git add client/src/pages/WorkoutTime/components/BreathingCircle
git commit -m "feat: apply animatedStyle and progress ring to BreathingCircle"
```

---

## Task 5: Wire `usePhaseAnimation` into `WorkoutTime.tsx`

**Files:**
- Modify: `client/src/pages/WorkoutTime/WorkoutTime.tsx`

**Interfaces:**
- Consumes: `usePhaseAnimation` (Task 3), `BreathingCircle`'s new `animatedStyle` prop (Task 4), `pulse.phaseStartedAt` / `pulse.isPaused` (Task 1).
- Produces: nothing further — this is the final wiring point, no other task depends on `WorkoutTime.tsx`'s internals.

`usePhaseAnimation` needs `holdSeconds` — this value already exists inside `usePulse.ts` (computed from `variety === Resistance ? interval : 0`) but isn't currently exposed. Rather than exposing a fourth new field from `usePulse`, recompute it in `WorkoutTime.tsx` from the same `data` the component already has — it's a one-line derivation, not worth threading through the hook's return value.

- [ ] **Step 1: Update `WorkoutTime.tsx`**

```tsx
// client/src/pages/WorkoutTime/WorkoutTime.tsx
import { ArrowBackIcon } from '@chakra-ui/icons'
import { Box, Heading, IconButton, Spinner, Text } from '@chakra-ui/react'
import { Variety_Enum, Workouts } from '@graph/types'
import { Link } from 'react-router-dom'

import { useGetWorkoutById } from '../../hooks'
import {
  BreathingCircle,
  RepDots,
  VarietySwitcher,
  WorkoutControls,
} from './components'
import { motionDescriptionByVariety } from './constants'
import { usePhaseAnimation, usePulse, useWorkoutPhaseDisplay } from './hooks'

const ANIMATED_PHASES = ['contract', 'hold', 'release']

export const WorkoutTime = () => {
  const { data, isLoading } = useGetWorkoutById<Workouts>()
  const pulse = usePulse(data)
  const {
    phaseLabel,
    statusText,
    completedReps,
    primaryLabel,
    isPrimaryDisabled,
    isResetDisabled,
  } = useWorkoutPhaseDisplay(pulse, data)

  const holdSeconds =
    data?.variety === Variety_Enum.Resistance ? (data.interval ?? 0) : 0

  const animation = usePhaseAnimation(
    pulse.phase,
    pulse.phaseStartedAt,
    pulse.isPaused,
    data?.variety ?? Variety_Enum.Pulse,
    pulse.repIndex,
    holdSeconds,
  )

  if (isLoading || !data) {
    return <Spinner />
  }

  const currentSet =
    pulse.phase === 'done'
      ? data.goal_per_day
      : Math.min(pulse.setIndex + 1, data.goal_per_day)

  const animatedStyle = ANIMATED_PHASES.includes(pulse.phase)
    ? animation
    : undefined

  return (
    <Box display="grid" rowGap="5" p="4" maxW="350" mx="auto">
      <Box display="flex" alignItems="center" gap="3">
        <IconButton
          as={Link}
          to="/admin/workout"
          aria-label="Back"
          icon={<ArrowBackIcon />}
          variant="ghost"
        />
        <Box>
          <Heading fontFamily="heading" fontWeight="700" fontSize="17px">
            {data.name}
          </Heading>
          <Text fontSize="12px" color="pompom.textMuted">
            Set {currentSet} of {data.goal_per_day}
          </Text>
        </Box>
      </Box>

      <VarietySwitcher activeVariety={data.variety} />

      <BreathingCircle
        variety={data.variety}
        phaseLabel={phaseLabel}
        statusText={statusText}
        motionDescription={motionDescriptionByVariety[data.variety]}
        animatedStyle={animatedStyle}
      />

      <RepDots
        totalReps={data.squeeze}
        completedReps={completedReps}
        variety={data.variety}
      />

      <WorkoutControls
        primaryLabel={primaryLabel}
        isPrimaryDisabled={isPrimaryDisabled}
        isResetDisabled={isResetDisabled}
        onPrimaryClick={pulse.handleStartStopPulse}
        onResetClick={pulse.handleReset}
      />
    </Box>
  )
}
```

Note: `usePhaseAnimation` is called unconditionally, before the `isLoading || !data` early return — same rule already applied to `usePulse`/`useWorkoutPhaseDisplay` in this file (React's rules of hooks forbid calling a hook after a conditional return). `data?.variety ?? Variety_Enum.Pulse` is a safe placeholder while `data` is still loading; `usePhaseAnimation`'s rAF loop only actually runs once `pulse.phase` reaches an active phase, which can't happen before `data` loads (there's no workout to start).

- [ ] **Step 2: Run the existing `WorkoutTime.test.tsx` to confirm no regression**

Run: `yarn test WorkoutTime`
Expected: PASS — the existing test (idle-state rendering, from #102/#103) is unaffected since `animatedStyle` is `undefined` in the idle phase.

- [ ] **Step 3: Run the full test suite and lint**

Run: `yarn test && yarn lint`
Expected: All tests pass, 0 lint errors.

- [ ] **Step 4: Commit**

```bash
git add client/src/pages/WorkoutTime/WorkoutTime.tsx
git commit -m "feat: wire usePhaseAnimation into WorkoutTime"
```

---

## Task 6: Enable video capture and verify the animation visually

**Files:**
- Modify: `playwright.config.ts`
- Modify: `e2e/workout-time.spec.ts`

**Interfaces:**
- Consumes: the fully wired animation from Tasks 1-5 — this task is pure verification, no new production code.
- Produces: nothing consumed by other tasks — this is the final task in the plan.

- [ ] **Step 1: Change video capture mode**

In `playwright.config.ts`, find the `use` block (`use: { baseURL: ..., trace: ..., screenshot: ..., video: 'retain-on-failure' }`) and change:

```ts
video: 'on',
```

- [ ] **Step 2: Extend the e2e spec to exercise a Resistance workout through one full cycle**

Read the existing `e2e/workout-time.spec.ts` first (from #102/#103) to match its style — it uses `loginAsTestUser()` from `./fixtures` and clicks a workout's "Start" link. Add a new test:

```ts
test('animates a Resistance workout through contract, hold, and release', async ({
  page,
}) => {
  const startLink = page.getByRole('link', { name: 'Start' }).first()

  const hasWorkout = await startLink
    .waitFor({ state: 'visible', timeout: 10000 })
    .then(() => true)
    .catch(() => false)

  test.skip(
    !hasWorkout,
    'No workout in the test user account. Create one first.',
  )

  await startLink.click()
  await page.waitForURL('**/admin/workout/start/*')

  await page.getByRole('button', { name: 'Start workout' }).click()

  // countdown (3s) + one full contract/hold/release cycle, generous margin
  await page.waitForTimeout(8000)

  await page.screenshot({
    path: 'e2e/screenshots/workout-time-mid-animation.png',
    fullPage: true,
  })
})
```

This test doesn't assert on animation frame values (that's `phaseMath.test.ts`'s job) — its purpose is to exercise the real app for the required duration so Playwright's `video: 'on'` setting captures the motion for manual review. `test.skip` mirrors the existing test's pattern for when the test account has no workout set up.

Note: if the test account's first workout isn't a Resistance variety, this test won't show the `hold` phase or the ring — that's fine for this task (any variety demonstrates contract/release color-lerp and scale), but flag to Nath that a Resistance-variety workout should exist in the test account to fully verify the ring sweep.

- [ ] **Step 3: Run the e2e spec against the local dev server**

Run: `yarn dev` (needs Docker running), then in a separate terminal: `yarn test:e2e -- --grep "animates a Resistance workout"`
Expected: Test passes (or skips, if no workout exists in the test account — in that case, ask Nath to confirm a workout exists before treating this task as done).

- [ ] **Step 4: Locate and review the captured video**

Run: `yarn test:e2e:report` to open the HTML report, or find the `.webm` file directly under `test-results/`.
Expected: A video showing the breathing circle smoothly scaling and changing color through at least one contract/release cycle (and a visible ring sweep, if the tested workout is Resistance).

- [ ] **Step 5: Manual eyeball pass**

Watch the video. Confirm:
- The circle scales down smoothly during contract (no snap/jump).
- The color visibly blends from the relaxed peach tone toward the variety's color.
- The circle scales back up smoothly during release.
- If Resistance: the ring sweeps around the circle during hold, and the circle stays flat (no scale change) while the ring sweeps.

If anything looks wrong (jank, wrong direction, wrong color), that's a bug to fix before merging — return to the relevant task above, fix, and re-run this task's verification.

- [ ] **Step 6: Commit**

```bash
git add playwright.config.ts e2e/workout-time.spec.ts
git commit -m "test: capture e2e video and verify continuous animation"
```

---

## Self-Review Notes

- **Spec coverage**: All 4 spec pieces (usePulse exposure, usePhaseAnimation, ProgressRing, BreathingCircle wiring) map to Tasks 1-5. The spec's Testing section (no unit test for the rAF hook, video capture) maps to Task 3's constraint and Task 6.
- **Type consistency**: `IUsePulse` (Task 1) → consumed by `usePhaseAnimation`'s parameter list (Task 3) → consumed by `WorkoutTime.tsx` (Task 5) — `phase: TPhase`, `phaseStartedAt: number`, `isPaused: boolean` match across all three. `BreathingCircleProps.animatedStyle` (Task 4) matches the exact return shape of `usePhaseAnimation` (Task 3) and `computePhaseState` (pre-existing) — `{ scale, color, translateY, ringOffset }`, no renaming across tasks.
- **No placeholders**: every step has real, complete code — no "add appropriate styling" or "similar to Task N" shortcuts.
