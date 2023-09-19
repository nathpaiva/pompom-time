import * as Types from '../../../generated/graphql/GraphQLSchema'

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core'
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>
}
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never }
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never
    }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string }
  String: { input: string; output: string }
  Boolean: { input: boolean; output: boolean }
  Int: { input: number; output: number }
  Float: { input: number; output: number }
  numeric: { input: any; output: any }
  timestamptz: { input: any; output: any }
  uuid: { input: any; output: any }
}

/** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
export type Boolean_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Boolean']['input']>
  _gt?: InputMaybe<Scalars['Boolean']['input']>
  _gte?: InputMaybe<Scalars['Boolean']['input']>
  _in?: InputMaybe<Array<Scalars['Boolean']['input']>>
  _is_null?: InputMaybe<Scalars['Boolean']['input']>
  _lt?: InputMaybe<Scalars['Boolean']['input']>
  _lte?: InputMaybe<Scalars['Boolean']['input']>
  _neq?: InputMaybe<Scalars['Boolean']['input']>
  _nin?: InputMaybe<Array<Scalars['Boolean']['input']>>
}

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type String_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['String']['input']>
  _gt?: InputMaybe<Scalars['String']['input']>
  _gte?: InputMaybe<Scalars['String']['input']>
  /** does the column match the given case-insensitive pattern */
  _ilike?: InputMaybe<Scalars['String']['input']>
  _in?: InputMaybe<Array<Scalars['String']['input']>>
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: InputMaybe<Scalars['String']['input']>
  _is_null?: InputMaybe<Scalars['Boolean']['input']>
  /** does the column match the given pattern */
  _like?: InputMaybe<Scalars['String']['input']>
  _lt?: InputMaybe<Scalars['String']['input']>
  _lte?: InputMaybe<Scalars['String']['input']>
  _neq?: InputMaybe<Scalars['String']['input']>
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: InputMaybe<Scalars['String']['input']>
  _nin?: InputMaybe<Array<Scalars['String']['input']>>
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: InputMaybe<Scalars['String']['input']>
  /** does the column NOT match the given pattern */
  _nlike?: InputMaybe<Scalars['String']['input']>
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: InputMaybe<Scalars['String']['input']>
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: InputMaybe<Scalars['String']['input']>
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: InputMaybe<Scalars['String']['input']>
  /** does the column match the given SQL regular expression */
  _similar?: InputMaybe<Scalars['String']['input']>
}

/** ordering argument of a cursor */
export enum Cursor_Ordering {
  /** ascending ordering of the cursor */
  Asc = 'ASC',
  /** descending ordering of the cursor */
  Desc = 'DESC',
}

/** mutation root */
export type Mutation_Root = {
  __typename?: 'mutation_root'
  /** delete data from the table: "workouts" */
  delete_workouts?: Maybe<Workouts_Mutation_Response>
  /** delete single row from the table: "workouts" */
  delete_workouts_by_pk?: Maybe<Workouts>
  /** insert data into the table: "workouts" */
  insert_workouts?: Maybe<Workouts_Mutation_Response>
  /** insert a single row into the table: "workouts" */
  insert_workouts_one?: Maybe<Workouts>
  /** update data of the table: "workouts" */
  update_workouts?: Maybe<Workouts_Mutation_Response>
  /** update single row of the table: "workouts" */
  update_workouts_by_pk?: Maybe<Workouts>
  /** update multiples rows of table: "workouts" */
  update_workouts_many?: Maybe<Array<Maybe<Workouts_Mutation_Response>>>
}

/** mutation root */
export type Mutation_RootDelete_WorkoutsArgs = {
  where: Workouts_Bool_Exp
}

/** mutation root */
export type Mutation_RootDelete_Workouts_By_PkArgs = {
  id: Scalars['uuid']['input']
}

/** mutation root */
export type Mutation_RootInsert_WorkoutsArgs = {
  objects: Array<Workouts_Insert_Input>
  on_conflict?: InputMaybe<Workouts_On_Conflict>
}

/** mutation root */
export type Mutation_RootInsert_Workouts_OneArgs = {
  object: Workouts_Insert_Input
  on_conflict?: InputMaybe<Workouts_On_Conflict>
}

/** mutation root */
export type Mutation_RootUpdate_WorkoutsArgs = {
  _inc?: InputMaybe<Workouts_Inc_Input>
  _set?: InputMaybe<Workouts_Set_Input>
  where: Workouts_Bool_Exp
}

/** mutation root */
export type Mutation_RootUpdate_Workouts_By_PkArgs = {
  _inc?: InputMaybe<Workouts_Inc_Input>
  _set?: InputMaybe<Workouts_Set_Input>
  pk_columns: Workouts_Pk_Columns_Input
}

/** mutation root */
export type Mutation_RootUpdate_Workouts_ManyArgs = {
  updates: Array<Workouts_Updates>
}

/** Boolean expression to compare columns of type "numeric". All fields are combined with logical 'AND'. */
export type Numeric_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['numeric']['input']>
  _gt?: InputMaybe<Scalars['numeric']['input']>
  _gte?: InputMaybe<Scalars['numeric']['input']>
  _in?: InputMaybe<Array<Scalars['numeric']['input']>>
  _is_null?: InputMaybe<Scalars['Boolean']['input']>
  _lt?: InputMaybe<Scalars['numeric']['input']>
  _lte?: InputMaybe<Scalars['numeric']['input']>
  _neq?: InputMaybe<Scalars['numeric']['input']>
  _nin?: InputMaybe<Array<Scalars['numeric']['input']>>
}

/** column ordering options */
export enum Order_By {
  /** in ascending order, nulls last */
  Asc = 'asc',
  /** in ascending order, nulls first */
  AscNullsFirst = 'asc_nulls_first',
  /** in ascending order, nulls last */
  AscNullsLast = 'asc_nulls_last',
  /** in descending order, nulls first */
  Desc = 'desc',
  /** in descending order, nulls first */
  DescNullsFirst = 'desc_nulls_first',
  /** in descending order, nulls last */
  DescNullsLast = 'desc_nulls_last',
}

export type Query_Root = {
  __typename?: 'query_root'
  /** fetch data from the table: "workouts" */
  workouts: Array<Workouts>
  /** fetch aggregated fields from the table: "workouts" */
  workouts_aggregate: Workouts_Aggregate
  /** fetch data from the table: "workouts" using primary key columns */
  workouts_by_pk?: Maybe<Workouts>
}

export type Query_RootWorkoutsArgs = {
  distinct_on?: InputMaybe<Array<Workouts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Workouts_Order_By>>
  where?: InputMaybe<Workouts_Bool_Exp>
}

export type Query_RootWorkouts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Workouts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Workouts_Order_By>>
  where?: InputMaybe<Workouts_Bool_Exp>
}

export type Query_RootWorkouts_By_PkArgs = {
  id: Scalars['uuid']['input']
}

export type Subscription_Root = {
  __typename?: 'subscription_root'
  /** fetch data from the table: "workouts" */
  workouts: Array<Workouts>
  /** fetch aggregated fields from the table: "workouts" */
  workouts_aggregate: Workouts_Aggregate
  /** fetch data from the table: "workouts" using primary key columns */
  workouts_by_pk?: Maybe<Workouts>
  /** fetch data from the table in a streaming manner: "workouts" */
  workouts_stream: Array<Workouts>
}

export type Subscription_RootWorkoutsArgs = {
  distinct_on?: InputMaybe<Array<Workouts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Workouts_Order_By>>
  where?: InputMaybe<Workouts_Bool_Exp>
}

export type Subscription_RootWorkouts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Workouts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Workouts_Order_By>>
  where?: InputMaybe<Workouts_Bool_Exp>
}

export type Subscription_RootWorkouts_By_PkArgs = {
  id: Scalars['uuid']['input']
}

export type Subscription_RootWorkouts_StreamArgs = {
  batch_size: Scalars['Int']['input']
  cursor: Array<InputMaybe<Workouts_Stream_Cursor_Input>>
  where?: InputMaybe<Workouts_Bool_Exp>
}

/** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
export type Timestamptz_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['timestamptz']['input']>
  _gt?: InputMaybe<Scalars['timestamptz']['input']>
  _gte?: InputMaybe<Scalars['timestamptz']['input']>
  _in?: InputMaybe<Array<Scalars['timestamptz']['input']>>
  _is_null?: InputMaybe<Scalars['Boolean']['input']>
  _lt?: InputMaybe<Scalars['timestamptz']['input']>
  _lte?: InputMaybe<Scalars['timestamptz']['input']>
  _neq?: InputMaybe<Scalars['timestamptz']['input']>
  _nin?: InputMaybe<Array<Scalars['timestamptz']['input']>>
}

/** Boolean expression to compare columns of type "uuid". All fields are combined with logical 'AND'. */
export type Uuid_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['uuid']['input']>
  _gt?: InputMaybe<Scalars['uuid']['input']>
  _gte?: InputMaybe<Scalars['uuid']['input']>
  _in?: InputMaybe<Array<Scalars['uuid']['input']>>
  _is_null?: InputMaybe<Scalars['Boolean']['input']>
  _lt?: InputMaybe<Scalars['uuid']['input']>
  _lte?: InputMaybe<Scalars['uuid']['input']>
  _neq?: InputMaybe<Scalars['uuid']['input']>
  _nin?: InputMaybe<Array<Scalars['uuid']['input']>>
}

/** columns and relationships of "workouts" */
export type Workouts = {
  __typename?: 'workouts'
  created_at: Scalars['timestamptz']['output']
  goal_per_day: Scalars['numeric']['output']
  id: Scalars['uuid']['output']
  interval: Scalars['numeric']['output']
  name: Scalars['String']['output']
  repeat: Scalars['Boolean']['output']
  rest: Scalars['numeric']['output']
  squeeze: Scalars['numeric']['output']
  stop_after: Scalars['numeric']['output']
  type: Scalars['String']['output']
  updated_at: Scalars['timestamptz']['output']
  user_id: Scalars['String']['output']
}

/** aggregated selection of "workouts" */
export type Workouts_Aggregate = {
  __typename?: 'workouts_aggregate'
  aggregate?: Maybe<Workouts_Aggregate_Fields>
  nodes: Array<Workouts>
}

/** aggregate fields of "workouts" */
export type Workouts_Aggregate_Fields = {
  __typename?: 'workouts_aggregate_fields'
  avg?: Maybe<Workouts_Avg_Fields>
  count: Scalars['Int']['output']
  max?: Maybe<Workouts_Max_Fields>
  min?: Maybe<Workouts_Min_Fields>
  stddev?: Maybe<Workouts_Stddev_Fields>
  stddev_pop?: Maybe<Workouts_Stddev_Pop_Fields>
  stddev_samp?: Maybe<Workouts_Stddev_Samp_Fields>
  sum?: Maybe<Workouts_Sum_Fields>
  var_pop?: Maybe<Workouts_Var_Pop_Fields>
  var_samp?: Maybe<Workouts_Var_Samp_Fields>
  variance?: Maybe<Workouts_Variance_Fields>
}

/** aggregate fields of "workouts" */
export type Workouts_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Workouts_Select_Column>>
  distinct?: InputMaybe<Scalars['Boolean']['input']>
}

/** aggregate avg on columns */
export type Workouts_Avg_Fields = {
  __typename?: 'workouts_avg_fields'
  goal_per_day?: Maybe<Scalars['Float']['output']>
  interval?: Maybe<Scalars['Float']['output']>
  rest?: Maybe<Scalars['Float']['output']>
  squeeze?: Maybe<Scalars['Float']['output']>
  stop_after?: Maybe<Scalars['Float']['output']>
}

/** Boolean expression to filter rows from the table "workouts". All fields are combined with a logical 'AND'. */
export type Workouts_Bool_Exp = {
  _and?: InputMaybe<Array<Workouts_Bool_Exp>>
  _not?: InputMaybe<Workouts_Bool_Exp>
  _or?: InputMaybe<Array<Workouts_Bool_Exp>>
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>
  goal_per_day?: InputMaybe<Numeric_Comparison_Exp>
  id?: InputMaybe<Uuid_Comparison_Exp>
  interval?: InputMaybe<Numeric_Comparison_Exp>
  name?: InputMaybe<String_Comparison_Exp>
  repeat?: InputMaybe<Boolean_Comparison_Exp>
  rest?: InputMaybe<Numeric_Comparison_Exp>
  squeeze?: InputMaybe<Numeric_Comparison_Exp>
  stop_after?: InputMaybe<Numeric_Comparison_Exp>
  type?: InputMaybe<String_Comparison_Exp>
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>
  user_id?: InputMaybe<String_Comparison_Exp>
}

/** unique or primary key constraints on table "workouts" */
export enum Workouts_Constraint {
  /** unique or primary key constraint on columns "id" */
  WorkoutsPkey = 'workouts_pkey',
}

/** input type for incrementing numeric columns in table "workouts" */
export type Workouts_Inc_Input = {
  goal_per_day?: InputMaybe<Scalars['numeric']['input']>
  interval?: InputMaybe<Scalars['numeric']['input']>
  rest?: InputMaybe<Scalars['numeric']['input']>
  squeeze?: InputMaybe<Scalars['numeric']['input']>
  stop_after?: InputMaybe<Scalars['numeric']['input']>
}

/** input type for inserting data into table "workouts" */
export type Workouts_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>
  goal_per_day?: InputMaybe<Scalars['numeric']['input']>
  id?: InputMaybe<Scalars['uuid']['input']>
  interval?: InputMaybe<Scalars['numeric']['input']>
  name?: InputMaybe<Scalars['String']['input']>
  repeat?: InputMaybe<Scalars['Boolean']['input']>
  rest?: InputMaybe<Scalars['numeric']['input']>
  squeeze?: InputMaybe<Scalars['numeric']['input']>
  stop_after?: InputMaybe<Scalars['numeric']['input']>
  type?: InputMaybe<Scalars['String']['input']>
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>
  user_id?: InputMaybe<Scalars['String']['input']>
}

/** aggregate max on columns */
export type Workouts_Max_Fields = {
  __typename?: 'workouts_max_fields'
  created_at?: Maybe<Scalars['timestamptz']['output']>
  goal_per_day?: Maybe<Scalars['numeric']['output']>
  id?: Maybe<Scalars['uuid']['output']>
  interval?: Maybe<Scalars['numeric']['output']>
  name?: Maybe<Scalars['String']['output']>
  rest?: Maybe<Scalars['numeric']['output']>
  squeeze?: Maybe<Scalars['numeric']['output']>
  stop_after?: Maybe<Scalars['numeric']['output']>
  type?: Maybe<Scalars['String']['output']>
  updated_at?: Maybe<Scalars['timestamptz']['output']>
  user_id?: Maybe<Scalars['String']['output']>
}

/** aggregate min on columns */
export type Workouts_Min_Fields = {
  __typename?: 'workouts_min_fields'
  created_at?: Maybe<Scalars['timestamptz']['output']>
  goal_per_day?: Maybe<Scalars['numeric']['output']>
  id?: Maybe<Scalars['uuid']['output']>
  interval?: Maybe<Scalars['numeric']['output']>
  name?: Maybe<Scalars['String']['output']>
  rest?: Maybe<Scalars['numeric']['output']>
  squeeze?: Maybe<Scalars['numeric']['output']>
  stop_after?: Maybe<Scalars['numeric']['output']>
  type?: Maybe<Scalars['String']['output']>
  updated_at?: Maybe<Scalars['timestamptz']['output']>
  user_id?: Maybe<Scalars['String']['output']>
}

/** response of any mutation on the table "workouts" */
export type Workouts_Mutation_Response = {
  __typename?: 'workouts_mutation_response'
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output']
  /** data from the rows affected by the mutation */
  returning: Array<Workouts>
}

/** on_conflict condition type for table "workouts" */
export type Workouts_On_Conflict = {
  constraint: Workouts_Constraint
  update_columns?: Array<Workouts_Update_Column>
  where?: InputMaybe<Workouts_Bool_Exp>
}

/** Ordering options when selecting data from "workouts". */
export type Workouts_Order_By = {
  created_at?: InputMaybe<Order_By>
  goal_per_day?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  interval?: InputMaybe<Order_By>
  name?: InputMaybe<Order_By>
  repeat?: InputMaybe<Order_By>
  rest?: InputMaybe<Order_By>
  squeeze?: InputMaybe<Order_By>
  stop_after?: InputMaybe<Order_By>
  type?: InputMaybe<Order_By>
  updated_at?: InputMaybe<Order_By>
  user_id?: InputMaybe<Order_By>
}

/** primary key columns input for table: workouts */
export type Workouts_Pk_Columns_Input = {
  id: Scalars['uuid']['input']
}

/** select columns of table "workouts" */
export enum Workouts_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  GoalPerDay = 'goal_per_day',
  /** column name */
  Id = 'id',
  /** column name */
  Interval = 'interval',
  /** column name */
  Name = 'name',
  /** column name */
  Repeat = 'repeat',
  /** column name */
  Rest = 'rest',
  /** column name */
  Squeeze = 'squeeze',
  /** column name */
  StopAfter = 'stop_after',
  /** column name */
  Type = 'type',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  UserId = 'user_id',
}

/** input type for updating data in table "workouts" */
export type Workouts_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>
  goal_per_day?: InputMaybe<Scalars['numeric']['input']>
  id?: InputMaybe<Scalars['uuid']['input']>
  interval?: InputMaybe<Scalars['numeric']['input']>
  name?: InputMaybe<Scalars['String']['input']>
  repeat?: InputMaybe<Scalars['Boolean']['input']>
  rest?: InputMaybe<Scalars['numeric']['input']>
  squeeze?: InputMaybe<Scalars['numeric']['input']>
  stop_after?: InputMaybe<Scalars['numeric']['input']>
  type?: InputMaybe<Scalars['String']['input']>
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>
  user_id?: InputMaybe<Scalars['String']['input']>
}

/** aggregate stddev on columns */
export type Workouts_Stddev_Fields = {
  __typename?: 'workouts_stddev_fields'
  goal_per_day?: Maybe<Scalars['Float']['output']>
  interval?: Maybe<Scalars['Float']['output']>
  rest?: Maybe<Scalars['Float']['output']>
  squeeze?: Maybe<Scalars['Float']['output']>
  stop_after?: Maybe<Scalars['Float']['output']>
}

/** aggregate stddev_pop on columns */
export type Workouts_Stddev_Pop_Fields = {
  __typename?: 'workouts_stddev_pop_fields'
  goal_per_day?: Maybe<Scalars['Float']['output']>
  interval?: Maybe<Scalars['Float']['output']>
  rest?: Maybe<Scalars['Float']['output']>
  squeeze?: Maybe<Scalars['Float']['output']>
  stop_after?: Maybe<Scalars['Float']['output']>
}

/** aggregate stddev_samp on columns */
export type Workouts_Stddev_Samp_Fields = {
  __typename?: 'workouts_stddev_samp_fields'
  goal_per_day?: Maybe<Scalars['Float']['output']>
  interval?: Maybe<Scalars['Float']['output']>
  rest?: Maybe<Scalars['Float']['output']>
  squeeze?: Maybe<Scalars['Float']['output']>
  stop_after?: Maybe<Scalars['Float']['output']>
}

/** Streaming cursor of the table "workouts" */
export type Workouts_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Workouts_Stream_Cursor_Value_Input
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>
}

/** Initial value of the column from where the streaming should start */
export type Workouts_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>
  goal_per_day?: InputMaybe<Scalars['numeric']['input']>
  id?: InputMaybe<Scalars['uuid']['input']>
  interval?: InputMaybe<Scalars['numeric']['input']>
  name?: InputMaybe<Scalars['String']['input']>
  repeat?: InputMaybe<Scalars['Boolean']['input']>
  rest?: InputMaybe<Scalars['numeric']['input']>
  squeeze?: InputMaybe<Scalars['numeric']['input']>
  stop_after?: InputMaybe<Scalars['numeric']['input']>
  type?: InputMaybe<Scalars['String']['input']>
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>
  user_id?: InputMaybe<Scalars['String']['input']>
}

/** aggregate sum on columns */
export type Workouts_Sum_Fields = {
  __typename?: 'workouts_sum_fields'
  goal_per_day?: Maybe<Scalars['numeric']['output']>
  interval?: Maybe<Scalars['numeric']['output']>
  rest?: Maybe<Scalars['numeric']['output']>
  squeeze?: Maybe<Scalars['numeric']['output']>
  stop_after?: Maybe<Scalars['numeric']['output']>
}

/** update columns of table "workouts" */
export enum Workouts_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  GoalPerDay = 'goal_per_day',
  /** column name */
  Id = 'id',
  /** column name */
  Interval = 'interval',
  /** column name */
  Name = 'name',
  /** column name */
  Repeat = 'repeat',
  /** column name */
  Rest = 'rest',
  /** column name */
  Squeeze = 'squeeze',
  /** column name */
  StopAfter = 'stop_after',
  /** column name */
  Type = 'type',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  UserId = 'user_id',
}

export type Workouts_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Workouts_Inc_Input>
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Workouts_Set_Input>
  /** filter the rows which have to be updated */
  where: Workouts_Bool_Exp
}

/** aggregate var_pop on columns */
export type Workouts_Var_Pop_Fields = {
  __typename?: 'workouts_var_pop_fields'
  goal_per_day?: Maybe<Scalars['Float']['output']>
  interval?: Maybe<Scalars['Float']['output']>
  rest?: Maybe<Scalars['Float']['output']>
  squeeze?: Maybe<Scalars['Float']['output']>
  stop_after?: Maybe<Scalars['Float']['output']>
}

/** aggregate var_samp on columns */
export type Workouts_Var_Samp_Fields = {
  __typename?: 'workouts_var_samp_fields'
  goal_per_day?: Maybe<Scalars['Float']['output']>
  interval?: Maybe<Scalars['Float']['output']>
  rest?: Maybe<Scalars['Float']['output']>
  squeeze?: Maybe<Scalars['Float']['output']>
  stop_after?: Maybe<Scalars['Float']['output']>
}

/** aggregate variance on columns */
export type Workouts_Variance_Fields = {
  __typename?: 'workouts_variance_fields'
  goal_per_day?: Maybe<Scalars['Float']['output']>
  interval?: Maybe<Scalars['Float']['output']>
  rest?: Maybe<Scalars['Float']['output']>
  squeeze?: Maybe<Scalars['Float']['output']>
  stop_after?: Maybe<Scalars['Float']['output']>
}

export type WorkoutsByUserId___QueryVariables = Types.Exact<{
  user_id?: Types.InputMaybe<Types.Scalars['String']['input']>
}>

export type WorkoutsByUserId___Query = {
  __typename?: 'query_root'
  workouts: Array<{
    __typename: 'workouts'
    created_at: any
    goal_per_day: any
    id: any
    interval: any
    name: string
    repeat: boolean
    rest: any
    squeeze: any
    stop_after: any
    type: string
    updated_at: any
    user_id: string
  }>
}

export const WorkoutsByUserId___Document = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'WorkoutsByUserId___' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'user_id' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'workouts' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'where' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'user_id' },
                      value: {
                        kind: 'ObjectValue',
                        fields: [
                          {
                            kind: 'ObjectField',
                            name: { kind: 'Name', value: '_eq' },
                            value: {
                              kind: 'Variable',
                              name: { kind: 'Name', value: 'user_id' },
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
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'created_at' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'goal_per_day' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'interval' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'repeat' } },
                { kind: 'Field', name: { kind: 'Name', value: 'rest' } },
                { kind: 'Field', name: { kind: 'Name', value: 'squeeze' } },
                { kind: 'Field', name: { kind: 'Name', value: 'stop_after' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updated_at' } },
                { kind: 'Field', name: { kind: 'Name', value: 'user_id' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  WorkoutsByUserId___Query,
  WorkoutsByUserId___QueryVariables
>
