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
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      productName: "",
      productDescription: "",
      productPrice: "",
      productImage: "",
    },
    mode: "onChange",
  })
  console.log(errors)

  const onSubmit: SubmitHandler<FormInput> = (data) => {
    console.log(data)
  }
  return (
    <TableRow>
      <TableCell scope='row' align='center'>
        <Controller
          name='productName'
          control={control}
          rules={{
            validate: {
              required: (v) => v.length > 0 || "Title is required",
            },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              variant='outlined'
              placeholder='Blanket'
              sx={{ maxWidth: "150px", marginTop: "20px" }}
              error={errors.productName?.message ? true : undefined}
              helperText={
                errors.productName?.message ? errors.productName?.message : " "
              }
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
              placeholder='Soft and warm'
              sx={{ maxWidth: "150px", marginTop: "20px" }}
              helperText=' '
            />
          )}
        />
      </TableCell>
      <TableCell align='center'>
        <Controller
          name='productPrice'
          control={control}
          rules={{
            validate: {
              numeric: (v) => !isNaN(parseFloat(v)) || "Enter numbers",
            },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              variant='outlined'
              placeholder='999.99'
              sx={{ maxWidth: "150px", marginTop: "20px" }}
              error={errors.productPrice?.message ? true : undefined}
              helperText={
                errors.productPrice?.message
                  ? errors.productPrice?.message
                  : " "
              }
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
