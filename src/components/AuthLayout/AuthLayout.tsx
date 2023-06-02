import { useOutlet } from "react-router-dom"
import { AuthProvider } from "../../hooks/useAuth"

const AuthLayout = () => {
  const outlet = useOutlet()

  return <AuthProvider>{outlet}</AuthProvider>
}

export default AuthLayout
