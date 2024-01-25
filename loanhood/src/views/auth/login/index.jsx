import React, { useEffect, useState } from 'react'
import { Button, makeStyles, TextField, Typography } from '@material-ui/core'
import CircularProgress from '@material-ui/core/CircularProgress'
import { verifyEmail } from 'utils/helper'
import { useDispatch, useSelector } from 'react-redux'
import { LoginUser } from 'state/actions/auth'
import { Controller, useForm } from 'react-hook-form'
const OpenSnackbar = React.lazy(() => import('components/Snackbar'))

function Login() {
  const { register, handleSubmit, control } = useForm()
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const resStatus = useSelector((state) => state.auth.resStatus)
  const resMessage = useSelector((state) => state.auth.resMessage)

  const useStyles = makeStyles((theme) => ({
    btn: {
      marginTop: 15
    }
  }))
  const style = useStyles()

  useEffect(() => {
    resMessage && setLoading(false)
  }, [resStatus, resMessage])

  function onSubmit(e) {
    dispatch(LoginUser(e.emailId, e.password))
    setLoading(true)
  }

  return (
    <>
      {!resStatus && resMessage && <OpenSnackbar isOpen={true} message={resMessage} />}
      <Typography variant="h4" gutterBottom>
        Login to LoanHood
      </Typography>
      <Typography>Enter your details below.</Typography>
      <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="emailId"
          control={control}
          defaultValue=""
          rules={{ required: 'Email Address is required' }}
          render={({ fieldState: { error } }) => (
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="emailId"
              label="Email Address"
              name="emailId"
              autoFocus
              helperText={error ? error.message : null}
              error={!!error}
              {...register('emailId', {
                validate: (value) => verifyEmail(value) || 'Please enter valid email'
              })}
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          defaultValue=""
          rules={{ required: 'Password  is required' }}
          render={({ fieldState: { error } }) => (
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              helperText={error ? error.message : null}
              error={!!error}
              {...register('password', {
                minLength: {
                  value: 5,
                  message: 'Password must be at least 5 characters'
                }
              })}
            />
          )}
        />

        <Button
          className={style.btn}
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          size="large"
          disabled={loading}
          endIcon={loading && <CircularProgress color="inherit" size={20} />}
        >
          Login
        </Button>
      </form>
    </>
  )
}

export default Login
