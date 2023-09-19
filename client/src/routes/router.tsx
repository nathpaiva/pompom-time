import { createBrowserRouter } from 'react-router-dom'

import { App } from '../App'
import { ProtectedRoute } from '../components'
import { Login, Logout, Workout } from '../pages'

export enum RouteEnum {
  login = 'login',
  logout = 'logout',
  admin = 'admin',
  workout = 'workout',
}

// TODO: validate if this is the best way to create the routes
export const router = createBrowserRouter([
  {
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
        children: [
          {
            path: RouteEnum.workout,
            element: <Workout />,
          },
        ],
      },
    ],
  },
])
