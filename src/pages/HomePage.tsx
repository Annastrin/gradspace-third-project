import React, { useState } from "react"
import Box from "@mui/material/Box"
import Snackbar from "@mui/material/Snackbar"
import Alert from "@mui/material/Alert"
import Navbar from "../components/Navbar/Navbar"
import ProductsTable from "../components/ProductsTable/ProductsTable"
import Search from "../components/Search/Search"
import { AuthContext, AuthContextType } from "../hooks/useAuth"

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const { isLoginSuccess } = React.useContext(AuthContext) as AuthContextType
  const [showLoginSuccess, setShowLoginSuccess] = useState(isLoginSuccess)

  const handleCloseLoginSuccess = () => {
    setShowLoginSuccess(false)
  }

  return (
    <>
      <Navbar>
        <Box>
          <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </Box>
      </Navbar>
      <Box
        mt={4}
        mb={6}
        sx={{
          display: "flex",
          justifyContent: "center",
          paddingX: { xs: "16px", sm: "24px" },
        }}>
        <ProductsTable searchQuery={searchQuery} />
      </Box>
      <Snackbar
        open={showLoginSuccess}
        autoHideDuration={5000}
        onClose={handleCloseLoginSuccess}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert
          variant='filled'
          onClose={handleCloseLoginSuccess}
          severity='success'
          sx={{ width: "100%" }}>
          You're logged in!
        </Alert>
      </Snackbar>
    </>
  )
}

export default HomePage
