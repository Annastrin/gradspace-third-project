import { useCallback, useState, useEffect } from "react"
import axios from "axios"
import Box from "@mui/material/Box"
import CircularProgress from "@mui/material/CircularProgress"
import Alert from "@mui/material/Alert"
import TableActions from "./components/TableActions"
import ProductTableBody from "./components/ProductTableBody"
import type { GetProductsResponse, Product, Products } from "./tableTypes"

interface ProductsTableProps {
  searchQuery: string
  isLoggedIn: boolean
  loginToken: string | null
  openSignInDialog: () => void
}

const ProductsTable = ({
  searchQuery,
  isLoggedIn,
  loginToken,
  openSignInDialog,
}: ProductsTableProps) => {
  const [products, setProducts] = useState<Products>({})
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
        const productsObj = res.data.reduce<Products>((acc, product) => {
          acc[product.id] = product
          return acc
        }, {})

        setProducts(productsObj)
        setProductsError(null)
      })
      .catch((err) => {
        setProducts({})
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
    setProducts((prev) => ({ ...prev, [product.id]: product }))
  }

  const removeProductFromProducts = (id: number) => {
    setProducts((prevProducts) => {
      const updatedProducts = { ...prevProducts }
      delete updatedProducts[id]
      return updatedProducts
    })
  }

  const handleAddNewProductRow = useCallback(() => {
    setAddingNewProduct(true)
  }, [])

  const handleCancelAddingNewProduct = useCallback(() => {
    setAddingNewProduct(false)
  }, [])

  // Avoid a layout jump when reaching the last page with empty rows.
  // const productsArr = Object.values(products)

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1200,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
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
            products={products}
            addProductToProducts={addProductToProducts}
          />
          <ProductTableBody
            products={products}
            searchQuery={searchQuery}
            addProductToProducts={addProductToProducts}
            isLoggedIn={isLoggedIn}
            loginToken={loginToken}
            openSignInDialog={openSignInDialog}
            isAddingNewProduct={isAddingNewProduct}
            cancelAddingNewProduct={handleCancelAddingNewProduct}
            removeProductFromProducts={removeProductFromProducts}
          />
        </Box>
      )}
    </Box>
  )
}

export default ProductsTable
