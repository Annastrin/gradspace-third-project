import { useState, useEffect } from "react"
import axios from "axios"
import CircularProgress from "@mui/material/CircularProgress"
import Box from "@mui/material/Box"
import Alert from "@mui/material/Alert"
import Navbar from "./components/Navbar/Navbar"
import ProductsTable from "./components/ProductsTable/ProductsTable"
import SignIn from "./components/SignIn/SignIn"
import { GetProductsResponse } from "./types"
import "@fontsource/roboto/300.css"
import "@fontsource/roboto/400.css"
import "@fontsource/roboto/500.css"
import "@fontsource/roboto/700.css"

const App = () => {
  const [data, setData] = useState<GetProductsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [fetchProductsError, setFetchProductsError] = useState<string | null>(
    null
  )
  const [loginError, setLoginError] = useState<string | null>(null)
  const [loginToken, setLoginToken] = useState<string | null>(null)
  const [isLoggedIn, setLoggedIn] = useState(false)
  const [openSignIn, setOpenSignIn] = useState(false)

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get<GetProductsResponse>(
          "https://app.spiritx.co.nz/api/products"
        )
        setData(data)
        setFetchProductsError(null)
      } catch (err) {
        setData(null)
        if (axios.isAxiosError(err)) {
          setFetchProductsError(err.message)
        } else {
          setFetchProductsError(
            "An unexpected error occurred on fetching products"
          )
        }
      } finally {
        setLoading(false)
      }
    }
    getData()
  }, [])

  useEffect(() => {
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
    getLoginToken()
  }, [])

  const handleOpenSignInDialog = () => {
    setOpenSignIn(true)
  }

  const handleCloseSignInDialog = () => {
    setOpenSignIn(false)
  }

  const signIn = (email: string, password: string) => {
    const login = async () => {
      try {
        const { data } = await axios.post(
          "https://app.spiritx.co.nz/api/login",
          { email, password }
        )
        const token = data.token.token
        setLoginError(null)
        setLoginToken(token)
        saveToLocalStorage(token)
        setLoggedIn(true)
        setOpenSignIn(false)
        console.log(data, token)
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setLoginError(err.message)
        } else {
          setLoginError("An unexpected error occurred on logging in")
        }
      }
    }
    login()
  }

  return (
    <>
      <Navbar
        handleSignInClick={handleOpenSignInDialog}
        isLoggedIn={isLoggedIn}
      />
      <Box
        mt={4}
        sx={{
          display: "flex",
          justifyContent: "center",
          paddingX: { xs: "16px", sm: "24px" },
        }}>
        {loading && <CircularProgress />}
        {fetchProductsError && (
          <Alert severity='error' onClose={() => setFetchProductsError(null)}>
            {`There is a problem fetching the products data - ${fetchProductsError}`}
          </Alert>
        )}

        {data && (
          <ProductsTable
            data={data}
            isLoggedIn={isLoggedIn}
            loginToken={loginToken}
            openSignInDialog={handleOpenSignInDialog}
          />
        )}
      </Box>
      <SignIn
        open={openSignIn}
        handleClose={handleCloseSignInDialog}
        signIn={signIn}
        loginErrors={loginError}
        closeErrorsAlert={() => setLoginError(null)}
      />
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
