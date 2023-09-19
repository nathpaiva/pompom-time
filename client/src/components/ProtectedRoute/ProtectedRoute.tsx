import { Navigate, Outlet } from 'react-router-dom'

import { useAuth } from './hooks'

export function ProtectedRoute() {
  const { isLoggedIn } = useAuth()

  if (!isLoggedIn) {
    return <Navigate to="/login" />
  }

  return <Outlet />
}
