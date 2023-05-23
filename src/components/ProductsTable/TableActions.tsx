import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import AddCircleIcon from "@mui/icons-material/AddCircle"
import FileDownloadIcon from "@mui/icons-material/FileDownload"
import FileUploadIcon from "@mui/icons-material/FileUpload"

interface TableActionsProps {
  isLoggedIn: boolean
  handleSignIn: () => void
  handleAddNewProduct: () => void
}

const TableActions = ({
  isLoggedIn,
  handleSignIn,
  handleAddNewProduct,
}: TableActionsProps) => {
  const handleAddNewProductClick = () => {
    isLoggedIn ? handleAddNewProduct() : handleSignIn()
  }
  return (
    <Box aria-label='products table actions' mb={3}>
      <IconButton
        sx={{ marginRight: "7px" }}
        onClick={handleAddNewProductClick}>
        <AddCircleIcon color='primary' sx={{ fontSize: "2.2rem" }} />
      </IconButton>
      <IconButton sx={{ marginX: "7px" }}>
        <FileDownloadIcon color='primary' sx={{ fontSize: "2.2rem" }} />
      </IconButton>
      <IconButton sx={{ marginLeft: "7px" }}>
        <FileUploadIcon color='primary' sx={{ fontSize: "2.2rem" }} />
      </IconButton>
    </Box>
  )
}

export default TableActions
