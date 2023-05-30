import React from "react"
import { read, utils, writeFileXLSX } from "xlsx"
import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import Tooltip from "@mui/material/Tooltip"
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
  addProductToProducts: (product: Product) => void
}

const TableActions = React.memo(
  ({
    isAddingNewProduct,
    cancelAddingNewProduct,
    isLoggedIn,
    openSignInDialog,
    handleAddNewProductRow: handleAddNewProduct,
    products,
    addProductToProducts,
  }: TableActionsProps) => {
    const handleAddNewProductClick = () => {
      isLoggedIn ? handleAddNewProduct() : openSignInDialog()
    }

    const importFile = async (file: File) => {
      const f = await file.arrayBuffer()
      const wb = read(f) // parse the array buffer
      const ws = wb.Sheets[wb.SheetNames[0]] // get the first worksheet
      const data = utils.sheet_to_json(ws) // generate objects
      data.forEach((entry) => addProductToProducts(entry as Product))
    }

    const exportFile = ({ data, fileName }: ExportExcelProps) => {
      const ws = utils.json_to_sheet(data)
      const wb = utils.book_new()
      utils.book_append_sheet(wb, ws, "Data")
      writeFileXLSX(wb, `${fileName}.xlsx`)
    }

    const handleExportExcel = () => {
      const productsExportData = Object.values(products)
      exportFile({ data: productsExportData, fileName: "Products" })
    }

    return (
      <Box
        aria-label='products table actions'
        mb={3}
        sx={{ display: "flex", alignItems: "center" }}>
        {isAddingNewProduct ? (
          <Tooltip title='Cancel adding'>
            <IconButton
              sx={{ marginRight: "7px" }}
              onClick={cancelAddingNewProduct}
              aria-label='cancel adding a new product'>
              <CancelIcon color='primary' sx={{ fontSize: "2.2rem" }} />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title='Add new product'>
            <IconButton
              sx={{ marginRight: "7px" }}
              onClick={handleAddNewProductClick}
              aria-label='add a new product'>
              <AddCircleIcon color='primary' sx={{ fontSize: "2.2rem" }} />
            </IconButton>
          </Tooltip>
        )}

        <label htmlFor='importExcelFile'>
          <input
            type='file'
            accept='.xlsx'
            id='importExcelFile'
            name='importExcelFile'
            style={{ display: "none" }}
            value=''
            onChange={(event) => {
              if (event.target.files) {
                const addedFile = event.target.files[0]
                console.log(addedFile)
                importFile(addedFile)
              }
            }}
          />
          <Tooltip title='Import Excel table'>
            <IconButton
              component='span'
              sx={{ marginX: "7px" }}
              aria-label='Import excel table'
              onClick={(event) => event.stopPropagation()}>
              <FileDownloadIcon color='primary' sx={{ fontSize: "2.2rem" }} />
            </IconButton>
          </Tooltip>
        </label>

        <Tooltip title='Export to Excel table'>
          <IconButton
            sx={{ marginLeft: "7px" }}
            aria-label='Export excel table'
            onClick={handleExportExcel}>
            <FileUploadIcon color='primary' sx={{ fontSize: "2.2rem" }} />
          </IconButton>
        </Tooltip>
      </Box>
    )
  }
)

interface ExportExcelProps {
  data: Product[]
  fileName: string
}

export default TableActions
