import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import type { ProductToDelete } from "../tableTypes"

interface ProductActionsProps {
  title: string
  id: number
  setRowToEdit: React.Dispatch<React.SetStateAction<number | null>>
  openConfirmDeleteDialog: () => void
  setProductToDelete: React.Dispatch<React.SetStateAction<ProductToDelete>>
}

const ProductActions = ({
  title,
  id,
  setRowToEdit,
  openConfirmDeleteDialog,
  setProductToDelete,
}: ProductActionsProps) => {
  const handleEdit = () => {
    setRowToEdit(id)
  }
  const handleConfirmDelete = () => {
    setProductToDelete({ id, title })
    openConfirmDeleteDialog()
  }
  return (
    <Box aria-label='product actions'>
      <IconButton sx={{ marginX: "7px" }} onClick={handleEdit}>
        <EditIcon color='primary' />
      </IconButton>
      <IconButton sx={{ marginX: "7px" }} onClick={handleConfirmDelete}>
        <DeleteIcon color='primary' />
      </IconButton>
    </Box>
  )
}

export default ProductActions
