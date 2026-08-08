[![Netlify Status](https://api.netlify.com/api/v1/badges/5ac626a0-10f8-4841-aaca-914e8165f023/deploy-status)](https://app.netlify.com/sites/pompom-time/deploys)
[![wakatime](https://wakatime.com/badge/user/2aeba48e-4558-4f58-965a-fc1cd46ba978/project/1dcb0a23-e5be-4bd8-b37e-33c2a2e02ae2.svg)](https://wakatime.com/badge/user/2aeba48e-4558-4f58-965a-fc1cd46ba978/project/1dcb0a23-e5be-4bd8-b37e-33c2a2e02ae2)

# pompom time

Pompom Time it's and app to encourage women know more about their bodies.

## Project developed with:

To develop this project we are using the following technologies:

- [Docker](https://www.docker.com/)
- [Netlify](https://netlify.com/)
- [Hasura](https://hasura.io/)
- [React](https://reactjs.org/)
- [Chakra UI](https://chakra-ui.com/)

## Test developed with:

- [Vitest](https://vitest.dev/)

## To run the project you need to install:

- [Node](https://nodejs.org/en/download/)
- [Yarn](https://yarnpkg.com/lang/en/docs/install/)
- [Docker](https://www.docker.com/)
- [Hasura CLI](https://hasura.io/docs/latest/hasura-cli/install-hasura-cli/)

## Setup environment

Create a `.env` file based on the contents of `.env.template`, customizing values as follows:

- VITE_IDENTITY_URL: is the app URL
- HASURA_API_GRAPHQL_ENDPOINT: is the API graphql from Hasura

The following postgres env is created with docker.

- POSTGRES_USER: postgres config
- POSTGRES_PASS: postgres config
- POSTGRES_DBNAME: postgres config

- PG_DATABASE_URL: postgres://<user>:<pass>@<host:5432>/<db_name>
- HASURA_GRAPHQL_DATABASE_URL: postgres://<user>:<pass>@<host:5432>/<db_name>

[Hasura config](https://hasura.io/docs/latest/deployment/graphql-engine-flags/reference/)

- HASURA_GRAPHQL_ENABLE_CONSOLE
- HASURA_GRAPHQL_DEV_MODE
- HASURA_GRAPHQL_ENABLED_LOG_TYPES
- HASURA_GRAPHQL_ADMIN_SECRET

The following configs are used to setup the Hasura and are referent to the `hasura-pompom` folder:

- HASURA_GRAPHQL_METADATA_DIRECTORY
- HASURA_GRAPHQL_MIGRATIONS_DIRECTORY
- HASURA_GRAPHQL_SEEDS_DIRECTORY

This project uses a submodule to set up the Hasura. In order to have the migrations, seeds and metadata you must request the GitHub key to the codeowner of this project so you will able to fetch the private submodule. Check the submodule reference for more details [Submodule reference](#submodule-reference)

## Before starting the project you must install the dependencies:

```bash
yarn
```

## To start the project you have to run the commands:

This command with start the docker to create the DB and Graphql environment and after it will start the `front-end`

```bash
yarn dev
```

But if it is the first time you run the project locally, you also must create the "workouts" table. To do that, you can use the `hasura cli` and execute:

```bash
hasura migrate apply --envfile .env --database-name default
```

```bash
hasura seeds apply --envfile .env --database-name default
```

```bash
hasura metadata apply --envfile .env
```

## Graphql `query` and `mutation`

In case you need to create a new `query` or `mutation` after the file creation you can run the script to generate the `types` from the `schema`:

```bash
yarn codegen
```

## Project structure

- `client/` — the React app (pages, components, hooks)
- `serverless/` — Netlify Functions that talk to Hasura
- `hasura-pompom/` — Hasura config, migrations, and seeds (private submodule, see below)
- `e2e/` — Playwright end-to-end tests
- `bruno/` — Bruno API collection to call the serverless functions directly

## Tests

Unit and component tests (client and serverless) run with [Vitest](https://vitest.dev/):

```bash
yarn test              # client tests, single run
yarn test:watch        # client tests, watch mode
yarn test:coverage     # client tests with coverage

yarn test:serverless          # serverless tests, single run
yarn test:serverless:watch    # serverless tests, watch mode
yarn test:serverless:coverage # serverless tests with coverage
```

### End-to-end tests

End-to-end tests use [Playwright](https://playwright.dev/) and take a full-page screenshot in every test as visual proof. Playwright starts the app itself (`yarn dev`, so Docker must be running) and waits for it to be ready.

1. Copy `e2e/env.e2e.example` to `.env.e2e.local` (repo root) and fill in a real test user from the Netlify Identity instance the app points to (`VITE_IDENTITY_URL`)
2. Run the suite:

```bash
yarn test:e2e         # run all e2e tests
yarn test:e2e:ui      # run with the Playwright UI, step by step
yarn test:e2e:report  # open the HTML report from the last run
```

Screenshots are saved to `e2e/screenshots/` (gitignored).

## Lint and build

```bash
yarn lint    # type-check + eslint, client and serverless
yarn format  # eslint --fix, client and serverless
yarn build   # type-check + vite build
```

## API requests with Bruno

The `bruno/` folder has a ready-to-use [Bruno](https://www.usebruno.com/) collection to call every serverless function directly, including a login request that stores the auth token automatically. See [bruno/README.md](bruno/README.md) for setup.

## Submodule reference

This project uses a git submodule (`hasura-pompom`) for Hasura metadata, migrations, and seeds. You need access from the codeowner to fetch it.

```bash
git submodule init
git submodule update
```
