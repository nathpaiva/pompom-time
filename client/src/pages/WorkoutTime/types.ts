import {
  Variety_Enum,
  Workouts,
} from '../../../../serverless/generated/graphql/GraphQLSchema'

export type TWorkoutAnimation = {
  [key in Workouts['variety']]: {
    animation: string
    keyframes: Record<string, unknown>
  }
}

export { Variety_Enum, Workouts }
