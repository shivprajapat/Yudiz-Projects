import React, { useState } from 'react'
import { Alert, Box, Button, FormControl, Grid, IconButton, InputAdornment, OutlinedInput, Stack } from '@mui/material'
import loginIcon from 'Assets/login.jpg'
import LoginIcon from '@mui/icons-material/Login'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { useNavigate } from 'react-router-dom'
import { route } from 'Constants/AllRoutes'
import { useDispatch } from 'react-redux'
import { setLoginStatus } from 'Redux/Actions/AuthAction'

const isEmail = (email) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)
const isPassword = (password) => /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?+!@$%^&*-]).{8,15}$/i.test(password)

function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  //Inputs
  const [emailInput, setEmailInput] = useState()
  const [passwordInput, setPasswordInput] = useState()

  // Inputs Errors
  const [emailError, setEmailError] = useState(false)
  const [passwordError, setPasswordError] = useState(false)

  // Validity
  const [formValid, setFormValid] = useState()
  const [success, setSuccess] = useState()
  const [showPassword, setShowPassword] = useState(false)

  //  Display and Hide Password
  const handleClickShowPassword = () => setShowPassword((show) => !show)
  const handleMouseDownPassword = (event) => {
    event.preventDefault()
  }

  // Validation for Email
  const handleEmail = () => {
    if (!isEmail(emailInput)) {
      setEmailError(true)
      return
    }
    setEmailError(false)
  }

  // Validation for Password
  const handlePassword = () => {
    if (!isPassword(passwordInput)) {
      setPasswordError(true)
      return
    }
    setPasswordError(false)
  }

  //handle Submission
  const handleSubmit = (e) => {
    setSuccess(null)
    if (!emailInput && !passwordInput) {
      setEmailError(true)
      setPasswordError(true)
      setFormValid('Fields are required.')
      return
    }

    if (!emailInput) {
      setEmailError(true)
      setFormValid('Email is required.')
      return
    }

    if (!passwordInput) {
      setPasswordError(true)
      setFormValid('Password is required.')
      return
    }

    if (emailError || !emailInput) {
      setFormValid('Email is Invalid. Please Re-Enter')
      setEmailError(true)
      return
    }
    // If Password error is true
    if (passwordError || !passwordInput) {
      setFormValid('Password must contain No Space, 1 number, uppercase, lowercase, and special character.')
      setPasswordError(true)
      return
    }
    setFormValid(null)

    setSuccess('login Successfully')
    dispatch(setLoginStatus(true))
    localStorage.setItem('isUserLoggedIn', true)

    navigate(route.audit)
  }

  return (
    <div className='flex justify-center items-center min-h-screen bg-[#363E58]'>
      <Box className='bg-lightBlue w-full  md:max-w-[800px] p-10 m-40 lg:max-w-[1000px] xl:max-w-[1200px]'>
        <Grid container spacing={4} className='cursor-pointer'>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <div className='flex justify-center items-center my-10 md:my-[15vh]'>
              <img src={loginIcon} alt='' className='h-[400px] w-[400px] md:h-[500px] md:w-[500px]' />
            </div>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <div className='p-10'>
              <div className='text-white text-3xl mt-10 md:mt-20'>LOGIN HERE </div>
              <div className='mt-10'>
                <div>
                  <FormControl sx={{ width: '100%' }} variant='standard'>
                    <label className='text-white '>Email Address</label>
                    <OutlinedInput
                      fullWidth
                      className='bg-white mt-4 text-2xl'
                      error={emailError}
                      id='outlined-adornment'
                      sx={{ width: '100%' }}
                      value={emailInput}
                      InputProps={{}}
                      size='small'
                      onBlur={handleEmail}
                      onChange={(event) => {
                        setEmailInput(event.target.value)
                      }}
                    />
                  </FormControl>
                </div>
                <div className='mt-10'>
                  <FormControl sx={{ width: '100%' }} variant='standard'>
                    <label className='text-white '>Password</label>
                    <OutlinedInput
                      error={passwordError}
                      onBlur={handlePassword}
                      className='bg-white mt-4 text-xl'
                      id='outlined-adornment'
                      type={showPassword ? 'text' : 'password'}
                      size='small'
                      onChange={(event) => {
                        setPasswordInput(event.target.value)
                      }}
                      value={passwordInput}
                      endAdornment={
                        <InputAdornment position='end'>
                          <IconButton
                            aria-label='toggle password visibility'
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                </div>
                <div className='mt-10'>
                  <Button
                    variant='contained'
                    style={{ backgroundColor: 'black' }}
                    fullWidth
                    startIcon={<LoginIcon />}
                    onClick={handleSubmit}
                  >
                    LOGIN
                  </Button>
                </div>

                {formValid && (
                  <Stack className='w-[100%] mt-6' spacing={2}>
                    <Alert severity='error' size='small'>
                      {formValid}
                    </Alert>
                  </Stack>
                )}
                {success && (
                  <Stack className='w-[100%] mt-6' spacing={2}>
                    <Alert severity='success' size='small'>
                      {success}
                    </Alert>
                  </Stack>
                )}
              </div>
            </div>
          </Grid>
        </Grid>
      </Box>
    </div>
  )
}

export default Login