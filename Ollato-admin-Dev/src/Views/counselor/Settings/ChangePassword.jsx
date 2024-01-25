import React, { useState, useRef, useEffect } from 'react'
import { Form } from 'react-bootstrap'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useSnackbar } from 'react-notistack'

// Actions
import { counsellorChangePasswordAction } from '../../../Actions/Counsellor/dashboard'

// Regex for password
const passRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

// Validations Schema
const validationSchema = yup.object().shape({
  currentPassword: yup.string().required('Please Enter Current Password'),
  password: yup
    .string()
    .required('Password is required')
    .matches(
      passRegex,
      'Password must contain at least eight characters, at least one number and both lower and uppercase letters and special characters'
    ),
  cPassword: yup
    .string()
    .required('Confirm Password is required')
    .oneOf(
      [yup.ref('password'), null],
      'Password and Confirm password must be same '
    )
})

const ChangePassword = () => {
  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const token = localStorage.getItem('token')

  // useState
  const [isShowPassword, setShowPassword] = useState(false)
  const [type, setType] = useState('password')
  // useForm
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema)
  })
  const { name, onChange } = register('password', 'cPassword')
  // useSelector
  const isPasswordChangedFlag = useSelector(state => state.dashboard.isPasswordChanged)
  const resMessageFlag = useSelector(state => state.dashboard.resMessage)
  const previousProps = useRef({ isPasswordChangedFlag, resMessageFlag }).current
  const onSubmit = (data) => {
    const dataObject = {
      currentPassword: data?.currentPassword,
      confirmPassword: data?.cPassword,
      password: data?.password
    }
    if (dataObject) {
      dispatch(counsellorChangePasswordAction(dataObject, token))
    }
  }

  // Toastify Notification
  useEffect(() => {
    if (previousProps?.isPasswordChangedFlag !== isPasswordChangedFlag) {
      if (isPasswordChangedFlag === true) {
        enqueueSnackbar(`${resMessageFlag}`, {
          variant: 'success',
          autoHide: true,
          hide: 3000
        })
        reset()
      } else if (isPasswordChangedFlag === false) {
        enqueueSnackbar(`${resMessageFlag}`, {
          variant: 'error',
          autoHide: true,
          hide: 3000
        })
      }
    }
    return () => {
      previousProps.isPasswordChangedFlag = isPasswordChangedFlag
    }
  }, [isPasswordChangedFlag])

  // Handle method show/hide password
  const handleShowHidePassword = () => {
    if (type === 'password') {
      setType('text')
      setShowPassword(true)
    } else {
      setType('password')
      setShowPassword(false)
    }
  }

  return (
    <>
      <Form className='light-bg' onSubmit={handleSubmit(onSubmit)}>
       <div className="change-pass-btn">
       <button className='theme-btn text-none' type='submit'>
          Save New Password
        </button>
       </div>
        <div className='row'>
          <div className='col-md-12'>
            <div className='row'>
              <div className='col-xl-6 col-lg-8 col-md-10'>
                <Form.Group
                  className={`form-group ${
                    errors.currentPassword?.message ? 'error-occured' : ''
                  }`}
                  controlId='formnewPassword'
                >
                  <Form.Label>Current Password</Form.Label>
                  <div className='password-box no-eye'>
                    <Form.Control
                      type='password'
                      placeholder='Enter Current Password'
                      {...register('currentPassword', { required: true })}
                    />
                  </div>
                  {errors.currentPassword?.message && (
                    <Form.Text className='error-msg'>
                      {errors.currentPassword?.message}{' '}
                    </Form.Text>
                  )}
                </Form.Group>
              </div>
            </div>
          </div>
          <div className='col-md-12'>
            <div className='row'>
              <div className='col-xl-6 col-lg-8 col-md-10'>
                <Form.Group
                  className={`form-group password-box no-eye ${
                    errors.password?.message ? 'error-occured' : ''
                  }`}
                  controlId='formnewPassword'
                >
                  <Form.Label>New Password</Form.Label>
                  <div className="password-box">
                  <Form.Control
                    type={type}
                    placeholder='Enter New Password'
                    name={name}
                    onChange={(e) => {
                      onChange(e)
                    }}
                    {...register('password', { required: true })}
                  />
                  {errors.password?.message && (
                    <Form.Text className='error-msg'>
                      {errors.password?.message}{' '}
                    </Form.Text>
                  )}
                  <span
                    className={`show-hide-pass ${
                      isShowPassword ? 'show-pass' : ''
                    }`}
                    onClick={handleShowHidePassword}
                  ></span>
                  </div>
                </Form.Group>
              </div>
            </div>
          </div>
          <div className='col-md-12'>
            <div className='row'>
              <div className='col-xl-6 col-lg-8 col-md-10'>
                <Form.Group
                  className={`form-group ${
                    errors.cPassword?.message ? 'error-occured' : ''
                  }`}
                  controlId='formconfirmPassword'
                >
                  <Form.Label>Confirm Passwod</Form.Label>
                  <div className='password-box no-eye'>
                    <Form.Control
                      type='password'
                      placeholder='Re-enter New Password'
                      name={name}
                      onChange={(e) => {
                        onChange(e)
                      }}
                      {...register('cPassword', { required: true })}
                    />
                  </div>
                  {errors.cPassword?.message && (
                    <Form.Text className='error-msg'>
                      {errors.cPassword?.message}{' '}
                    </Form.Text>
                  )}
                </Form.Group>
              </div>
            </div>
          </div>
        </div>
      </Form>
    </>
  )
}

export default ChangePassword
