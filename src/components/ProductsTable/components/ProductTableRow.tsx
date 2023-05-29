import TableCell from "@mui/material/TableCell"
import TableRow from "@mui/material/TableRow"
import NewProductRow from "./NewProductRow"
import ProductImage from "./ProductImage"
import type { ProductAction, Data, NewProduct } from "../tableTypes"

interface ProductTableRowProps {
  row: Data
  isEditing: boolean
  submitEditing: ({ id, title, description, price, image }: NewProduct) => void
  submitAdding: ({ title, description, price, image }: NewProduct) => void
  cancelAddOrEditProduct: (action: ProductAction) => void
}

const ProductTableRow = ({
  row,
  isEditing,
  submitEditing,
  submitAdding,
  cancelAddOrEditProduct,
}: ProductTableRowProps) => {
  let tableRow
  if (isEditing) {
    tableRow = (
      <NewProductRow
        editMode={isEditing}
        initialValues={{
          id: row.id.toString(),
          title: row.title,
          price: row.price.toFixed(2),
          description: row.description,
          image: row.image,
        }}
        submitAdding={submitAdding}
        submitEditing={submitEditing}
        cancelAddOrEditProduct={cancelAddOrEditProduct}
      />
    )
  } else {
    tableRow = (
      <TableRow hover tabIndex={-1}>
        <TableCell scope='row' align='center'>
          {row.title}
        </TableCell>
        <TableCell align='center'>{row.description}</TableCell>
        <TableCell align='center'>{row.price.toFixed(2)}</TableCell>
        <TableCell align='center'>
          {row.image && <ProductImage src={row.image} />}
        </TableCell>
        <TableCell align='center'>{row.actions}</TableCell>
      </TableRow>
    )
  }
  return tableRow
}

export default ProductTableRow
