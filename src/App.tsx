import { useState, useEffect } from "react"
import axios from "axios"
import Box from "@mui/material/Box"
import Snackbar from "@mui/material/Snackbar"
import Alert from "@mui/material/Alert"
import Navbar from "./components/Navbar/Navbar"
import ProductsTable from "./components/ProductsTable/ProductsTable"
import SignIn from "./components/SignIn/SignIn"
import "@fontsource/roboto/300.css"
import "@fontsource/roboto/400.css"
import "@fontsource/roboto/500.css"
import "@fontsource/roboto/700.css"

const App = () => {
  const [loginToken, setLoginToken] = useState<string | null>(null)
  const [loginError, setLoginError] = useState<string | null>(null)
  const [showLoginSuccess, setShowLoginSuccess] = useState(false)
  const [isLoggedIn, setLoggedIn] = useState(false)
  const [openSignIn, setOpenSignIn] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    getLoginToken()
  }, [])

  const getLoginToken = () => {
    const tokenItemData = localStorage.getItem("productTableAuth")
    if (!tokenItemData) {
      console.log("no saved token item")
      setLoginToken(null)
      return
    }

    const tokenItem = JSON.parse(tokenItemData)
    const now = new Date()
    console.log(tokenItem.token, now, tokenItem.expiryDate)
    if (now > tokenItem.expiryDate) {
      localStorage.removeItem("productTableAuth")
      return
    }
    setLoginToken(tokenItem.token)
    setLoggedIn(true)
  }

  const signIn = (email: string, password: string) => {
    axios
      .post("https://app.spiritx.co.nz/api/login", { email, password })
      .then((res) => {
        const token = res.data.token.token
        setLoginError(null)
        setLoginToken(token)
        saveToLocalStorage(token)
        setOpenSignIn(false)
        setShowLoginSuccess(true)
        setLoggedIn(true)
        console.log(res.data, token)
      })
      .catch((err) => {
        if (axios.isAxiosError(err)) {
          setLoginError(err.message)
        } else {
          setLoginError("An unexpected error occurred on logging in")
        }
      })
  }

  const handleOpenSignInDialog = () => {
    setOpenSignIn(true)
  }

  const handleCloseSignInDialog = () => {
    setOpenSignIn(false)
  }

  const handleCloseLoginSuccess = () => {
    setShowLoginSuccess(false)
  }

  return (
    <>
      <Navbar
        handleSignInClick={handleOpenSignInDialog}
        isLoggedIn={isLoggedIn}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <Box
        mt={4}
        sx={{
          display: "flex",
          justifyContent: "center",
          paddingX: { xs: "16px", sm: "24px" },
        }}>
        <ProductsTable
          searchQuery={searchQuery}
          isLoggedIn={isLoggedIn}
          loginToken={loginToken}
          openSignInDialog={handleOpenSignInDialog}
        />
      </Box>
      <SignIn
        open={openSignIn}
        handleClose={handleCloseSignInDialog}
        signIn={signIn}
        loginErrors={loginError}
        closeErrorsAlert={() => setLoginError(null)}
      />
      <Snackbar
        open={showLoginSuccess}
        autoHideDuration={3000}
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

function saveToLocalStorage(token: string) {
  const now = new Date()
  const expiryDate = new Date()
  expiryDate.setDate(now.getDate() + 10)

  const item = {
    token: token,
    expiryDate: expiryDate,
  }
  localStorage.setItem("productTableAuth", JSON.stringify(item))
}

export default App
