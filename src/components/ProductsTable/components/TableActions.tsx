import React from "react"
import { read, utils, writeFileXLSX } from "xlsx"
import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import AddCircleIcon from "@mui/icons-material/AddCircle"
import CancelIcon from "@mui/icons-material/Cancel"
import FileDownloadIcon from "@mui/icons-material/FileDownload"
import FileUploadIcon from "@mui/icons-material/FileUpload"
import type { Product, Products } from "../tableTypes"

interface TableActionsProps {
  isAddingNewProduct: boolean
  cancelAddingNewProduct: () => void
  isLoggedIn: boolean
  openSignInDialog: () => void
  handleAddNewProductRow: () => void
  products: Products
}

const TableActions = React.memo(
  ({
    isAddingNewProduct,
    cancelAddingNewProduct,
    isLoggedIn,
    openSignInDialog,
    handleAddNewProductRow: handleAddNewProduct,
    products,
  }: TableActionsProps) => {
    const handleAddNewProductClick = () => {
      isLoggedIn ? handleAddNewProduct() : openSignInDialog()
    }
    const handleExportExcel = () => {
      const productsExportData = Object.values(products)
      exportFile({ data: productsExportData, fileName: "Products" })
      console.log("export", { productsExportData })
    }
    return (
      <Box aria-label='products table actions' mb={3}>
        {isAddingNewProduct ? (
          <IconButton
            sx={{ marginRight: "7px" }}
            onClick={cancelAddingNewProduct}
            aria-label='cancel adding a new product'>
            <CancelIcon color='primary' sx={{ fontSize: "2.2rem" }} />
          </IconButton>
        ) : (
          <IconButton
            sx={{ marginRight: "7px" }}
            onClick={handleAddNewProductClick}
            aria-label='add a new product'>
            <AddCircleIcon color='primary' sx={{ fontSize: "2.2rem" }} />
          </IconButton>
        )}
        <IconButton sx={{ marginX: "7px" }} aria-label='Import excel table'>
          <FileDownloadIcon color='primary' sx={{ fontSize: "2.2rem" }} />
        </IconButton>
        <IconButton
          sx={{ marginLeft: "7px" }}
          aria-label='Export excel table'
          onClick={handleExportExcel}>
          <FileUploadIcon color='primary' sx={{ fontSize: "2.2rem" }} />
        </IconButton>
      </Box>
    )
  }
)

interface ExportExcelProps {
  data: Product[]
  fileName: string
}

const exportFile = ({ data, fileName }: ExportExcelProps) => {
  const ws = utils.json_to_sheet(data)
  const wb = utils.book_new()
  utils.book_append_sheet(wb, ws, "Data")
  writeFileXLSX(wb, `${fileName}.xlsx`)
}

export default TableActions
