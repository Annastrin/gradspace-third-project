import Box from "@mui/material/Box"
import Navbar from "../components/Navbar/Navbar"
import SignIn from "../components/SignIn/SignIn"

const LoginPage = () => {
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
