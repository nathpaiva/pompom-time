# Plan — Issue #113: app renders in dark mode in production

Issue: https://github.com/nathpaiva/pompom-time/issues/113

## Branches

Work started on: `fix/113-pompom-time-dark-mode` (branched from `main`)
Worktree: `.claude/worktrees/fix-113-pompom-time-dark-mode`

| # | Branch | Branched from | Carries | Status |
|---|--------|---------------|---------|--------|
| 1 | `fix/113-pompom-time-dark-mode` | `main` | Everything | done |

### What shipped on branch 1

Followed the plan: `main.tsx` got `ColorModeScript` + a `colorModeManager` that
always returns `light` and ignores writes, `theme.ts` got `styles.global.body`
with `pompom.bg` / `pompom.text`. `e2e/color-mode.spec.ts` was written exactly
as planned.

Two deviations from the plan, both environment, not code:

- **Merged `main` mid-branch.** This branch was created before #118 existed.
  While writing the e2e spec, `yarn dev` broke in a way unrelated to this
  fix — turned out to be the #112 `netlify.toml` redirect breaking the dev
  proxy (see issue #118, fixed and merged separately as PR #119). Merged
  `origin/main` into this branch afterward to pick up that fix before
  continuing.
- **e2e not run.** After the #118 merge, `yarn dev` / `yarn ntl dev` could not
  stay up in this environment: Netlify's internal functions-serve relay
  repeatedly failed to bind on a freshly-freed random port
  ("Port N is already in use"), a known `netlify-cli` race between picking a
  port and binding it. Confirmed clean each time (no listener on the port a
  moment before), restarted OrbStack, still failed — 5 attempts total. Not
  something fixable from the app code. `e2e/color-mode.spec.ts` is in the repo
  and matches the plan, but is **not locally verified**. `yarn test` (91
  passing) and `yarn lint` (clean) are what actually ran.

Needs a manual check once `yarn dev` is stable in this environment again:
open `/login` and `/admin/workout` with `chakra-ui-color-mode` preset to
`dark` in `localStorage`, confirm the cream background.

## Context

On production the whole app shows a dark navy background, not the cream
`#F3ECE7` from the redesign. Text set in `pompom.text` (dark) becomes
unreadable: "Welcome back" on the sign-in screen, "Select workout:" on the
workout list, the search placeholder.

It looks fine in a fresh browser and broken in a browser that used the old
app. Cause:

- PR #97 set `config.initialColorMode: 'light'` in
  `client/src/utils/theme.ts`, but `initialColorMode` only applies on the
  **first ever** visit. Chakra then stores the choice in
  `localStorage['chakra-ui-color-mode']`. Every existing user still has `dark`
  stored from the old build, so Chakra keeps rendering dark.
- `main.tsx` has no `<ColorModeScript />`, so the first paint has no mode hint
  either.
- `theme.ts` `styles.global` styles `main` but not `body`, so the page
  background falls back to Chakra's color-mode default (`gray.800` in dark)
  instead of `pompom.bg`.

This app has no color-mode toggle anywhere (`grep` finds no `useColorMode`
usage). It is a light-only app. The fix pins it to light for everyone,
regardless of what is in their `localStorage`.

Outcome: `/login`, `/admin/workout` and every other screen render on the cream
`pompom.bg` background with readable text, in every browser, on the first
paint.

## Approach

Stack: Chakra UI v2.10.10, React 19, emotion 11. `ChakraProvider` and
`ColorModeScript` both come from `@chakra-ui/react`.

### 1. `client/src/main.tsx` — pin the color mode to light

- Add `<ColorModeScript initialColorMode="light" />` as the first child inside
  `ChakraProvider` (or just before it), so the first paint has the mode.
- Pass a `colorModeManager` to `ChakraProvider` that always reports `light` and
  ignores writes:

  ```tsx
  const lightOnlyColorModeManager = {
    type: 'localStorage' as const,
    ssr: false,
    get: (): 'light' => 'light',
    set: () => {},
  }
  ```

  `ChakraProvider` accepts `colorModeManager` (type `StorageManager` from
  `@chakra-ui/react`). This removes color mode as a variable — a stale `dark`
  value in `localStorage` can no longer take effect, and nothing in the app
  can flip it.

### 2. `client/src/utils/theme.ts` — set the page background

Add to `styles.global`, next to the existing `main` and `ul` entries:

```ts
body: {
  bg: 'pompom.bg',
  color: 'pompom.text',
},
```

With the mode pinned to light, the transparent `Card variant="unstyled"`
containers in `Workout.tsx` / `ListWorkouts.tsx` now sit on this cream
background, so their `pompom.text` headings are readable. No container changes
needed (decided with Nath: those belong to the redesign issues #88/#89/#90).

### 3. Guard test — `e2e/color-mode.spec.ts` (new)

Playwright, following the existing `e2e/login.spec.ts` shape (screenshot in
every test, `e2e/screenshots/<name>.png`).

- Each test first simulates a stale user:
  `await page.addInitScript(() => localStorage.setItem('chakra-ui-color-mode', 'dark'))`.
- Test 1: `goto('/login')` → full-page screenshot → assert the computed
  `background-color` of `body` is `rgb(243, 236, 231)` (`#F3ECE7`, the
  `pompom.bg` token), and the "Welcome back" heading is visible.
- Test 2: `loginAsTestUser()` (fixture in `e2e/fixtures.ts`) → land on
  `/admin/workout` → full-page screenshot → assert the same `body` background
  and that the "Select workout:" heading is visible.

Asserting the exact token value is intentional: `pompom.bg` is a config
constant, so a change to it is a deliberate act the test should track.

## Files

| File | Change |
|---|---|
| `client/src/main.tsx` | add `ColorModeScript` + `colorModeManager` that forces light |
| `client/src/utils/theme.ts` | add `styles.global.body` with `pompom.bg` / `pompom.text` |
| `e2e/color-mode.spec.ts` (new) | Playwright guard: stale `dark` in `localStorage`, assert cream background on `/login` and `/admin/workout` |

## Test cases

- `e2e/color-mode.spec.ts`
  - `describe('color mode')`
    - `it('renders /login on the cream background even with dark stored')`
    - `it('renders the workout list on the cream background even with dark stored')`

## Verification

Run in the worktree (`.claude/worktrees/fix-113-pompom-time-dark-mode`,
node 24):

1. `yarn test` — full client suite still green (91 tests, no new client
   tests here).
2. `yarn lint` — clean (`tsc --noEmit` + eslint).
3. `yarn test:e2e` (needs docker + `.env.e2e.local`, both already set up) —
   `color-mode.spec.ts` passes. The two screenshots under
   `e2e/screenshots/` are the "after" evidence.
4. Manual: `yarn dev`, open devtools console, run
   `localStorage.setItem('chakra-ui-color-mode','dark')`, hard reload. The app
   still renders cream, not navy.

## Evidence (before / after)

- The e2e spec is the "before" too: run `color-mode.spec.ts` on this branch
  **before** the fix. It fails the background assertion and the screenshots
  show the dark navy page. Capture those, then re-run after the fix for the
  cream screenshots.
- Publish a before/after artifact page: `/login` navy → cream, `/admin/workout`
  navy → cream. Same account, URL and viewport for both columns.

## Project skills

- None specific. Playwright test follows `e2e/login.spec.ts`. Vitest style from
  `CLAUDE.md` does not apply (this is an e2e spec, not a Vitest test).
