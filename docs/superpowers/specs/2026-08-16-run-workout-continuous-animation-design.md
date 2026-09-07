# Issue #104 — Run workout: continuous animation (rAF, ring, color lerp)

## Context

Sub-issue C of #88 (https://github.com/nathpaiva/pompom-time/issues/104), the last piece
of the run-workout redesign. Builds on:

- **#102** (merged, PR #105): static layout, no animation.
- **#103** (merged, PR #108): `usePulse` rewritten as an explicit phase state machine
  (`idle → countdown → contract → [hold] → release → resting → done`), plus a pure,
  fully-tested `computePhaseState(phase, elapsedMs, variety, repIndex, holdSeconds)` in
  `phaseMath.ts` that already returns `{ scale, color, translateY, ringOffset }` — but
  nothing calls it outside its own test file yet.

This issue wires that existing math into the actual render path: a `requestAnimationFrame`
loop drives the breathing circle's scale/color/lift continuously during `contract`/`hold`/
`release`, and an SVG ring sweeps during a Resistance `hold`.

## Goal

Replace the discrete phase "snap" from #103 with smooth, continuous motion, matching the
per-variety timing table already implemented in `phaseMath.ts`. No new animation math —
this issue is purely about calling the existing math every frame and rendering the result.

## Architecture

Three new pieces, one small addition to an existing hook:

1. **`usePulse.ts` (modified)** — exposes two values that already exist internally as refs:
   `phaseStartedAt: number` (timestamp the current phase began, adjusted for any prior pause)
   and `isPaused: boolean`. No behavior change — purely making existing internal state
   visible to the caller.
2. **`usePhaseAnimation` (new hook)** — takes `phase`, `phaseStartedAt`, `isPaused`,
   `variety`, `repIndex`, `holdSeconds`. Runs a `requestAnimationFrame` loop only while
   `phase` is `contract`, `hold`, or `release`. Each frame: computes
   `elapsedMs = Date.now() - phaseStartedAt`, calls `computePhaseState(...)`, and stores the
   result in `useState`. Returns `{ scale, color, translateY, ringOffset }`.
3. **`ProgressRing` (new component)** — isolated SVG (`r=100`, `stroke-width=6`,
   `stroke-dasharray=628.3`, `stroke-dashoffset={ringOffset}`), colored with the variety's
   color. Mounted by `BreathingCircle` only when `ringOffset > 0` (i.e. only during a
   Resistance `hold`) — `ProgressRing` itself doesn't decide whether to render, its parent
   does.
4. **`BreathingCircle` (modified)** — gains an optional prop `animatedStyle?: { scale,
   color, translateY, ringOffset }`. When present, applies these as inline
   `transform`/`backgroundColor` and renders `ProgressRing`. When absent (idle/countdown/
   resting/done), renders exactly as it does today — zero behavior change outside active
   animation.

`WorkoutTime.tsx` calls all three hooks (`usePulse`, `useWorkoutPhaseDisplay`,
`usePhaseAnimation`) and builds `animatedStyle` only when `pulse.phase` is one of
`contract`/`hold`/`release`; otherwise passes `undefined`.

## `usePhaseAnimation` behavior detail

```ts
const usePhaseAnimation = (
  phase: TPhase,
  phaseStartedAt: number,
  isPaused: boolean,
  variety: Variety_Enum,
  repIndex: number,
  holdSeconds: number,
): IPhaseState => {
  const [state, setState] = useState(() =>
    computePhaseState(phase, 0, variety, repIndex, holdSeconds),
  )

  useEffect(() => {
    const isActivePhase =
      phase === 'contract' || phase === 'hold' || phase === 'release'
    if (!isActivePhase || isPaused) return

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

- **Pause**: when `isPaused` flips to `true`, the effect's cleanup cancels the pending
  `requestAnimationFrame` — the last computed `state` stays in place, visually freezing the
  circle exactly where it was. This matches `usePulse`'s existing pause semantics from #103
  (elapsed time preserved, nothing resets).
- **Phase change**: when `phase` changes (e.g. `contract` → `hold`), the effect re-runs
  because `phase` is in its dependency array. `usePulse` updates `phaseStartedAt` at the
  moment it enters the new phase, so the new loop's `elapsedMs` calculation starts correctly
  from 0 for that phase.
- **Inactive phases**: outside `contract`/`hold`/`release`, the loop simply doesn't start.
  `WorkoutTime.tsx` never passes `animatedStyle` in that case anyway, so the stale `state`
  value is never read.

## Files to change

- `client/src/pages/WorkoutTime/hooks/usePulse/usePulse.ts` — expose `phaseStartedAt`,
  `isPaused` in the return value (both already tracked internally via refs).
- `client/src/pages/WorkoutTime/hooks/usePulse/types.ts` — add the two new fields to
  `IUsePulse`.
- `client/src/pages/WorkoutTime/hooks/usePhaseAnimation/` — new hook folder
  (`usePhaseAnimation.ts`, `index.ts`), following the project's hook-folder convention.
- `client/src/pages/WorkoutTime/components/ProgressRing/` — new component folder
  (`ProgressRing.tsx`, `ProgressRing.test.tsx`, `index.ts`).
- `client/src/pages/WorkoutTime/components/BreathingCircle/BreathingCircle.tsx` — add the
  optional `animatedStyle` prop, apply it conditionally, render `ProgressRing` when active.
- `client/src/pages/WorkoutTime/components/BreathingCircle/BreathingCircle.test.tsx` —
  extend with an `animatedStyle`-present case.
- `client/src/pages/WorkoutTime/WorkoutTime.tsx` — call `usePhaseAnimation`, build
  `animatedStyle`, pass to `BreathingCircle`.
- `playwright.config.ts` — `use.video` changed from `'retain-on-failure'` to `'on'`
  (see Testing section).

## Testing

**This section documents the test-coverage decision explicitly, since it departs from the
project's usual "every hook gets a `.test.ts`" pattern — worth a permanent record, not just
a chat answer.**

- **`phaseMath.test.ts`** (already exists, from #103, 13 tests): covers the actual
  animation math — `computePhaseState`'s scale/color/translateY/ringOffset values at 0%,
  50%, 100% of each phase, per variety. No change needed; this issue adds no new math, only
  a caller for math that's already correct and tested.
- **`usePhaseAnimation`**: **no unit test**, by deliberate decision (confirmed with Nath
  during brainstorming, matches the issue's own stated scope: "No new hook unit tests
  expected — verification is visual"). Rationale: the hook is a thin `requestAnimationFrame`
  loop that reads a timestamp and calls already-tested math — there's no independent logic
  inside it to assert on, and `vi.useFakeTimers()` doesn't advance `requestAnimationFrame`
  by default, so a real unit test would need to mock rAF itself, which turns into testing
  the mock rather than the behavior. Correctness comes from `phaseMath.test.ts` (the math)
  plus visual verification (the wiring).
- **`ProgressRing.test.tsx`** (new): render test asserting the `<circle>` receives the
  correct `stroke-dashoffset` for a given `ringOffset` prop, and that nothing renders when
  not mounted (parent's job, but confirm the component itself has no default-visible state).
- **`BreathingCircle.test.tsx`** (extended): existing tests (idle/static rendering, from
  #102/#103) must keep passing unchanged. New case: with `animatedStyle` provided, confirm
  the inline scale/color/translateY apply and `ProgressRing` renders when `ringOffset > 0`.
- **Playwright, `video: 'on'`**: Nath asked (comment on issue #104,
  https://github.com/nathpaiva/pompom-time/issues/104#issuecomment-5254157601) for an e2e
  **video**, not just a screenshot, to confirm the motion looks right — a static frame can't
  show whether the easing or the color lerp actually reads as intended. `playwright.config.ts`
  currently has `use.video: 'retain-on-failure'`, which only captures a failing run; changed
  to `'on'` so a passing run is also recorded. This is a global config change (Playwright
  doesn't support easily scoping video capture per-test) — it applies to every e2e spec in
  the project, not just this one. New/extended spec: drive a Resistance workout (the only
  variety that triggers the ring) through one full contract → hold → release cycle, let the
  video capture it, and do a manual eyeball pass against the recording before merging.

## Out of scope

- No change to `usePulse`'s state machine itself (phase transitions, timing table) — that's
  #103, already merged.
- No change to `phaseMath.ts`'s calculation logic — the math is correct and tested; this
  issue only adds a caller.
- The design prototype (`Pompom Time.dc.html`, in Nath's Claude Desktop design space) was
  not available to cross-check pixel values during this session (noted as a known gap in
  #103's plan doc too) — visual correctness is judged against the issue's written spec
  (colors, sizes, easing curves) and Nath's own eyeball pass on the recorded video, not
  against the original prototype file.

## What's next after this issue

#104 is the last sub-issue of #88. Once merged, #88 (the "Run workout screen +
breathing-circle animation" epic) can close. #89 (Progress screen) stays blocked pending a
Hasura session-history data source; #90 (Web dashboard) is unblocked and can start whenever.
