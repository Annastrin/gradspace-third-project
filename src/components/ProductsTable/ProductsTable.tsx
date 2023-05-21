import { useMemo, useState } from "react"
import Box from "@mui/material/Box"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TablePagination from "@mui/material/TablePagination"
import TableRow from "@mui/material/TableRow"
import TableSortLabel from "@mui/material/TableSortLabel"
import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"
import IconButton from "@mui/material/IconButton"
import DeleteIcon from "@mui/icons-material/Delete"
import { visuallyHidden } from "@mui/utils"
import { GetProductsResponse } from "../../types"
import { ProductImage } from "./ProductImage"

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
      actions: "",
    }))
    return stableSort<Data>(
      rows,
      getComparator<keyof SortableData>(order, orderBy)
    ).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
  }, [order, orderBy, page, rowsPerPage])

  return (
    <Box sx={{ width: "100%" }}>
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
              {visibleRows.map((row) => {
                return (
                  <TableRow
                    hover
                    tabIndex={-1}
                    key={row.id}
                    sx={{ cursor: "pointer" }}>
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

interface Data {
  id: number
  title: string
  description: string
  price: string
  image: JSX.Element // TODO
  actions: string //TODO
}

interface SortableData {
  id: number
  title: string
  description: string
  price: string
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

type Order = "asc" | "desc"

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

interface SortableHeadCell {
  id: keyof SortableData
  label: string
  numeric: boolean
}

const sortableHeadCell: readonly SortableHeadCell[] = [
  {
    id: "title",
    numeric: false,
    label: "Title",
  },
  {
    id: "description",
    numeric: false,
    label: "Description",
  },
  {
    id: "price",
    numeric: true,
    label: "Price",
  },
]

interface NotSortableHeadCells {
  id: "image" | "actions"
  label: string
}

const notSortableHeadCells: readonly NotSortableHeadCells[] = [
  {
    id: "image",
    label: "Image",
  },
  {
    id: "actions",
    label: "Actions",
  },
]

interface EnhancedTableProps {
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof SortableData
  ) => void
  order: Order
  orderBy: string
  rowCount: number
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, rowCount, onRequestSort } = props
  const createSortHandler =
    (property: keyof SortableData) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property)
    }

  return (
    <TableHead>
      <TableRow>
        {sortableHeadCell.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={"center"}
            padding={"normal"}
            sortDirection={orderBy === headCell.id ? order : false}>
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}>
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component='span' sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        {notSortableHeadCells.map((headCell) => (
          <TableCell key={headCell.id} align={"center"} padding={"normal"}>
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}
