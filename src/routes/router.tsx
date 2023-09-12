import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom'

import { App } from '../App'
import { ProtectedRoute } from '../components'
import { Login, Logout, Workout } from '../pages'

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="login" element={<Login />} />
      <Route path="logout" element={<Logout />} />

      {/* to all authenticated users */}
      <Route path="/admin" element={<ProtectedRoute />}>
        <Route path="workout" element={<Workout />} />
      </Route>
    </Route>,
  ),
)
