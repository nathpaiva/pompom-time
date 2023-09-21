import 'dotenv/config'

import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: [
    {
      [`${process.env.HASURA_API_GRAPHQL_ENDPOINT!}`]: {
        headers: {
          'X-Hasura-Admin-Secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET!,
        },
      },
    },
  ],

  documents: 'serverless/functions/**/*.graphql',
  generates: {
    'serverless/generated/graphql/GraphQLSchema.graphql': {
      plugins: ['schema-ast'],
    },
    'serverless/generated/graphql/GraphQLSchema.ts': {
      plugins: [
        {
          add: {
            content: '/* eslint-disable */',
          },
        },
        'typescript',
      ],
      config: {
        enumAsTypes: true,
        avoidOptionals: true,
        useImplementingTypes: true,
        skipTypename: false,
        dedupeFragments: true,
        exportFragmentSpreadSubTypes: true,
      },
    },
    '': {
      preset: 'near-operation-file',
      presetConfig: {
        extension: '.graphql.generated.ts',
        baseTypesPath: './serverless/generated/graphql/GraphQLSchema.graphql',
        folder: '__generated__',
      },
      plugins: [
        {
          add: {
            content: '/* eslint-disable */',
          },
        },
        'typescript',
        'typescript-operations',
        'typed-document-node',
      ],
      config: {
        enumAsTypes: true,
        avoidOptionals: true,
        useImplementingTypes: true,
        skipTypename: false,
        dedupeFragments: true,
        exportFragmentSpreadSubTypes: true,
        documentMode: 'documentNode',
      },
    },
  },
  hooks: {
    afterAllFileWrite: [
      './node_modules/.bin/prettier --config .prettierrc --ignore-path .prettierignore --write',
    ],
  },
}

export default config
