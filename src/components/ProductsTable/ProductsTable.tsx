import { useCallback, useState, useEffect } from "react"
import axios from "axios"
import Box from "@mui/material/Box"
import CircularProgress from "@mui/material/CircularProgress"
import Alert from "@mui/material/Alert"
import TableActions from "./components/TableActions"
import ProductTableBody from "./components/ProductTableBody"
import { apiGet } from "../../api/service"
import type { Product, Products } from "../../types"

interface ProductsTableProps {
  searchQuery: string
}

const ProductsTable = ({ searchQuery }: ProductsTableProps) => {
  const [products, setProducts] = useState<Products>({})
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [productsError, setProductsError] = useState<string | null>(null)
  const [isAddingNewProduct, setAddingNewProduct] = useState(false)

  useEffect(() => {
    getData()
  }, [])

  const getData = () => {
    apiGet("products")
      .then((res) => {
        console.log(res.data)
        const productsObj = res.data.reduce(
          (acc: Products, product: Product) => {
            acc[product.id] = product
            return acc
          },
          {}
        )
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
            handleAddNewProductRow={handleAddNewProductRow}
            products={products}
            addProductToProducts={addProductToProducts}
          />
          <ProductTableBody
            products={products}
            searchQuery={searchQuery}
            addProductToProducts={addProductToProducts}
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
