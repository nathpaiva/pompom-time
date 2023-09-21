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

## Before starting the project you must install the dependencies:

```bash
yarn
```

## To start the project you have to run the commands:

This command with start the docker to create the DB and Graphql environment and after it will start the `front-end`

```bash
yarn dev
```

But if is the first time you are running locally, we also have to create the "workouts" table. In order to do that, you can use the `hasura cli` and execute:

```bash
hasura migrate apply --envfile .env --database-name default
```

```bash
hasura metadata apply --envfile .env
```

## Graphql `query` and `mutation`

In case you need to create a new `query` or `mutation` after the file creation you can run the script to generate the `types` from the `schema`:

```bash
yarn codegen
```

✅ Done! Enjoy the app and send new ideas.
