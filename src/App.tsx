import { useState, useEffect, useMemo } from "react"
import axios from "axios"
import CircularProgress from "@mui/material/CircularProgress"
import Box from "@mui/material/Box"
import Alert from "@mui/material/Alert"
import Navbar from "./components/Navbar/Navbar"
import ProductsTable from "./components/ProductsTable/ProductsTable"
import SignIn from "./components/SignIn/SignIn"
import { GetProductsResponse } from "./types"

const App = () => {
  const [data, setData] = useState<GetProductsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [fetchProductsError, setFetchProductsError] = useState<string | null>(
    null
  )
  const [loginError, setLoginError] = useState<string | null>(null)
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

  const handleOpenSignInDialog = () => {
    setOpenSignIn(true)
  }

  const handleCloseSignInDialog = () => {
    setOpenSignIn(false)
  }

  const signIn = (email: string, password: string) => {
    const login = async () => {
      try {
        const response = await axios.post(
          "https://app.spiritx.co.nz/api/login",
          { email, password }
        )
        setLoginError(null)
        console.log(response)
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
      <Navbar handleSignInClick={handleOpenSignInDialog} />
      <Box
        justifyContent='center'
        mt={4}
        sx={{ paddingX: { xs: "16px", sm: "24px" } }}>
        {loading && <CircularProgress />}
        {fetchProductsError && (
          <Alert severity='error' onClose={() => setFetchProductsError(null)}>
            {`There is a problem fetching the products data - ${fetchProductsError}`}
          </Alert>
        )}
        {useMemo(() => {
          return data && <ProductsTable data={data} />
        }, [data])}
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

export default App
