import { useForm, Controller, SubmitHandler } from "react-hook-form"
import TableRow from "@mui/material/TableRow"
import TableCell from "@mui/material/TableCell"
import TextField from "@mui/material/TextField"
import Input from "@mui/material/Input"
import InputLabel from "@mui/material/InputLabel"
import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import Button from "@mui/material/Button"
import DoneIcon from "@mui/icons-material/Done"
import ClearIcon from "@mui/icons-material/Clear"
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto"

interface NewProductRowProps {
  cancel: () => void
}

const NewProductRow = ({ cancel }: NewProductRowProps) => {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      productName: "",
      productDescription: "",
      productPrice: "",
      productImage: "",
    },
  })

  const onSubmit: SubmitHandler<FormInput> = (data) => {
    console.log(data)
  }
  return (
    <TableRow>
      <TableCell scope='row' align='center'>
        <Controller
          name='productName'
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              variant='outlined'
              sx={{ maxWidth: "150px" }}
            />
          )}
        />
      </TableCell>
      <TableCell align='center'>
        <Controller
          name='productDescription'
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              variant='outlined'
              sx={{ maxWidth: "150px" }}
            />
          )}
        />
      </TableCell>
      <TableCell align='center'>
        <Controller
          name='productPrice'
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              variant='outlined'
              sx={{ maxWidth: "150px" }}
            />
          )}
        />
      </TableCell>
      <TableCell align='center'>
        <Box>
          <Controller
            name='productImage'
            control={control}
            render={({ field }) => (
              <InputLabel htmlFor='uploadPicture'>
                <Input
                  onChange={(e) => console.log(e.target)}
                  type='file'
                  id='uploadPicture'
                  name='uploadPicture'
                  sx={{ display: "none" }}
                />
                <Button component='span'>
                  <AddAPhotoIcon color='primary' />
                </Button>
              </InputLabel>
            )}
          />
        </Box>
      </TableCell>
      <TableCell align='center'>
        <Box aria-label='add new product'>
          <IconButton sx={{ marginX: "7px" }} onClick={handleSubmit(onSubmit)}>
            <DoneIcon color='primary' />
          </IconButton>
          <IconButton sx={{ marginX: "7px" }} onClick={cancel}>
            <ClearIcon color='primary' />
          </IconButton>
        </Box>
      </TableCell>
    </TableRow>
  )
}

interface FormInput {
  productName: string
  productDescription: string
  productPrice: string
  productImage: string
}

export default NewProductRow
