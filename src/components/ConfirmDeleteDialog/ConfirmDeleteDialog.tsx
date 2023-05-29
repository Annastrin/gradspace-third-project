import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"

interface ConfirmDeleteDialogProps {
  id: number
  title: string
  open: boolean
  onClose: () => void
  onConfirm: (id: number) => void
}

const ConfirmDeleteDialog = ({
  id,
  title,
  open,
  onClose,
  onConfirm,
}: ConfirmDeleteDialogProps) => {
  const handleDelete = () => {
    onConfirm(id)
  }
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>
        <p>
          Are you sure you want to delete{" "}
          <span style={{ fontWeight: "bold" }}>{title}</span>?
        </p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleDelete} color='error'>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmDeleteDialog
