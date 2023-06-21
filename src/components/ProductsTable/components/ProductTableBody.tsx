import React, { useState, useCallback, useMemo, useEffect } from "react"
import type { ComponentProps } from "react"
import axios from "axios"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TablePagination from "@mui/material/TablePagination"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"
import Snackbar from "@mui/material/Snackbar"
import Alert, { AlertColor } from "@mui/material/Alert"
import EnhancedTableHead from "./TableHead"
import ProductActions from "./ProductActions"
import NewProductRow from "./NewProductRow"
import ProductTableRow from "./ProductTableRow"
import ConfirmDeleteDialog from "../../ConfirmDeleteDialog/ConfirmDeleteDialog"
import { apiPost, apiPut, apiDelete } from "../../../api/service"
import type {
  Product,
  Data,
  SortableData,
  Order,
  ProductAction,
  Products,
  AddOrEditProductProps,
  ProductToDelete,
} from "../../../types"

interface ProductTableBodyProps {
  products: Products
  searchQuery: string
  addProductToProducts: (product: Product) => void
  isAddingNewProduct: boolean
  cancelAddingNewProduct: () => void
  removeProductFromProducts: (id: number) => void
}

const ProductTableBody = ({
  products,
  searchQuery,
  addProductToProducts,
  isAddingNewProduct,
  cancelAddingNewProduct,
  removeProductFromProducts,
}: ProductTableBodyProps) => {
  const [order, setOrder] = useState<Order>("asc")
  const [orderBy, setOrderBy] = useState<keyof SortableData>("title")
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [rowToEdit, setRowToEdit] = useState<number | null>(null)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [productToDelete, setProductToDelete] = useState({} as ProductToDelete)
  const [showMessage, setShowMessage] = useState(false)
  const [messageText, setMessageText] = useState("")
  const [messageState, setMessageState] = useState<AlertColor | undefined>(
    "success"
  )

  useEffect(() => {
    setPage(0)
  }, [searchQuery])

  const handleRequestSort = useCallback(
    (event: React.MouseEvent<unknown>, property: keyof SortableData) => {
      const isAsc = orderBy === property && order === "asc"
      setOrder(isAsc ? "desc" : "asc")
      setOrderBy(property)
    },
    [order, orderBy]
  )

  const handleChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage)
  }, [])

  const handleChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10))
      setPage(0)
    },
    []
  )

  const submitAddOrEdit = useCallback(
    ({ action, product }: AddOrEditProductProps) => {
      const newProductData = new FormData()

      if (action === "add") {
        newProductData.append("title", product.title)
        newProductData.append("price", product.price)
        newProductData.append("category_id", "99")
        newProductData.append("_method", "POST")
      } else if (action === "edit") {
        product.title && newProductData.append("title", product.title)
        product.price && newProductData.append("price", product.price)
        newProductData.append("_method", "PUT")
      }
      product.description !== undefined &&
        newProductData.append("description", product.description)
      product.image && newProductData.append("image", product.image)

      const apiPart =
        action === "add"
          ? apiPost("products", newProductData)
          : apiPut(`products/${product.id}`, newProductData)

      apiPart
        .then((res) => {
          addProductToProducts(res.data)
          action === "add"
            ? setMessageText("The product was added!")
            : setMessageText("The product was updated!")
          setMessageState("success")
          setShowMessage(true)
        })
        .catch((err) => {
          if (axios.isAxiosError(err)) {
            setMessageText(err.message)
            setMessageState("error")
            setShowMessage(true)
            console.log(err.message)
          } else {
            console.log(
              "An unexpected error occurred on adding or editing a new product"
            )
          }
        })
    },
    [addProductToProducts]
  )

  const cancelAddOrEditProduct = useCallback(
    (action: ProductAction) => {
      if (action === "add") {
        cancelAddingNewProduct()
      }
      if (action === "edit") {
        setRowToEdit(null)
      }
    },
    [cancelAddingNewProduct]
  )

  const deleteProduct = (id: number) => {
    apiDelete(`products/${id}`)
      .then((res) => {
        removeProductFromProducts(id)
        setShowConfirmDelete(false)
        setMessageText("The product was deleted!")
        setMessageState("success")
        setShowMessage(true)
      })
      .catch((err) => {
        if (axios.isAxiosError(err)) {
          console.log(err.message)
          setMessageText(err.message)
          setMessageState("error")
          setShowMessage(true)
        } else {
          console.log(
            "An unexpected error occurred on adding or editing a new product"
          )
        }
      })
  }

  const openConfirmDeleteDialog = () => {
    setShowConfirmDelete(true)
  }

  const closeConfirmDeleteDialog = () => {
    setShowConfirmDelete(false)
  }

  const productsToShow = useMemo(() => {
    return Object.values(products)
      .filter((product) => {
        if (!searchQuery) {
          return true
        }
        return (
          product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })
      .map<Data>((product) => ({
        id: product.id,
        title: product.title,
        description: product.description ?? "",
        price: parseFloat(product.price),
        image: product.image,
        actions: (
          <ProductActions
            title={product.title}
            id={product.id}
            setRowToEdit={setRowToEdit}
            openConfirmDeleteDialog={openConfirmDeleteDialog}
            setProductToDelete={setProductToDelete}
          />
        ),
      }))
  }, [products, searchQuery])

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - productsToShow.length) : 0

  const pageCount = Math.ceil(productsToShow.length / rowsPerPage)
  const validPage = page < pageCount ? page : Math.max(0, pageCount - 1)

  const visibleRows = useMemo(() => {
    return stableSort<Data>(
      productsToShow,
      getComparator<keyof SortableData>(order, orderBy)
    ).slice(validPage * rowsPerPage, validPage * rowsPerPage + rowsPerPage)
  }, [order, orderBy, validPage, rowsPerPage, productsToShow])

  return (
    <Paper sx={{ width: "100%", maxWidth: 1200, margin: "0 auto", mb: 2 }}>
      <TableContainer>
        <Table
          sx={{ minWidth: 750 }}
          aria-labelledby='tableTitle'
          size={"medium"}>
          <EnhancedTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            rowCount={productsToShow.length}
          />
          <TableBody>
            {isAddingNewProduct && (
              <NewProductRow
                key='new-product'
                submitAddOrEdit={submitAddOrEdit}
                cancelAddOrEditProduct={cancelAddOrEditProduct}
              />
            )}
            {visibleRows.map((row) => {
              if (row.id === rowToEdit) {
                return (
                  <ProductTableRow
                    row={row}
                    key={row.id}
                    isEditing={true}
                    submitAddOrEdit={submitAddOrEdit}
                    cancelAddOrEditProduct={cancelAddOrEditProduct}
                  />
                )
              } else
                return (
                  <ProductTableRow
                    row={row}
                    key={row.id}
                    isEditing={false}
                    submitAddOrEdit={submitAddOrEdit}
                    cancelAddOrEditProduct={cancelAddOrEditProduct}
                  />
                )
            })}
            {emptyRows > 0 && (
              <TableRow
                style={{
                  height: 53 * emptyRows,
                }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePaginationMemo
        rowsPerPageOptions={rowsPerPageOptions}
        count={productsToShow.length}
        rowsPerPage={rowsPerPage}
        page={validPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Snackbar
        open={showMessage}
        onClose={() => setShowMessage(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert
          variant='filled'
          onClose={() => setShowMessage(false)}
          severity={messageState}
          sx={{ width: "100%" }}>
          {messageText}
        </Alert>
      </Snackbar>
      <ConfirmDeleteDialog
        id={productToDelete.id}
        title={productToDelete.title}
        open={showConfirmDelete}
        onClose={closeConfirmDeleteDialog}
        onConfirm={deleteProduct}
      />
    </Paper>
  )
}

const rowsPerPageOptions = [5, 10, 25]

const TablePaginationMemo = React.memo(
  (props: ComponentProps<typeof TablePagination>) => (
    <TablePagination component='div' {...props} />
  )
)

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) {
      return order
    }
    return a[1] - b[1]
  })
  return stabilizedThis.map((el) => el[0])
}

export default ProductTableBody
