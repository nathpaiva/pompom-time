/* eslint-disable */
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
  timestamptz: { input: any; output: any }
  uuid: { input: any; output: any }
}

/** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
export type Boolean_Comparison_Exp = {
  _eq: InputMaybe<Scalars['Boolean']['input']>
  _gt: InputMaybe<Scalars['Boolean']['input']>
  _gte: InputMaybe<Scalars['Boolean']['input']>
  _in: InputMaybe<Array<Scalars['Boolean']['input']>>
  _is_null: InputMaybe<Scalars['Boolean']['input']>
  _lt: InputMaybe<Scalars['Boolean']['input']>
  _lte: InputMaybe<Scalars['Boolean']['input']>
  _neq: InputMaybe<Scalars['Boolean']['input']>
  _nin: InputMaybe<Array<Scalars['Boolean']['input']>>
}

/** Boolean expression to compare columns of type "Float". All fields are combined with logical 'AND'. */
export type Float_Comparison_Exp = {
  _eq: InputMaybe<Scalars['Float']['input']>
  _gt: InputMaybe<Scalars['Float']['input']>
  _gte: InputMaybe<Scalars['Float']['input']>
  _in: InputMaybe<Array<Scalars['Float']['input']>>
  _is_null: InputMaybe<Scalars['Boolean']['input']>
  _lt: InputMaybe<Scalars['Float']['input']>
  _lte: InputMaybe<Scalars['Float']['input']>
  _neq: InputMaybe<Scalars['Float']['input']>
  _nin: InputMaybe<Array<Scalars['Float']['input']>>
}

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type String_Comparison_Exp = {
  _eq: InputMaybe<Scalars['String']['input']>
  _gt: InputMaybe<Scalars['String']['input']>
  _gte: InputMaybe<Scalars['String']['input']>
  /** does the column match the given case-insensitive pattern */
  _ilike: InputMaybe<Scalars['String']['input']>
  _in: InputMaybe<Array<Scalars['String']['input']>>
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex: InputMaybe<Scalars['String']['input']>
  _is_null: InputMaybe<Scalars['Boolean']['input']>
  /** does the column match the given pattern */
  _like: InputMaybe<Scalars['String']['input']>
  _lt: InputMaybe<Scalars['String']['input']>
  _lte: InputMaybe<Scalars['String']['input']>
  _neq: InputMaybe<Scalars['String']['input']>
  /** does the column NOT match the given case-insensitive pattern */
  _nilike: InputMaybe<Scalars['String']['input']>
  _nin: InputMaybe<Array<Scalars['String']['input']>>
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex: InputMaybe<Scalars['String']['input']>
  /** does the column NOT match the given pattern */
  _nlike: InputMaybe<Scalars['String']['input']>
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex: InputMaybe<Scalars['String']['input']>
  /** does the column NOT match the given SQL regular expression */
  _nsimilar: InputMaybe<Scalars['String']['input']>
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex: InputMaybe<Scalars['String']['input']>
  /** does the column match the given SQL regular expression */
  _similar: InputMaybe<Scalars['String']['input']>
}

/** enum workout variety */
export type Variety = {
  __typename?: 'Variety'
  description: Scalars['String']['output']
  variety: Scalars['String']['output']
}

/** aggregated selection of "Variety" */
export type Variety_Aggregate = {
  __typename?: 'Variety_aggregate'
  aggregate: Maybe<Variety_Aggregate_Fields>
  nodes: Array<Variety>
}

/** aggregate fields of "Variety" */
export type Variety_Aggregate_Fields = {
  __typename?: 'Variety_aggregate_fields'
  count: Scalars['Int']['output']
  max: Maybe<Variety_Max_Fields>
  min: Maybe<Variety_Min_Fields>
}

/** aggregate fields of "Variety" */
export type Variety_Aggregate_FieldsCountArgs = {
  columns: InputMaybe<Array<Variety_Select_Column>>
  distinct: InputMaybe<Scalars['Boolean']['input']>
}

/** Boolean expression to filter rows from the table "Variety". All fields are combined with a logical 'AND'. */
export type Variety_Bool_Exp = {
  _and: InputMaybe<Array<Variety_Bool_Exp>>
  _not: InputMaybe<Variety_Bool_Exp>
  _or: InputMaybe<Array<Variety_Bool_Exp>>
  description: InputMaybe<String_Comparison_Exp>
  variety: InputMaybe<String_Comparison_Exp>
}

/** unique or primary key constraints on table "Variety" */
export enum Variety_Constraint {
  /** unique or primary key constraint on columns "variety" */
  EnumVarietyPkey = '_enumVariety_pkey',
}

export enum Variety_Enum {
  /** intensity workout */
  Intensity = 'intensity',
  /** pulse workout */
  Pulse = 'pulse',
  /** resistance workout */
  Resistance = 'resistance',
  /** strength workout */
  Strength = 'strength',
}

/** Boolean expression to compare columns of type "Variety_enum". All fields are combined with logical 'AND'. */
export type Variety_Enum_Comparison_Exp = {
  _eq: InputMaybe<Variety_Enum>
  _in: InputMaybe<Array<Variety_Enum>>
  _is_null: InputMaybe<Scalars['Boolean']['input']>
  _neq: InputMaybe<Variety_Enum>
  _nin: InputMaybe<Array<Variety_Enum>>
}

/** input type for inserting data into table "Variety" */
export type Variety_Insert_Input = {
  description: InputMaybe<Scalars['String']['input']>
  variety: InputMaybe<Scalars['String']['input']>
}

/** aggregate max on columns */
export type Variety_Max_Fields = {
  __typename?: 'Variety_max_fields'
  description: Maybe<Scalars['String']['output']>
  variety: Maybe<Scalars['String']['output']>
}

/** aggregate min on columns */
export type Variety_Min_Fields = {
  __typename?: 'Variety_min_fields'
  description: Maybe<Scalars['String']['output']>
  variety: Maybe<Scalars['String']['output']>
}

/** response of any mutation on the table "Variety" */
export type Variety_Mutation_Response = {
  __typename?: 'Variety_mutation_response'
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output']
  /** data from the rows affected by the mutation */
  returning: Array<Variety>
}

/** on_conflict condition type for table "Variety" */
export type Variety_On_Conflict = {
  constraint: Variety_Constraint
  update_columns: Array<Variety_Update_Column>
  where: InputMaybe<Variety_Bool_Exp>
}

/** Ordering options when selecting data from "Variety". */
export type Variety_Order_By = {
  description: InputMaybe<Order_By>
  variety: InputMaybe<Order_By>
}

/** primary key columns input for table: Variety */
export type Variety_Pk_Columns_Input = {
  variety: Scalars['String']['input']
}

/** select columns of table "Variety" */
export enum Variety_Select_Column {
  /** column name */
  Description = 'description',
  /** column name */
  Variety = 'variety',
}

/** input type for updating data in table "Variety" */
export type Variety_Set_Input = {
  description: InputMaybe<Scalars['String']['input']>
  variety: InputMaybe<Scalars['String']['input']>
}

/** Streaming cursor of the table "Variety" */
export type Variety_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Variety_Stream_Cursor_Value_Input
  /** cursor ordering */
  ordering: InputMaybe<Cursor_Ordering>
}

/** Initial value of the column from where the streaming should start */
export type Variety_Stream_Cursor_Value_Input = {
  description: InputMaybe<Scalars['String']['input']>
  variety: InputMaybe<Scalars['String']['input']>
}

/** update columns of table "Variety" */
export enum Variety_Update_Column {
  /** column name */
  Description = 'description',
  /** column name */
  Variety = 'variety',
}

export type Variety_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set: InputMaybe<Variety_Set_Input>
  /** filter the rows which have to be updated */
  where: Variety_Bool_Exp
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
  /** delete data from the table: "Variety" */
  delete_Variety: Maybe<Variety_Mutation_Response>
  /** delete single row from the table: "Variety" */
  delete_Variety_by_pk: Maybe<Variety>
  /** delete data from the table: "workouts" */
  delete_workouts: Maybe<Workouts_Mutation_Response>
  /** delete single row from the table: "workouts" */
  delete_workouts_by_pk: Maybe<Workouts>
  /** insert data into the table: "Variety" */
  insert_Variety: Maybe<Variety_Mutation_Response>
  /** insert a single row into the table: "Variety" */
  insert_Variety_one: Maybe<Variety>
  /** insert data into the table: "workouts" */
  insert_workouts: Maybe<Workouts_Mutation_Response>
  /** insert a single row into the table: "workouts" */
  insert_workouts_one: Maybe<Workouts>
  /** update data of the table: "Variety" */
  update_Variety: Maybe<Variety_Mutation_Response>
  /** update single row of the table: "Variety" */
  update_Variety_by_pk: Maybe<Variety>
  /** update multiples rows of table: "Variety" */
  update_Variety_many: Maybe<Array<Maybe<Variety_Mutation_Response>>>
  /** update data of the table: "workouts" */
  update_workouts: Maybe<Workouts_Mutation_Response>
  /** update single row of the table: "workouts" */
  update_workouts_by_pk: Maybe<Workouts>
  /** update multiples rows of table: "workouts" */
  update_workouts_many: Maybe<Array<Maybe<Workouts_Mutation_Response>>>
}

/** mutation root */
export type Mutation_RootDelete_VarietyArgs = {
  where: Variety_Bool_Exp
}

/** mutation root */
export type Mutation_RootDelete_Variety_By_PkArgs = {
  variety: Scalars['String']['input']
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
export type Mutation_RootInsert_VarietyArgs = {
  objects: Array<Variety_Insert_Input>
  on_conflict: InputMaybe<Variety_On_Conflict>
}

/** mutation root */
export type Mutation_RootInsert_Variety_OneArgs = {
  object: Variety_Insert_Input
  on_conflict: InputMaybe<Variety_On_Conflict>
}

/** mutation root */
export type Mutation_RootInsert_WorkoutsArgs = {
  objects: Array<Workouts_Insert_Input>
  on_conflict: InputMaybe<Workouts_On_Conflict>
}

/** mutation root */
export type Mutation_RootInsert_Workouts_OneArgs = {
  object: Workouts_Insert_Input
  on_conflict: InputMaybe<Workouts_On_Conflict>
}

/** mutation root */
export type Mutation_RootUpdate_VarietyArgs = {
  _set: InputMaybe<Variety_Set_Input>
  where: Variety_Bool_Exp
}

/** mutation root */
export type Mutation_RootUpdate_Variety_By_PkArgs = {
  _set: InputMaybe<Variety_Set_Input>
  pk_columns: Variety_Pk_Columns_Input
}

/** mutation root */
export type Mutation_RootUpdate_Variety_ManyArgs = {
  updates: Array<Variety_Updates>
}

/** mutation root */
export type Mutation_RootUpdate_WorkoutsArgs = {
  _inc: InputMaybe<Workouts_Inc_Input>
  _set: InputMaybe<Workouts_Set_Input>
  where: Workouts_Bool_Exp
}

/** mutation root */
export type Mutation_RootUpdate_Workouts_By_PkArgs = {
  _inc: InputMaybe<Workouts_Inc_Input>
  _set: InputMaybe<Workouts_Set_Input>
  pk_columns: Workouts_Pk_Columns_Input
}

/** mutation root */
export type Mutation_RootUpdate_Workouts_ManyArgs = {
  updates: Array<Workouts_Updates>
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
  /** fetch data from the table: "Variety" */
  Variety: Array<Variety>
  /** fetch aggregated fields from the table: "Variety" */
  Variety_aggregate: Variety_Aggregate
  /** fetch data from the table: "Variety" using primary key columns */
  Variety_by_pk: Maybe<Variety>
  /** fetch data from the table: "workouts" */
  workouts: Array<Workouts>
  /** fetch aggregated fields from the table: "workouts" */
  workouts_aggregate: Workouts_Aggregate
  /** fetch data from the table: "workouts" using primary key columns */
  workouts_by_pk: Maybe<Workouts>
}

export type Query_RootVarietyArgs = {
  distinct_on: InputMaybe<Array<Variety_Select_Column>>
  limit: InputMaybe<Scalars['Int']['input']>
  offset: InputMaybe<Scalars['Int']['input']>
  order_by: InputMaybe<Array<Variety_Order_By>>
  where: InputMaybe<Variety_Bool_Exp>
}

export type Query_RootVariety_AggregateArgs = {
  distinct_on: InputMaybe<Array<Variety_Select_Column>>
  limit: InputMaybe<Scalars['Int']['input']>
  offset: InputMaybe<Scalars['Int']['input']>
  order_by: InputMaybe<Array<Variety_Order_By>>
  where: InputMaybe<Variety_Bool_Exp>
}

export type Query_RootVariety_By_PkArgs = {
  variety: Scalars['String']['input']
}

export type Query_RootWorkoutsArgs = {
  distinct_on: InputMaybe<Array<Workouts_Select_Column>>
  limit: InputMaybe<Scalars['Int']['input']>
  offset: InputMaybe<Scalars['Int']['input']>
  order_by: InputMaybe<Array<Workouts_Order_By>>
  where: InputMaybe<Workouts_Bool_Exp>
}

export type Query_RootWorkouts_AggregateArgs = {
  distinct_on: InputMaybe<Array<Workouts_Select_Column>>
  limit: InputMaybe<Scalars['Int']['input']>
  offset: InputMaybe<Scalars['Int']['input']>
  order_by: InputMaybe<Array<Workouts_Order_By>>
  where: InputMaybe<Workouts_Bool_Exp>
}

export type Query_RootWorkouts_By_PkArgs = {
  id: Scalars['uuid']['input']
}

export type Subscription_Root = {
  __typename?: 'subscription_root'
  /** fetch data from the table: "Variety" */
  Variety: Array<Variety>
  /** fetch aggregated fields from the table: "Variety" */
  Variety_aggregate: Variety_Aggregate
  /** fetch data from the table: "Variety" using primary key columns */
  Variety_by_pk: Maybe<Variety>
  /** fetch data from the table in a streaming manner: "Variety" */
  Variety_stream: Array<Variety>
  /** fetch data from the table: "workouts" */
  workouts: Array<Workouts>
  /** fetch aggregated fields from the table: "workouts" */
  workouts_aggregate: Workouts_Aggregate
  /** fetch data from the table: "workouts" using primary key columns */
  workouts_by_pk: Maybe<Workouts>
  /** fetch data from the table in a streaming manner: "workouts" */
  workouts_stream: Array<Workouts>
}

export type Subscription_RootVarietyArgs = {
  distinct_on: InputMaybe<Array<Variety_Select_Column>>
  limit: InputMaybe<Scalars['Int']['input']>
  offset: InputMaybe<Scalars['Int']['input']>
  order_by: InputMaybe<Array<Variety_Order_By>>
  where: InputMaybe<Variety_Bool_Exp>
}

export type Subscription_RootVariety_AggregateArgs = {
  distinct_on: InputMaybe<Array<Variety_Select_Column>>
  limit: InputMaybe<Scalars['Int']['input']>
  offset: InputMaybe<Scalars['Int']['input']>
  order_by: InputMaybe<Array<Variety_Order_By>>
  where: InputMaybe<Variety_Bool_Exp>
}

export type Subscription_RootVariety_By_PkArgs = {
  variety: Scalars['String']['input']
}

export type Subscription_RootVariety_StreamArgs = {
  batch_size: Scalars['Int']['input']
  cursor: Array<InputMaybe<Variety_Stream_Cursor_Input>>
  where: InputMaybe<Variety_Bool_Exp>
}

export type Subscription_RootWorkoutsArgs = {
  distinct_on: InputMaybe<Array<Workouts_Select_Column>>
  limit: InputMaybe<Scalars['Int']['input']>
  offset: InputMaybe<Scalars['Int']['input']>
  order_by: InputMaybe<Array<Workouts_Order_By>>
  where: InputMaybe<Workouts_Bool_Exp>
}

export type Subscription_RootWorkouts_AggregateArgs = {
  distinct_on: InputMaybe<Array<Workouts_Select_Column>>
  limit: InputMaybe<Scalars['Int']['input']>
  offset: InputMaybe<Scalars['Int']['input']>
  order_by: InputMaybe<Array<Workouts_Order_By>>
  where: InputMaybe<Workouts_Bool_Exp>
}

export type Subscription_RootWorkouts_By_PkArgs = {
  id: Scalars['uuid']['input']
}

export type Subscription_RootWorkouts_StreamArgs = {
  batch_size: Scalars['Int']['input']
  cursor: Array<InputMaybe<Workouts_Stream_Cursor_Input>>
  where: InputMaybe<Workouts_Bool_Exp>
}

/** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
export type Timestamptz_Comparison_Exp = {
  _eq: InputMaybe<Scalars['timestamptz']['input']>
  _gt: InputMaybe<Scalars['timestamptz']['input']>
  _gte: InputMaybe<Scalars['timestamptz']['input']>
  _in: InputMaybe<Array<Scalars['timestamptz']['input']>>
  _is_null: InputMaybe<Scalars['Boolean']['input']>
  _lt: InputMaybe<Scalars['timestamptz']['input']>
  _lte: InputMaybe<Scalars['timestamptz']['input']>
  _neq: InputMaybe<Scalars['timestamptz']['input']>
  _nin: InputMaybe<Array<Scalars['timestamptz']['input']>>
}

/** Boolean expression to compare columns of type "uuid". All fields are combined with logical 'AND'. */
export type Uuid_Comparison_Exp = {
  _eq: InputMaybe<Scalars['uuid']['input']>
  _gt: InputMaybe<Scalars['uuid']['input']>
  _gte: InputMaybe<Scalars['uuid']['input']>
  _in: InputMaybe<Array<Scalars['uuid']['input']>>
  _is_null: InputMaybe<Scalars['Boolean']['input']>
  _lt: InputMaybe<Scalars['uuid']['input']>
  _lte: InputMaybe<Scalars['uuid']['input']>
  _neq: InputMaybe<Scalars['uuid']['input']>
  _nin: InputMaybe<Array<Scalars['uuid']['input']>>
}

/** columns and relationships of "workouts" */
export type Workouts = {
  __typename?: 'workouts'
  created_at: Scalars['timestamptz']['output']
  goal_per_day: Scalars['Float']['output']
  id: Scalars['uuid']['output']
  /** if the variety is Resistance is not nullable */
  interval: Maybe<Scalars['Float']['output']>
  name: Scalars['String']['output']
  repeat: Scalars['Boolean']['output']
  rest: Scalars['Float']['output']
  squeeze: Scalars['Float']['output']
  updated_at: Scalars['timestamptz']['output']
  user_id: Scalars['String']['output']
  variety: Variety_Enum
}

/** aggregated selection of "workouts" */
export type Workouts_Aggregate = {
  __typename?: 'workouts_aggregate'
  aggregate: Maybe<Workouts_Aggregate_Fields>
  nodes: Array<Workouts>
}

/** aggregate fields of "workouts" */
export type Workouts_Aggregate_Fields = {
  __typename?: 'workouts_aggregate_fields'
  avg: Maybe<Workouts_Avg_Fields>
  count: Scalars['Int']['output']
  max: Maybe<Workouts_Max_Fields>
  min: Maybe<Workouts_Min_Fields>
  stddev: Maybe<Workouts_Stddev_Fields>
  stddev_pop: Maybe<Workouts_Stddev_Pop_Fields>
  stddev_samp: Maybe<Workouts_Stddev_Samp_Fields>
  sum: Maybe<Workouts_Sum_Fields>
  var_pop: Maybe<Workouts_Var_Pop_Fields>
  var_samp: Maybe<Workouts_Var_Samp_Fields>
  variance: Maybe<Workouts_Variance_Fields>
}

/** aggregate fields of "workouts" */
export type Workouts_Aggregate_FieldsCountArgs = {
  columns: InputMaybe<Array<Workouts_Select_Column>>
  distinct: InputMaybe<Scalars['Boolean']['input']>
}

/** aggregate avg on columns */
export type Workouts_Avg_Fields = {
  __typename?: 'workouts_avg_fields'
  goal_per_day: Maybe<Scalars['Float']['output']>
  /** if the variety is Resistance is not nullable */
  interval: Maybe<Scalars['Float']['output']>
  rest: Maybe<Scalars['Float']['output']>
  squeeze: Maybe<Scalars['Float']['output']>
}

/** Boolean expression to filter rows from the table "workouts". All fields are combined with a logical 'AND'. */
export type Workouts_Bool_Exp = {
  _and: InputMaybe<Array<Workouts_Bool_Exp>>
  _not: InputMaybe<Workouts_Bool_Exp>
  _or: InputMaybe<Array<Workouts_Bool_Exp>>
  created_at: InputMaybe<Timestamptz_Comparison_Exp>
  goal_per_day: InputMaybe<Float_Comparison_Exp>
  id: InputMaybe<Uuid_Comparison_Exp>
  interval: InputMaybe<Float_Comparison_Exp>
  name: InputMaybe<String_Comparison_Exp>
  repeat: InputMaybe<Boolean_Comparison_Exp>
  rest: InputMaybe<Float_Comparison_Exp>
  squeeze: InputMaybe<Float_Comparison_Exp>
  updated_at: InputMaybe<Timestamptz_Comparison_Exp>
  user_id: InputMaybe<String_Comparison_Exp>
  variety: InputMaybe<Variety_Enum_Comparison_Exp>
}

/** unique or primary key constraints on table "workouts" */
export enum Workouts_Constraint {
  /** unique or primary key constraint on columns "id" */
  WorkoutsPkey = 'workouts_pkey',
}

/** input type for incrementing numeric columns in table "workouts" */
export type Workouts_Inc_Input = {
  goal_per_day: InputMaybe<Scalars['Float']['input']>
  /** if the variety is Resistance is not nullable */
  interval: InputMaybe<Scalars['Float']['input']>
  rest: InputMaybe<Scalars['Float']['input']>
  squeeze: InputMaybe<Scalars['Float']['input']>
}

/** input type for inserting data into table "workouts" */
export type Workouts_Insert_Input = {
  created_at: InputMaybe<Scalars['timestamptz']['input']>
  goal_per_day: InputMaybe<Scalars['Float']['input']>
  id: InputMaybe<Scalars['uuid']['input']>
  /** if the variety is Resistance is not nullable */
  interval: InputMaybe<Scalars['Float']['input']>
  name: InputMaybe<Scalars['String']['input']>
  repeat: InputMaybe<Scalars['Boolean']['input']>
  rest: InputMaybe<Scalars['Float']['input']>
  squeeze: InputMaybe<Scalars['Float']['input']>
  updated_at: InputMaybe<Scalars['timestamptz']['input']>
  user_id: InputMaybe<Scalars['String']['input']>
  variety: InputMaybe<Variety_Enum>
}

/** aggregate max on columns */
export type Workouts_Max_Fields = {
  __typename?: 'workouts_max_fields'
  created_at: Maybe<Scalars['timestamptz']['output']>
  goal_per_day: Maybe<Scalars['Float']['output']>
  id: Maybe<Scalars['uuid']['output']>
  /** if the variety is Resistance is not nullable */
  interval: Maybe<Scalars['Float']['output']>
  name: Maybe<Scalars['String']['output']>
  rest: Maybe<Scalars['Float']['output']>
  squeeze: Maybe<Scalars['Float']['output']>
  updated_at: Maybe<Scalars['timestamptz']['output']>
  user_id: Maybe<Scalars['String']['output']>
}

/** aggregate min on columns */
export type Workouts_Min_Fields = {
  __typename?: 'workouts_min_fields'
  created_at: Maybe<Scalars['timestamptz']['output']>
  goal_per_day: Maybe<Scalars['Float']['output']>
  id: Maybe<Scalars['uuid']['output']>
  /** if the variety is Resistance is not nullable */
  interval: Maybe<Scalars['Float']['output']>
  name: Maybe<Scalars['String']['output']>
  rest: Maybe<Scalars['Float']['output']>
  squeeze: Maybe<Scalars['Float']['output']>
  updated_at: Maybe<Scalars['timestamptz']['output']>
  user_id: Maybe<Scalars['String']['output']>
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
  update_columns: Array<Workouts_Update_Column>
  where: InputMaybe<Workouts_Bool_Exp>
}

/** Ordering options when selecting data from "workouts". */
export type Workouts_Order_By = {
  created_at: InputMaybe<Order_By>
  goal_per_day: InputMaybe<Order_By>
  id: InputMaybe<Order_By>
  interval: InputMaybe<Order_By>
  name: InputMaybe<Order_By>
  repeat: InputMaybe<Order_By>
  rest: InputMaybe<Order_By>
  squeeze: InputMaybe<Order_By>
  updated_at: InputMaybe<Order_By>
  user_id: InputMaybe<Order_By>
  variety: InputMaybe<Order_By>
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
  UpdatedAt = 'updated_at',
  /** column name */
  UserId = 'user_id',
  /** column name */
  Variety = 'variety',
}

/** input type for updating data in table "workouts" */
export type Workouts_Set_Input = {
  created_at: InputMaybe<Scalars['timestamptz']['input']>
  goal_per_day: InputMaybe<Scalars['Float']['input']>
  id: InputMaybe<Scalars['uuid']['input']>
  /** if the variety is Resistance is not nullable */
  interval: InputMaybe<Scalars['Float']['input']>
  name: InputMaybe<Scalars['String']['input']>
  repeat: InputMaybe<Scalars['Boolean']['input']>
  rest: InputMaybe<Scalars['Float']['input']>
  squeeze: InputMaybe<Scalars['Float']['input']>
  updated_at: InputMaybe<Scalars['timestamptz']['input']>
  user_id: InputMaybe<Scalars['String']['input']>
  variety: InputMaybe<Variety_Enum>
}

/** aggregate stddev on columns */
export type Workouts_Stddev_Fields = {
  __typename?: 'workouts_stddev_fields'
  goal_per_day: Maybe<Scalars['Float']['output']>
  /** if the variety is Resistance is not nullable */
  interval: Maybe<Scalars['Float']['output']>
  rest: Maybe<Scalars['Float']['output']>
  squeeze: Maybe<Scalars['Float']['output']>
}

/** aggregate stddev_pop on columns */
export type Workouts_Stddev_Pop_Fields = {
  __typename?: 'workouts_stddev_pop_fields'
  goal_per_day: Maybe<Scalars['Float']['output']>
  /** if the variety is Resistance is not nullable */
  interval: Maybe<Scalars['Float']['output']>
  rest: Maybe<Scalars['Float']['output']>
  squeeze: Maybe<Scalars['Float']['output']>
}

/** aggregate stddev_samp on columns */
export type Workouts_Stddev_Samp_Fields = {
  __typename?: 'workouts_stddev_samp_fields'
  goal_per_day: Maybe<Scalars['Float']['output']>
  /** if the variety is Resistance is not nullable */
  interval: Maybe<Scalars['Float']['output']>
  rest: Maybe<Scalars['Float']['output']>
  squeeze: Maybe<Scalars['Float']['output']>
}

/** Streaming cursor of the table "workouts" */
export type Workouts_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Workouts_Stream_Cursor_Value_Input
  /** cursor ordering */
  ordering: InputMaybe<Cursor_Ordering>
}

/** Initial value of the column from where the streaming should start */
export type Workouts_Stream_Cursor_Value_Input = {
  created_at: InputMaybe<Scalars['timestamptz']['input']>
  goal_per_day: InputMaybe<Scalars['Float']['input']>
  id: InputMaybe<Scalars['uuid']['input']>
  /** if the variety is Resistance is not nullable */
  interval: InputMaybe<Scalars['Float']['input']>
  name: InputMaybe<Scalars['String']['input']>
  repeat: InputMaybe<Scalars['Boolean']['input']>
  rest: InputMaybe<Scalars['Float']['input']>
  squeeze: InputMaybe<Scalars['Float']['input']>
  updated_at: InputMaybe<Scalars['timestamptz']['input']>
  user_id: InputMaybe<Scalars['String']['input']>
  variety: InputMaybe<Variety_Enum>
}

/** aggregate sum on columns */
export type Workouts_Sum_Fields = {
  __typename?: 'workouts_sum_fields'
  goal_per_day: Maybe<Scalars['Float']['output']>
  /** if the variety is Resistance is not nullable */
  interval: Maybe<Scalars['Float']['output']>
  rest: Maybe<Scalars['Float']['output']>
  squeeze: Maybe<Scalars['Float']['output']>
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
  UpdatedAt = 'updated_at',
  /** column name */
  UserId = 'user_id',
  /** column name */
  Variety = 'variety',
}

export type Workouts_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc: InputMaybe<Workouts_Inc_Input>
  /** sets the columns of the filtered rows to the given values */
  _set: InputMaybe<Workouts_Set_Input>
  /** filter the rows which have to be updated */
  where: Workouts_Bool_Exp
}

/** aggregate var_pop on columns */
export type Workouts_Var_Pop_Fields = {
  __typename?: 'workouts_var_pop_fields'
  goal_per_day: Maybe<Scalars['Float']['output']>
  /** if the variety is Resistance is not nullable */
  interval: Maybe<Scalars['Float']['output']>
  rest: Maybe<Scalars['Float']['output']>
  squeeze: Maybe<Scalars['Float']['output']>
}

/** aggregate var_samp on columns */
export type Workouts_Var_Samp_Fields = {
  __typename?: 'workouts_var_samp_fields'
  goal_per_day: Maybe<Scalars['Float']['output']>
  /** if the variety is Resistance is not nullable */
  interval: Maybe<Scalars['Float']['output']>
  rest: Maybe<Scalars['Float']['output']>
  squeeze: Maybe<Scalars['Float']['output']>
}

/** aggregate variance on columns */
export type Workouts_Variance_Fields = {
  __typename?: 'workouts_variance_fields'
  goal_per_day: Maybe<Scalars['Float']['output']>
  /** if the variety is Resistance is not nullable */
  interval: Maybe<Scalars['Float']['output']>
  rest: Maybe<Scalars['Float']['output']>
  squeeze: Maybe<Scalars['Float']['output']>
}
