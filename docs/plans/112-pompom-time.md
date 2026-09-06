# Plan — Issue #112: deep links 404 on hard reload (Netlify SPA fallback)

Issue: https://github.com/nathpaiva/pompom-time/issues/112

## Branches

Work started on: `fix/112-pompom-time-spa-redirect` (branched from `main`)
Worktree: `.claude/worktrees/fix-112-pompom-time-spa-redirect`

| # | Branch | Branched from | Carries | Status |
|---|--------|---------------|---------|--------|
| 1 | `fix/112-pompom-time-spa-redirect` | `main` | Everything | in progress |

## Context

On production, opening or hard-reloading any route that is not `/` shows
Netlify's own **Page not found** 404. Steps: go to
`https://pompom-time.netlify.app/admin/workout` (or reload while on it).

Cause: the app uses `createBrowserRouter` (client-side routing). Netlify serves
the static files from `dist/`. There is no rule telling Netlify to serve
`index.html` for unknown paths, so every non-root URL 404s on a real page load.
`netlify.toml` has no redirect block and there is no `_redirects` file.

Affected paths: `/login`, `/logout`, `/admin/workout`, `/admin/workout/new`,
`/admin/workout/start/:id`.

Outcome: any URL loads the app. React Router then renders the right screen (or
its own not-found). Netlify's 404 page never shows for an app route.

## Approach

### 1. Add the SPA catch-all to `netlify.toml`

Add one block to the existing `netlify.toml`:

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Why `netlify.toml` and not a `public/_redirects` file:

- All Netlify config already lives in `netlify.toml`. One file, tracked.
- It is a plain text assertion in the test below, with **no build step
  needed**. A `public/_redirects` check would depend on Vite copying `public/`
  into `dist/`, so the test would need `yarn build` first. CI has no build job.
- Netlify matches real files and functions (`/.netlify/functions/*`) *before*
  redirects, so the catch-all does not shadow JS, CSS, or API calls.

### 2. Guard the regression with a config test

New file at repo root: `redirects.config.test.ts`

- Reads `netlify.toml` as text.
- Asserts the SPA catch-all rule is present: a redirect from `/*` to
  `/index.html` with status `200`.
- Plain string / regex checks. No TOML parser dependency.

This runs inside the existing `test-client` CI job (`yarn test:ci`) with zero
CI changes. Vitest picks up root-level `*.test.ts`; the client coverage config
only includes `client/src/**`, so this file does not touch coverage numbers.

The e2e route was dropped on purpose: a Playwright test against `yarn dev` can
not fail without the fix, because the Vite dev server already serves
`index.html` for unknown routes. Only production static hosting reproduces the
404, so the honest cheap guard is the config assertion.

## Files

| File | Change |
|---|---|
| `netlify.toml` | add `[[redirects]]` catch-all block |
| `redirects.config.test.ts` (new, repo root) | assert the rule exists in `netlify.toml` |

## Test cases

- `redirects.config.test.ts`
  - `describe('netlify.toml redirects')`
    - `it('should serve index.html for unknown paths (SPA fallback)')` — assert
      the file contains a redirect with `from = "/*"`, `to = "/index.html"`,
      `status = 200`.

## Verification

Run in the worktree, node 24:

1. `yarn test` — new test passes, full client suite green (was 84, now 85).
2. `yarn lint` — clean (`tsc --noEmit` + eslint).
3. Local production-like check:
   - `yarn build`
   - `npx netlify dev --dir dist --port 8899` (serves the built output, applies
     `netlify.toml` redirects, no docker/functions)
   - `curl -s -o /dev/null -w "%{http_code}" http://localhost:8899/admin/workout`
     → `200`
   - `curl -s http://localhost:8899/admin/workout | grep -q 'id="root"'`
     → matches (the app shell, not Netlify's 404 HTML)
4. After merge, on the Netlify deploy preview: hard-visit
   `/admin/workout`, `/admin/workout/start/anything`, `/login` in the browser.
   The app renders. No Netlify 404. This is the before/after evidence for the
   issue.

## Project skills

- None specific. Standard Vitest test (`globals: true`, no import of
  `describe`/`it`). Follow `describe` → `it('should ...')` shape from
  `CLAUDE.md`.
