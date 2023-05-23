import { useState, useEffect, useMemo } from "react"
import axios from "axios"
import CircularProgress from "@mui/material/CircularProgress"
import Grid from "@mui/material/Grid"
import Navbar from "./components/Navbar/Navbar"
import ProductsTable from "./components/ProductsTable/ProductsTable"
import SignIn from "./components/SignIn/SignIn"
import { GetProductsResponse } from "./types"

const App = () => {
  const [data, setData] = useState<GetProductsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openSignIn, setOpenSignIn] = useState(false)

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get<GetProductsResponse>(
          `https://app.spiritx.co.nz/api/products`
        )
        setData(data)
        setError(null)
      } catch (err) {
        setData(null)
        if (axios.isAxiosError(err)) {
          setError(err.message)
        } else {
          setError("An unexpected error occurred")
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
    console.log("sign in: ", email, password)
  }

  return (
    <>
      <Navbar handleSignInClick={handleOpenSignInDialog} />
      <Grid container justifyContent='center' mt={4}>
        {loading && <CircularProgress />}
        {error && (
          <div>{`There is a problem fetching the products data - ${error}`}</div>
        )}
        {useMemo(() => {
          return data && <ProductsTable data={data} />
        }, [data])}
      </Grid>
      <SignIn
        open={openSignIn}
        handleClose={handleCloseSignInDialog}
        signIn={signIn}
      />
    </>
  )
}

export default App
