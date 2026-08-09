/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never
    }
import * as Types from '../../../generated/graphql/GraphQLSchema'

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core'
export type Variety_Enum =
  /** intensity workout */
  | 'intensity'
  /** pulse workout */
  | 'pulse'
  /** resistance workout */
  | 'resistance'
  /** strength workout */
  | 'strength'

export type DeleteWorkoutByIdMutationVariables = Exact<{
  id: string | null | undefined
}>

export type DeleteWorkoutByIdMutation = {
  delete_workouts: {
    returning: Array<{
      __typename: 'workouts'
      name: string
      id: string
      variety: Types.Variety_Enum
      created_at: string
      updated_at: string
    }>
  } | null
}

export const DeleteWorkoutByIdDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'DeleteWorkoutById' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'delete_workouts' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'where' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'id' },
                      value: {
                        kind: 'ObjectValue',
                        fields: [
                          {
                            kind: 'ObjectField',
                            name: { kind: 'Name', value: '_eq' },
                            value: {
                              kind: 'Variable',
                              name: { kind: 'Name', value: 'id' },
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'returning' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: '__typename' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'variety' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'created_at' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'updated_at' },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  DeleteWorkoutByIdMutation,
  DeleteWorkoutByIdMutationVariables
>
