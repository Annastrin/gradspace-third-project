import { Navigate } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"

interface ProtectedRouteProps {
  children: JSX.Element | JSX.Element[]
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const authContext = useAuth()
  if (!authContext || !authContext.user) {
    // user is not authenticated or user property is missing
    return <Navigate to='/login' />
  }
  return <>{children}</>
}

export default ProtectedRoute
