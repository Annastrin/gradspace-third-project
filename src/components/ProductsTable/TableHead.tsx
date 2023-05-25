import Box from "@mui/material/Box"
import TableCell from "@mui/material/TableCell"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import TableSortLabel from "@mui/material/TableSortLabel"
import { visuallyHidden } from "@mui/utils"
import { SortableData, Order } from "./tableTypes"
import React from "react"

interface EnhancedTableProps {
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof SortableData
  ) => void
  order: Order
  orderBy: string
  rowCount: number
}

const EnhancedTableHead = React.memo((props: EnhancedTableProps) => {
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
              onClick={createSortHandler(headCell.id)}
              sx={{ fontSize: "1.2rem", fontWeight: 600 }}>
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
          <TableCell
            key={headCell.id}
            align={"center"}
            padding={"normal"}
            sx={{ fontSize: "1.2rem", fontWeight: 600 }}>
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
})

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

export default EnhancedTableHead
