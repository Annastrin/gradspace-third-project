import React from "react"
import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import AddCircleIcon from "@mui/icons-material/AddCircle"
import CancelIcon from "@mui/icons-material/Cancel"
import FileDownloadIcon from "@mui/icons-material/FileDownload"
import FileUploadIcon from "@mui/icons-material/FileUpload"

interface TableActionsProps {
  isAddingNewProduct: boolean
  cancelAddingNewProduct: () => void
  isLoggedIn: boolean
  openSignInDialog: () => void
  handleAddNewProductRow: () => void
}

const TableActions = React.memo(
  ({
    isAddingNewProduct,
    cancelAddingNewProduct,
    isLoggedIn,
    openSignInDialog,
    handleAddNewProductRow: handleAddNewProduct,
  }: TableActionsProps) => {
    const handleAddNewProductClick = () => {
      isLoggedIn ? handleAddNewProduct() : openSignInDialog()
    }
    return (
      <Box aria-label='products table actions' mb={3}>
        {isAddingNewProduct ? (
          <IconButton
            sx={{ marginRight: "7px" }}
            onClick={cancelAddingNewProduct}>
            <CancelIcon color='primary' sx={{ fontSize: "2.2rem" }} />
          </IconButton>
        ) : (
          <IconButton
            sx={{ marginRight: "7px" }}
            onClick={handleAddNewProductClick}>
            <AddCircleIcon color='primary' sx={{ fontSize: "2.2rem" }} />
          </IconButton>
        )}
        <IconButton sx={{ marginX: "7px" }}>
          <FileDownloadIcon color='primary' sx={{ fontSize: "2.2rem" }} />
        </IconButton>
        <IconButton sx={{ marginLeft: "7px" }}>
          <FileUploadIcon color='primary' sx={{ fontSize: "2.2rem" }} />
        </IconButton>
      </Box>
    )
  }
)

export default TableActions