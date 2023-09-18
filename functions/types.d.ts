interface IWorkout {
  user_id: string
  name: string
  type: string
  repeat: boolean
  goal_per_day: number
  interval: number
  rest: number
  squeeze: number
  stop_after: number
}

interface IWorkoutDb {
  created_at: date
  updated_at: date
  id: string
  user_id: string
  name: string
  type: string
  repeat: boolean
  goal_per_day: number
  interval: number
  rest: number
  squeeze: number
  stop_after: number
}
