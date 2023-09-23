import { workoutType } from '../constants'

// TODO: get this type from graph
export interface IWorkout {
  created_at: Date // no
  updated_at: Date // no
  id: string // no
  user_id: string // no
  name: string
  type: keyof typeof workoutType
  repeat: boolean
  goal_per_day: number
  interval: number
  rest: number
  squeeze: number
  stop_after: number
}

export { workoutType }
