# Pompom Time

An app to help women track and run timed workouts (pulse/resistance/intensity
sets with rest and countdown timers).

## Stack

- **Client**: React 18 + Vite + Chakra UI + react-hook-form + TanStack Query,
  routed with react-router-dom, auth via `react-netlify-identity` (Netlify
  Identity).
- **Backend**: Netlify Functions (`serverless/functions/`) calling Hasura
  GraphQL over Postgres.
- **Types**: generated end-to-end from the Hasura schema via
  `graphql-codegen` (see the enum gotcha below — this is the sharpest edge in
  the codebase right now).
- **Tests**: Vitest (client + serverless, separate configs) and Playwright
  (e2e, screenshots as visual proof).

## Project structure

```
client/src/
  components/     shared components (Content, Navigation, PageTitle, ProtectedRoute)
  hooks/          shared data-fetching hooks (useAddWorkoutByUserId, useGetWorkoutById, ...)
  pages/          one folder per route: About, Login, Logout, Workout, WorkoutTime
  routes/         router.tsx (route table)
  utils/          theme.ts (Chakra theme), testWrapper.tsx (shared test render)
serverless/
  functions/      one folder per Netlify Function, kebab-case = endpoint path
  generated/graphql/  shared schema output, aliased as @graph/types
  utils/          cross-function utilities (ErrorHandler, graphqlClient, ...)
hasura-pompom/    private git submodule: Hasura metadata, migrations, seeds
e2e/              Playwright tests
bruno/            Bruno API collection (call serverless functions directly)
```

### Feature folder anatomy

Every page under `client/src/pages/<Feature>/` follows the same shape:

```
<Feature>/
  <Feature>.tsx       main component
  index.ts            barrel: export * from './<Feature>'
  types.ts             (optional)
  constants.ts          (optional)
  components/          feature-local components, each in its own folder
    <Component>/<Component>.tsx + index.ts
  hooks/                feature-local hooks
    index.ts
    use<X>.ts            OR use<X>/{use<X>.ts, types.ts, index.ts, use<X>.test.ts}
  __tests__/            page-level tests + shared mock data (mockDataResponse.ts)
```

Barrel `index.ts` files are used everywhere — every component/hook/feature
folder has one. Coverage config explicitly excludes them
(`client/src/**/index.ts`) so don't worry about testing a barrel.

Nesting can go arbitrarily deep for sub-components
(`Workout/components/ListWorkouts/components/Dialog/hooks/useDialog.ts`).

### Serverless function anatomy

Each `serverless/functions/<name>/` folder contains:

```
<name>.ts                              middy handler, exports `handler`
<name>.graphql                          the GraphQL operation (codegen input)
<name>.test.ts                          hits a real dockerized Hasura, not mocked
bodySchema.ts                           JSON schema for @middy/validator
types.ts                                hand-written wrapper types
__generated__/<name>.graphql.generated.ts   codegen output, regenerate with `yarn codegen`
```

## Commands

```bash
yarn dev                # docker (postgres+hasura) + netlify dev — main local command
yarn start              # vite only, no functions/docker (functions calls will fail)
yarn build              # tsc + vite build

yarn test                    # client tests, single run
yarn test:watch              # client tests, watch mode
yarn test:coverage           # client tests + coverage

yarn test:serverless         # serverless tests, single run (needs docker running)
yarn test:serverless:watch
yarn test:serverless:coverage

yarn test:e2e            # playwright — boots yarn dev itself, needs docker + .env.e2e.local
yarn test:e2e:ui         # playwright UI mode, step through
yarn test:e2e:report     # open last HTML report

yarn lint                # tsc --noEmit + eslint, client and serverless
yarn format               # eslint --fix, client and serverless

yarn codegen              # regenerates @graph/types AND every function's __generated__/
                           # run this after adding/editing any .graphql file
```

## Environment setup

1. Copy `.env.template` → `.env`, fill in values (Netlify Identity URL,
   Hasura endpoint/secret, Postgres config — see the template for the full
   list).
2. `hasura-pompom/` is a **private git submodule**. You need codeowner
   access. `git submodule init && git submodule update`.
3. First run only: apply migrations/seeds/metadata —
   `hasura migrate apply --envfile .env --database-name default`,
   `hasura seeds apply --envfile .env --database-name default`,
   `hasura metadata apply --envfile .env`.
4. For e2e: copy `e2e/env.e2e.example` → `.env.e2e.local` (repo root) and
   fill in a real test user from the Netlify Identity instance.

## Conventions

### Naming

- Components: PascalCase, folder name = component name = file name
  (`AddWorkout/AddWorkout.tsx` exports `AddWorkout`).
- Hooks: `use` + PascalCase, often mirrors the serverless endpoint it calls
  (`useAddWorkoutByUserId` ↔ `add-workout-by-user`).
- Types: `T` prefix for type aliases (`TAddWorkoutVariable`, `TUsePulse`),
  `I` prefix for interfaces (`IUsePulse`, `IErrorHandler`). This is a loose
  convention, not lint-enforced — plain PascalCase without a prefix also
  shows up for props types (`LoginFormProps`) and codegen types (`Workouts`).
- Hand-written enums: `Enum` suffix on the name (`EnumFormType`), lowercase
  values. Codegen enums follow Hasura's own convention
  (`Variety_Enum`, values PascalCase).
- Serverless function folders: kebab-case, matches the endpoint path.

### Hooks

Four shapes show up repeatedly — match whichever fits:

1. **Mutation hook** (`useAddWorkoutByUserId.ts`): generic `<T, V>`, forwards
   `{ onSuccess, onSettled }` straight into `useMutation`, wraps
   `authedFetch` in try/catch, shows a Chakra `useToast` on error.
2. **Query hook** (`useGetWorkoutById.ts`): generic `<T>`, wraps `useQuery`,
   handles JWT refresh inline in `queryFn`, a `useEffect` reacts to
   `isError` to navigate away or toast.
3. **Local state machine, no fetching** (`usePulse.ts`): plain
   `useState`/`useRef`/`useCallback`/`useMemo`/`useEffect`, typed via a
   function type alias in a sibling `types.ts`.
4. **Composite form hook** (`useIdentityForm.ts`): combines multiple
   `useForm()` instances, each wired to its own mutation, returns one
   aggregated object.

`@tanstack/query/exhaustive-deps` is lint-enforced — don't silence it,
fix the dependency array.

### Forms

react-hook-form throughout. Pattern:

```tsx
const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<Shape>()
// ...
<Input {...register('field', { required: '...' })} />
// eslint-disable-next-line react/jsx-props-no-spreading
```

The `jsx-props-no-spreading` disable comment is expected every time —
it's a deliberate override for the `register()` spread, not something to
work around differently. `handleSubmit(onSubmit, onInvalid)` (two-arg form)
handles both valid and invalid submits. `watch('field')` drives conditional
rendering. `reset()` runs in the mutation's `onSuccess`/`onSettled`.

### Chakra UI

Style props directly on components (`p="1rem"`, `colorScheme="purple"`) —
`sx` is used sparingly, mostly for conditional display
(`sx={{ display: isResistance ? 'grid' : 'none' }}`). Theme customization
lives in `client/src/utils/theme.ts` (the floating-label `Form` variant used
by every input). Use `FormControl`/`FormLabel`/`FormErrorMessage` with
`isInvalid={!!errors.field}` for any validated field.

### Tests

- Vitest with `globals: true` — no need to import `describe`/`it`.
- Structure: `describe(Feature)` → `describe(sub-behavior)` → `it('should ...')`.
- Client tests import from `@utils/test`
  (`client/src/utils/testWrapper.tsx`), not `@testing-library/react`
  directly — it wraps `BrowserRouter` → `QueryClientProvider` →
  `ChakraProvider` and pre-mocks `react-netlify-identity`'s
  `useIdentityContext` (exported as `_hoisted_useIdentityContext` for tests
  to override with `vi.mocked(...).mockReturnValue(...)`).
- Mock data lives in `__tests__/mockDataResponse.ts` per feature and gets
  reused by related hook tests elsewhere (e.g. `usePulse.test.ts` imports
  `Workout/__tests__/mockDataResponse`).
- Serverless tests hit a **real dockerized Hasura**, not a mock — they build
  fake Lambda event/context via `createMockContext`/
  `createMockHandlerEventBody` (`serverless/setup-server-tests.ts`) and call
  the real `handler`, cleaning up created rows in `afterEach` via
  `cleanupDbAfterTest`.
- Client coverage thresholds are intentionally below 90 right now
  (`lines: 70, functions: 80, statements: 70, branches: 80` in
  `vite.config.ts`) with a TODO to raise them — don't be surprised by the
  low bar, it's tracked, not a target to match.
- Timer-based hooks (like `usePulse`): use `vi.useFakeTimers()` +
  `act(() => vi.advanceTimersByTime(...))`, not real waits — real-timer
  tests here are slow and flaky (see the `usePulse.test.ts` history).
- Playwright e2e tests take a full-page screenshot in every test — treat
  that as a deliverable, not an afterthought.

## Known gotchas

### The `Variety_Enum` triple-import trap

**Always import `Variety_Enum` (and other schema types) from `@graph/types`.
Never from a function's `__generated__` folder or a re-export chain that
traces back to one.**

`yarn codegen` emits `Variety_Enum` in at least three separate places from
one `graphql-codegen` run:

1. `serverless/generated/graphql/GraphQLSchema.ts` — the shared schema,
   aliased as `@graph/types` in `tsconfig.json`. **This is the one to use.**
2. Every `serverless/functions/*/__generated__/*.graphql.generated.ts` —
   the near-operation-file preset re-declares the whole enum per function.
3. Hand-written re-export chains that quietly pick up #2 instead of #1 —
   e.g. `client/src/pages/WorkoutTime/hooks/usePulse/types.ts` currently
   imports `Variety_Enum` from
   `serverless/functions/delete-workout-by-id/__generated__/...`, while
   `client/src/pages/WorkoutTime/types.ts` imports the same-named enum from
   `@graph/types`. Both get used across the `WorkoutTime` feature.

TypeScript enums are nominal, so these three are content-identical but
type-incompatible. They happen to stay in sync today because one `yarn
codegen` run regenerates all of them from the same schema — but a value
typed against one import path is not assignable to a parameter typed
against another, and `eslint`'s `no-unsafe-enum-comparison` will catch some
but not all of the fallout. If you touch anything using `Variety_Enum` and
hit a baffling type error, check which file it's imported from before
assuming the value itself is wrong.

### Netlify Identity requires a real auth flow in e2e

Login can't be faked with a token — `e2e/fixtures.ts`'s `loginAsTestUser()`
drives the real login form against the real Netlify Identity instance in
`.env.e2e.local`. There's no local/mock identity provider in this project.

### Two independent Vitest configs

`vite.config.ts` (client) and `serverless/vite.config.ts` (serverless) are
separate — each excludes the other's folder, and both exclude `e2e/`
(Playwright's `test.describe()` isn't Vitest-compatible and will crash
the run if picked up). If you add a new top-level test folder, exclude it
in both configs.
