import TableCell from "@mui/material/TableCell"
import TableRow from "@mui/material/TableRow"
import NewProductRow from "./NewProductRow"
import ProductImage from "./ProductImage"
import type { ProductAction, Data, AddOrEditProductProps } from "../../../types"

interface ProductTableRowProps {
  row: Data
  isEditing: boolean
  submitAddOrEdit: ({ action, product }: AddOrEditProductProps) => void
  cancelAddOrEditProduct: (action: ProductAction) => void
}

const ProductTableRow = ({
  row,
  isEditing,
  submitAddOrEdit,
  cancelAddOrEditProduct,
}: ProductTableRowProps) => {
  return isEditing ? (
    <NewProductRow
      editMode={isEditing}
      initialValues={{
        id: row.id.toString(),
        title: row.title,
        price: row.price.toFixed(2),
        description: row.description,
        image: row.image,
      }}
      submitAddOrEdit={submitAddOrEdit}
      cancelAddOrEditProduct={cancelAddOrEditProduct}
    />
  ) : (
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

export default ProductTableRow
