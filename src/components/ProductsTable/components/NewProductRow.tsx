import { useEffect, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import type { SubmitHandler, FieldValues } from "react-hook-form"
import TableRow from "@mui/material/TableRow"
import TableCell from "@mui/material/TableCell"
import TextField from "@mui/material/TextField"
import InputLabel from "@mui/material/InputLabel"
import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import DoneIcon from "@mui/icons-material/Done"
import ClearIcon from "@mui/icons-material/Clear"
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto"
import type {
  AddOrEditProductProps,
  EditedProductInitialValues,
  NewProduct,
  ProductAction,
} from "../../../types"
import { BaseStorageUrl } from "../../../environment"

interface NewProductRowProps {
  editMode?: boolean
  initialValues?: EditedProductInitialValues
  submitAddOrEdit: ({ action, product }: AddOrEditProductProps) => void
  cancelAddOrEditProduct: (action: ProductAction) => void
}

const NewProductRow = ({
  submitAddOrEdit,
  cancelAddOrEditProduct,
  editMode = false,
  initialValues,
}: NewProductRowProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    mode: "onChange",
  })

  useEffect(() => {
    if (editMode && initialValues) {
      setValue("productName", initialValues.title)
      setValue("productDescription", initialValues.description)
      setValue("productPrice", initialValues.price)
      setValue("productImage", initialValues.image)
      initialValues.image &&
        setImagePreview(`${BaseStorageUrl}${initialValues.image}`)
    } else {
      reset()
      setImagePreview(null)
    }
  }, [editMode, initialValues, reset, setValue])

  const onSubmit: SubmitHandler<FormInput> & SubmitHandler<FieldValues> = (
    data
  ) => {
    if (editMode) {
      const newProduct: Partial<NewProduct> = {}
      if (data.productName !== initialValues?.title) {
        newProduct.title = data.productName
      }
      if (data.productDescription !== initialValues?.description) {
        newProduct.description = data.productDescription
      }
      if (data.productPrice !== initialValues?.price) {
        newProduct.price = data.productPrice
      }
      if (data.productImage !== initialValues?.image) {
        newProduct.image = data.productImage
      }
      newProduct.id = initialValues?.id
      submitAddOrEdit({ action: "edit", product: newProduct })
      cancelAddOrEditProduct("edit")
    } else {
      const newProduct: NewProduct = {
        title: data.productName,
        price: parseFloat(data.productPrice).toFixed(2),
        description: data.productDescription,
        image: data.productImage,
      }
      submitAddOrEdit({ action: "add", product: newProduct })
      reset()
      setImagePreview(null)
    }
  }

  const onCancel = () => {
    if (editMode) {
      cancelAddOrEditProduct("edit")
    } else {
      cancelAddOrEditProduct("add")
      reset()
    }
  }

  const getImagePreviewUrl = (file: File | null) => {
    if (file) {
      const previewUrl = window.URL.createObjectURL(file)
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
                /^\d+(?:\.\d{1,2})?$/.test(v) || "Enter valid price",
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
              <InputLabel htmlFor={`uploadPicture-${initialValues?.id}`}>
                <input
                  {...field}
                  type='file'
                  accept='image/*'
                  id={`uploadPicture-${initialValues?.id}`}
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
                <IconButton component='span' sx={{ marginX: "10px" }}>
                  <AddAPhotoIcon color='primary' />
                </IconButton>
              </InputLabel>
            )}
          />
        </Box>
      </TableCell>
      <TableCell align='center'>
        <Box aria-label='add new product'>
          <IconButton
            sx={{
              marginX: "7px",
              opacity: Object.keys(errors).length > 0 ? "0.5" : "1",
            }}
            onClick={handleSubmit(onSubmit)}
            disabled={Object.keys(errors).length > 0 ? true : false}>
            <DoneIcon color='primary' fontSize='large' />
          </IconButton>
          <IconButton sx={{ marginX: "7px" }} onClick={onCancel}>
            <ClearIcon color='primary' fontSize='large' />
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
