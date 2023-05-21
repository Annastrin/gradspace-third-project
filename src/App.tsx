import { useState, useEffect, useRef } from "react"
import axios from "axios"
import CircularProgress from "@mui/material/CircularProgress"
import Grid from "@mui/material/Grid"
import { Navbar } from "./components/Navbar/Navbar"
import { ProductsTable } from "./components/ProductsTable/ProductsTable"
import { GetProductsResponse } from "./types"

const App = () => {
  const [data, setData] = useState<GetProductsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get<GetProductsResponse>(
          `https://app.spiritx.co.nz/api/products`
        )
        console.log(data)
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
  return (
    <>
      <Navbar />
      <Grid container justifyContent='center' mt={4}>
        {loading && <CircularProgress />}
        {error && (
          <div>{`There is a problem fetching the products data - ${error}`}</div>
        )}
        {data && <ProductsTable data={data} />}
      </Grid>
    </>
  )
}

export default App
