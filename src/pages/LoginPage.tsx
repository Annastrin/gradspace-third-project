import React from "react"
import { Navigate } from "react-router-dom"
import Box from "@mui/material/Box"
import Navbar from "../components/Navbar/Navbar"
import SignIn from "../components/SignIn/SignIn"
import { AuthContext, AuthContextType } from "../hooks/useAuth"

const LoginPage = () => {
  const { user } = React.useContext(AuthContext) as AuthContextType

  if (user) {
    return <Navigate to='/' />
  }

  return (
    <>
      <Navbar />

      <Box
        mt={4}
        mb={6}
        sx={{
          display: "flex",
          justifyContent: "center",
          paddingX: { xs: "16px", sm: "24px" },
        }}>
        <SignIn />
      </Box>
    </>
  )
}

export default LoginPage
