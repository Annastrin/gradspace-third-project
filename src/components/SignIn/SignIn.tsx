import { useForm, Controller, SubmitHandler } from "react-hook-form"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import Alert from "@mui/material/Alert"

interface SignInProps {
  open: boolean
  handleClose: () => void
  signIn: (email: string, password: string) => void
  loginErrors: string | null
  closeErrorsAlert: () => void
}

interface FormInput {
  email: string
  password: string
}

const SignIn = ({
  open,
  handleClose,
  signIn,
  loginErrors,
  closeErrorsAlert,
}: SignInProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit: SubmitHandler<FormInput> = (data) => {
    if (data.email && data.password) {
      signIn(data.email, data.password)
      reset()
    }
  }

  const closeAndReset = () => {
    handleClose()
    reset()
  }

  return (
    <Dialog open={open} onClose={closeAndReset}>
      {loginErrors && (
        <Alert severity='error' onClose={() => closeErrorsAlert()}>
          {`There is a problem with logging in - ${loginErrors}`}
        </Alert>
      )}
      <DialogTitle>Sign In</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please sign in to add, edit, or delete the products.
        </DialogContentText>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name='email'
            control={control}
            rules={{
              validate: {
                isRequired: (v) => v.length > 0 || "Email is required",
                matchPattern: (v) =>
                  /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
                  "Email address must be a valid address",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                autoFocus
                margin='dense'
                id='email'
                label='Email'
                type='email'
                fullWidth
                variant='standard'
                error={errors.email?.message ? true : undefined}
                helperText={errors.email?.message}
              />
            )}
          />
          <Controller
            name='password'
            control={control}
            rules={{
              validate: {
                isRequired: (v) => v.length > 0 || "Password is required",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                margin='dense'
                id='password'
                label='Password'
                type='password'
                fullWidth
                variant='standard'
                error={errors.password?.message ? true : undefined}
                helperText={errors.password?.message}
              />
            )}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          variant='contained'
          type='submit'>
          Sign In
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default SignIn
