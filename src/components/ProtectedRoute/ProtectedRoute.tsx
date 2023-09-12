import { Navigate, Outlet } from 'react-router-dom'

import { useAuth } from '../Auth'

export function ProtectedRoute() {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" />
  }

  return <Outlet />
}
