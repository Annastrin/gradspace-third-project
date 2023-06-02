import { createContext, useContext, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useLocalStorage } from "./useLocalStorage"
import type { UserData } from "../types"

export type AuthContextType = {
  user: UserData
  isLoginSuccess: boolean
  login: (data: UserData) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | null>(null)

interface AuthProviderProps {
  children: JSX.Element | JSX.Element[] | null
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useLocalStorage("products-table-user")
  const [isLoginSuccess, setIsLoginSuccess] = useState(false)
  const navigate = useNavigate()

  // call this function when you want to authenticate the user
  const login = async (data: UserData) => {
    setUser(data)
    setIsLoginSuccess(true)
    navigate("/")
  }

  // call this function to sign out logged in user
  const logout = () => {
    setUser(null)
    setIsLoginSuccess(false)
    navigate("/login", { replace: true })
  }

  const value = useMemo(
    () => ({
      user,
      isLoginSuccess,
      login,
      logout,
    }),
    [user, isLoginSuccess]
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  return useContext(AuthContext)
}
