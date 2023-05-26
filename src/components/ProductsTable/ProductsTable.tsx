import { useCallback, useState, useEffect } from "react"
import axios from "axios"
import Box from "@mui/material/Box"
import CircularProgress from "@mui/material/CircularProgress"
import Alert from "@mui/material/Alert"
import TableActions from "./TableActions"
import ProductTableBody from "./ProductTableBody"
import type { GetProductsResponse, Product } from "../../types"

interface ProductsTableProps {
  isLoggedIn: boolean
  loginToken: string | null
  openSignInDialog: () => void
}

const ProductsTable = ({
  isLoggedIn,
  loginToken,
  openSignInDialog,
}: ProductsTableProps) => {
  const [products, setProducts] = useState<GetProductsResponse | null>(null)
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [productsError, setProductsError] = useState<string | null>(null)
  const [isAddingNewProduct, setAddingNewProduct] = useState(false)

  useEffect(() => {
    getData()
  }, [])

  const getData = () => {
    axios
      .get<GetProductsResponse>("https://app.spiritx.co.nz/api/products")
      .then((res) => {
        setProducts(res.data)
        setProductsError(null)
      })
      .catch((err) => {
        setProducts(null)
        if (axios.isAxiosError(err)) {
          setProductsError(err.message)
        } else {
          setProductsError("An unexpected error occurred on fetching products")
        }
      })
      .finally(() => {
        setLoadingProducts(false)
      })
  }

  const addProductToProducts = (product: Product) => {
    if (products) {
      setProducts([...products, product])
    } else {
      setProducts([product])
    }
  }

  const handleAddNewProductRow = useCallback(() => {
    setAddingNewProduct(true)
  }, [])

  const handleCancelAddingNewProduct = () => {
    setAddingNewProduct(false)
  }

  // Avoid a layout jump when reaching the last page with empty rows.

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1200,
        margin: "0 auto",
        display: "flex",
        justifyContent: "center",
      }}>
      {loadingProducts && <CircularProgress />}
      {productsError && (
        <Alert severity='error' onClose={() => setProductsError(null)}>
          {`There is a problem fetching the products data - ${productsError}`}
        </Alert>
      )}
      {products && (
        <Box sx={{ width: "100%" }}>
          <TableActions
            isAddingNewProduct={isAddingNewProduct}
            cancelAddingNewProduct={handleCancelAddingNewProduct}
            isLoggedIn={isLoggedIn}
            openSignInDialog={openSignInDialog}
            handleAddNewProductRow={handleAddNewProductRow}
          />
          <ProductTableBody
            products={products}
            addProductToProducts={addProductToProducts}
            isLoggedIn={isLoggedIn}
            loginToken={loginToken}
            openSignInDialog={openSignInDialog}
            isAddingNewProduct={isAddingNewProduct}
          />
        </Box>
      )}
    </Box>
  )
}

export default ProductsTable
