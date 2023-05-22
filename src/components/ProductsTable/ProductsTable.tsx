import { useMemo, useState } from "react"
import Box from "@mui/material/Box"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TablePagination from "@mui/material/TablePagination"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"
import { GetProductsResponse } from "../../types"
import { Data, SortableData, Order } from "./tableTypes"
import { EnhancedTableHead } from "./TableHead"
import { TableActions } from "./TableActions"
import { ProductImage } from "./ProductImage"
import { ProductActions } from "./ProductActions"

interface ProductsTableProps {
  data: GetProductsResponse
}

export const ProductsTable = ({ data }: ProductsTableProps) => {
  const [order, setOrder] = useState<Order>("asc")
  const [orderBy, setOrderBy] = useState<keyof SortableData>("title")
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof SortableData
  ) => {
    const isAsc = orderBy === property && order === "asc"
    setOrder(isAsc ? "desc" : "asc")
    setOrderBy(property)
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0

  const visibleRows = useMemo(() => {
    const rows = data.map<Data>((product) => ({
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      image: <ProductImage src={product.product_image} />,
      actions: <ProductActions id={product.id} />,
    }))
    return stableSort<Data>(
      rows,
      getComparator<keyof SortableData>(order, orderBy)
    ).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
  }, [order, orderBy, page, rowsPerPage])

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", maxWidth: 1200, margin: "0 auto", mb: 2 }}>
        <TableActions />
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
              {visibleRows.map((row) => {
                return (
                  <TableRow hover tabIndex={-1} key={row.id}>
                    <TableCell component='th' scope='row' align='center'>
                      {row.title}
                    </TableCell>
                    <TableCell align='center'>{row.description}</TableCell>
                    <TableCell align='center'>{row.price}</TableCell>
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
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component='div'
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
