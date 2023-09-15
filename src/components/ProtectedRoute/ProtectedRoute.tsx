import { useIdentityContext } from 'react-netlify-identity'
import { Navigate, Outlet } from 'react-router-dom'

export function ProtectedRoute() {
  const { isLoggedIn } = useIdentityContext()

  if (!isLoggedIn) {
    return <Navigate to="/login" />
  }

  return <Outlet />
}
