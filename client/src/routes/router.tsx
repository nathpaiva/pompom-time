import { type RouteObject, createBrowserRouter } from 'react-router-dom'

import { App } from '../App'
import { ProtectedRoute } from '../components'
import { Login, Logout, Workout, WorkoutTime } from '../pages'

export enum RouteEnum {
  login = 'login',
  logout = 'logout',
  admin = 'admin',
  workout = 'workout',
  'workout/start/:workout_id' = 'workout/start/:workout_id',
}

export const routeDataSource = {
  path: '/',
  element: <App />,
  children: [
    {
      path: RouteEnum.login,
      element: <Login />,
    },
    {
      path: RouteEnum.logout,
      element: <Logout />,
    },
    {
      path: RouteEnum.admin,
      element: <ProtectedRoute />,
      ErrorBoundary: () => {
        return <div>Handle with error</div>
      },
      children: [
        {
          path: RouteEnum.workout,
          element: <Workout />,
        },
        {
          path: RouteEnum['workout/start/:workout_id'],
          element: <WorkoutTime />,
        },
      ],
    },
  ],
} satisfies RouteObject

// TODO: validate if this is the best way to create the routes
export const router = createBrowserRouter([routeDataSource])
