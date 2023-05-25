import React, { ComponentProps, useCallback, useMemo, useState } from "react"
import axios from "axios"
import Box from "@mui/material/Box"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TablePagination from "@mui/material/TablePagination"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"
import type { GetProductsResponse, NewProduct } from "../../types"
import type { Data, SortableData, Order } from "./tableTypes"
import EnhancedTableHead from "./TableHead"
import TableActions from "./TableActions"
import ProductImage from "./ProductImage"
import ProductActions from "./ProductActions"
import NewProductRow from "./NewProductRow"

interface ProductsTableProps {
  data: GetProductsResponse
  isLoggedIn: boolean
  loginToken: string | null
  openSignInDialog: () => void
}

const ProductsTable = ({
  data,
  isLoggedIn,
  loginToken,
  openSignInDialog,
}: ProductsTableProps) => {
  const [order, setOrder] = useState<Order>("asc")
  const [orderBy, setOrderBy] = useState<keyof SortableData>("title")
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [isAddingNewProduct, setAddingNewProduct] = useState(false)

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

  const handleAddNewProductRow = useCallback(() => {
    setAddingNewProduct(true)
  }, [])

  const handleCancelAddingNewProduct = () => {
    setAddingNewProduct(false)
  }

  const handleSubmitNewProduct = ({
    title,
    description,
    price,
    image,
  }: NewProduct) => {
    if (isLoggedIn) {
      console.log("try to add a new product")
      const newProductData = new FormData()
      newProductData.append("title", title)
      description && newProductData.append("description", description)
      newProductData.append("price", price)
      image && newProductData.append("product_image", image)
      newProductData.append("price", price)
      newProductData.append("category_id", "99")
      newProductData.append("_method", "POST")
      console.log(
        newProductData.get("title"),
        newProductData.get("description"),
        newProductData.get("price"),
        newProductData.get("product_image")
      )

      const addNewProduct = async () => {
        try {
          const { data } = await axios.post(
            "https://app.spiritx.co.nz/api/products",
            newProductData,
            {
              headers: {
                token: loginToken,
              },
            }
          )
          console.log(data)
        } catch (err) {
          if (axios.isAxiosError(err)) {
            console.log(err.message)
          } else {
            console.log("An unexpected error occurred on adding a new product")
          }
        }
      }
      addNewProduct()
    } else {
      openSignInDialog()
    }
  }

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0

  const visibleRows = useMemo(() => {
    const rows = data.map<Data>((product) => ({
      id: product.id,
      title: product.title,
      description: product.description,
      price: parseFloat(product.price),
      image: <ProductImage src={product.product_image} />,
      actions: <ProductActions id={product.id} />,
    }))
    return stableSort<Data>(
      rows,
      getComparator<keyof SortableData>(order, orderBy)
    ).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
  }, [order, orderBy, page, rowsPerPage, data])

  return (
    <Box sx={{ width: "100%", maxWidth: 1200, margin: "0 auto" }}>
      <TableActions
        isAddingNewProduct={isAddingNewProduct}
        cancelAddingNewProduct={handleCancelAddingNewProduct}
        isLoggedIn={isLoggedIn}
        openSignInDialog={openSignInDialog}
        handleAddNewProductRow={handleAddNewProductRow}
      />
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
              rowCount={data.length}
            />
            <TableBody>
              {isAddingNewProduct && (
                <NewProductRow submit={handleSubmitNewProduct} />
              )}
              {visibleRows.map((row) => {
                return (
                  <TableRow hover tabIndex={-1} key={row.id}>
                    <TableCell scope='row' align='center'>
                      {row.title}
                    </TableCell>
                    <TableCell align='center'>{row.description}</TableCell>
                    <TableCell align='center'>{row.price.toFixed(2)}</TableCell>
                    <TableCell align='center'>{row.image}</TableCell>
                    <TableCell align='center'>{row.actions}</TableCell>
                  </TableRow>
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
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
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

export default ProductsTable
