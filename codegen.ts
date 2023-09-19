import 'dotenv/config'

import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: [
    {
      [`${process.env.HASURA_API_URL!}`]: {
        headers: {
          'X-Hasura-Admin-Secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET!,
        },
      },
    },
  ],

  documents: 'functions/**/*.graphql',
  generates: {
    'generated/graphql/GraphQLSchema.graphql': {
      plugins: ['schema-ast'],
    },
    'generated/graphql/GraphQLSchema.ts': {
      plugins: ['typescript'],
      config: {
        enumAsTypes: true,
        avoidOptionals: true,
        useImplementingTypes: true,
        skipTypename: false,
        dedupeFragments: true,
        exportFragmentSpreadSubTypes: true,
        // inputMaybeValue: undefined | null | T,
      },
    },
    '': {
      preset: 'near-operation-file',
      presetConfig: {
        extension: '.graphql.generated.ts',
        baseTypesPath: './generated/graphql/GraphQLSchema.graphql',
        folder: '__generated__',
      },
      plugins: ['typescript', 'typescript-operations', 'typed-document-node'],
    },
  },
  hooks: {
    afterAllFileWrite: [
      './node_modules/.bin/prettier --config .prettierrc --ignore-path .prettierignore --write',
    ],
  },
}

export default config
