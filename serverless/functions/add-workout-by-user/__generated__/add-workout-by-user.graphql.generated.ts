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

export type AddWorkoutByUserMutationVariables = Exact<{
  user_id: string
  name: string
  variety: Types.Variety_Enum
  interval?: number | null | undefined
  repeat: boolean
  goal_per_day: number
  rest: number
  squeeze: number
}>

export type AddWorkoutByUserMutation = {
  insert_workouts: {
    returning: Array<{
      __typename: 'workouts'
      user_id: string
      created_at: string
      updated_at: string
      id: string
      name: string
      variety: Types.Variety_Enum
      interval: number | null
      repeat: boolean
      goal_per_day: number
      rest: number
      squeeze: number
    }>
  } | null
}

export const AddWorkoutByUserDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'AddWorkoutByUser' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'user_id' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'name' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'variety' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'Variety_enum' },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'interval' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Float' } },
          defaultValue: { kind: 'NullValue' },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'repeat' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'Boolean' },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'goal_per_day' },
          },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'Float' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'rest' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'Float' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'squeeze' },
          },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'Float' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'insert_workouts' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'objects' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'user_id' },
                      value: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'user_id' },
                      },
                    },
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'name' },
                      value: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'name' },
                      },
                    },
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'variety' },
                      value: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'variety' },
                      },
                    },
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'interval' },
                      value: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'interval' },
                      },
                    },
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'repeat' },
                      value: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'repeat' },
                      },
                    },
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'goal_per_day' },
                      value: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'goal_per_day' },
                      },
                    },
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'rest' },
                      value: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'rest' },
                      },
                    },
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'squeeze' },
                      value: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'squeeze' },
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
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'user_id' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'created_at' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'updated_at' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'variety' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'interval' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'repeat' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'goal_per_day' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'rest' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'squeeze' },
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
  AddWorkoutByUserMutation,
  AddWorkoutByUserMutationVariables
>
