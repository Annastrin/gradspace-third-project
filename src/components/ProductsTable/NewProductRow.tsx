import { useState } from "react"
import {
  useForm,
  Controller,
  SubmitHandler,
  FieldValues,
} from "react-hook-form"
import TableRow from "@mui/material/TableRow"
import TableCell from "@mui/material/TableCell"
import TextField from "@mui/material/TextField"
import InputLabel from "@mui/material/InputLabel"
import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import Button from "@mui/material/Button"
import DoneIcon from "@mui/icons-material/Done"
import ClearIcon from "@mui/icons-material/Clear"
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto"
import type { NewProduct } from "../../types"

interface NewProductRowProps {
  submit: ({ title, description, price, image }: NewProduct) => void
}

const NewProductRow = ({ submit }: NewProductRowProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onChange",
  })

  const onSubmit: SubmitHandler<FormInput> & SubmitHandler<FieldValues> = (
    data
  ) => {
    const file = data.productImage ? data.productImage[0] : null
    console.log(data, file, imagePreview)
    const newProduct = {
      title: data.productName,
      price: parseFloat(data.productPrice).toFixed(2),
      description: data.productDescription,
      image: data.productImage,
    }
    submit(newProduct)
    reset()
    setImagePreview(null)
  }

  const getImagePreviewUrl = (file: File | null) => {
    if (file) {
      const previewUrl = window.URL.createObjectURL(file)
      console.log(file, previewUrl)
      setImagePreview(previewUrl)
    } else {
      setImagePreview(null)
    }
  }
  return (
    <TableRow>
      <TableCell scope='row' align='center'>
        <Controller
          name='productName'
          control={control}
          defaultValue=''
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
                errors.productName?.message
                  ? (errors.productName?.message as React.ReactNode)
                  : " "
              }
            />
          )}
        />
      </TableCell>
      <TableCell align='center'>
        <Controller
          name='productDescription'
          control={control}
          defaultValue=''
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
          defaultValue=''
          rules={{
            validate: {
              numeric: (v) =>
                (!isNaN(parseFloat(v)) && parseFloat(v) > 0) ||
                "Enter valid price",
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
                  ? (errors.productPrice?.message as React.ReactNode)
                  : " "
              }
            />
          )}
        />
      </TableCell>
      <TableCell align='center'>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}>
          {imagePreview && <img src={imagePreview} width={50} />}
          <Controller
            name='productImage'
            control={control}
            defaultValue={null}
            render={({ field: { value, onChange, ...field } }) => (
              <InputLabel htmlFor='uploadPicture'>
                <input
                  {...field}
                  type='file'
                  accept='image/*'
                  id='uploadPicture'
                  name='uploadPicture'
                  style={{ display: "none" }}
                  onChange={(event) => {
                    if (event.target.files) {
                      const addedImage = event.target.files[0]
                      onChange(addedImage)
                      getImagePreviewUrl(addedImage)
                    } else {
                      onChange(null)
                      getImagePreviewUrl(null)
                    }
                  }}
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
            <DoneIcon color='primary' fontSize='large' />
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
  productImage: FileList
}

export default NewProductRow
