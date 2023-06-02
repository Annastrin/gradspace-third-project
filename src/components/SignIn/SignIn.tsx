import React, { useState } from "react"
import axios from "axios"
import { useForm, Controller, SubmitHandler } from "react-hook-form"
import Paper from "@mui/material/Paper"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import Alert from "@mui/material/Alert"
import LockIcon from "@mui/icons-material/Lock"
import { AuthContext, AuthContextType } from "../../hooks/useAuth"
import { apiLogin } from "../../api/service"

interface FormInput {
  email: string
  password: string
}

const SignIn = () => {
  const [showLoginErrors, setShowLoginErrors] = useState<string | null>(null)
  const { login } = React.useContext(AuthContext) as AuthContextType

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

  const signIn = (email: string, password: string) => {
    apiLogin("login", { email, password })
      .then((res) => {
        const token = res.data.token.token
        const userEmail = res.data.user.email
        login({ token, userEmail })
      })
      .catch((err) => {
        if (axios.isAxiosError(err)) {
          console.log(err)
          setShowLoginErrors(err.message)
        } else {
          console.log("An unexpected error occurred on logging in")
        }
      })
  }

  const onSubmit: SubmitHandler<FormInput> = (data) => {
    if (data.email && data.password) {
      signIn(data.email, data.password)
      reset()
    }
  }

  return (
    <Paper
      elevation={2}
      sx={{ maxWidth: "900px", padding: "40px 30px", textAlign: "center" }}>
      {showLoginErrors && (
        <Alert severity='error' onClose={() => setShowLoginErrors(null)}>
          {`There is a problem with logging in - ${showLoginErrors}`}
        </Alert>
      )}
      <Box
        sx={{
          backgroundColor: "#4caf50",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          marginX: "auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}>
        <LockIcon sx={{ color: "#fff" }} fontSize='large' />
      </Box>
      <h2>Sign In</h2>

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

      <Button
        onClick={handleSubmit(onSubmit)}
        variant='contained'
        type='submit'
        sx={{ marginTop: "30px" }}>
        Sign In
      </Button>
    </Paper>
  )
}

export default SignIn
