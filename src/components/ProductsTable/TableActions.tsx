import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import AddCircleIcon from "@mui/icons-material/AddCircle"
import FileDownloadIcon from "@mui/icons-material/FileDownload"
import FileUploadIcon from "@mui/icons-material/FileUpload"

const TableActions = () => {
  return (
    <Box aria-label='products table actions' mb={3}>
      <IconButton sx={{ marginRight: "7px" }}>
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
