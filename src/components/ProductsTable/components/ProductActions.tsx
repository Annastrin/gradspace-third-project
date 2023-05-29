import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"

interface ProductActionsProps {
  id: number
  setRowToEdit: React.Dispatch<React.SetStateAction<number | null>>
}

const ProductActions = ({ id, setRowToEdit }: ProductActionsProps) => {
  const handleEdit = () => {
    setRowToEdit(id)
  }
  return (
    <Box aria-label='product actions'>
      <IconButton sx={{ marginX: "7px" }} onClick={handleEdit}>
        <EditIcon color='primary' />
      </IconButton>
      <IconButton sx={{ marginX: "7px" }}>
        <DeleteIcon color='primary' />
      </IconButton>
    </Box>
  )
}

export default ProductActions
