import React, { useState, useRef, useEffect } from 'react'
import { Form } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useDispatch, useSelector } from 'react-redux'
import { useSnackbar } from 'react-notistack'
import { Helmet } from 'react-helmet'

/* Components */
import TitleHeader from '../../Components/TitleHeader'

// Validation-Schema
import { validationChangePasswordSchema } from '../../Shared/ValidationSchemes/validation'

// Action-File
import { changePasswordAction } from '../../Actions/auth'

function ChangePassword () {
  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const token = localStorage.getItem('token')

  // useState
  const [type, setType] = useState('password')
  const [isShowPassword, setShowPassword] = useState(false)

  // useSelector
  const resMessageFlag = useSelector((state) => state.auth.resMessage)
  const isChanged = useSelector((state) => state.auth.isPasswordChanged)
  const previousProps = useRef({ isChanged, resMessageFlag }).current

  // useForm
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(validationChangePasswordSchema)
  })
  const { onChange, name } = register('password', 'cPassword')
  // Submit Method
  const onSubmit = (data) => {
    const userData = {
      currentPassword: data.currentPassword,
      confirmPassword: data.cPassword,
      password: data.password
    }
    if (userData) {
      dispatch(changePasswordAction(userData, token))
    }
    reset()
  }

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

  // Toastify Notification
  useEffect(() => {
    if (previousProps?.isChanged !== isChanged) {
      if (isChanged === true) {
        enqueueSnackbar(`${resMessageFlag}`, {
          variant: 'success',
          autoHide: true,
          hide: 3000
        })
      } else if (isChanged === false) {
        enqueueSnackbar(`${resMessageFlag}`, {
          variant: 'error',
          autoHide: true,
          hide: 3000
        })
      }
    }
    return () => {
      previousProps.isChanged = isChanged
    }
  }, [isChanged])
  return (
    <>
        <Helmet>
          <meta charSet='utf-8' />
          <title>Settings - Ollato</title>
        </Helmet>
        <div className=''>
          {/* <Header /> */}
          <TitleHeader name='Settings' />
          <div className='main-layout whitebox-layout'>
            <Form className='light-bg' onSubmit={handleSubmit(onSubmit)}>
              <div className='heading-box'>
                <h5 className='mr-1'>Change Password</h5>
                <div className='btn-box'>
                  <button className='theme-btn text-none' type='submit'>
                    Save New Password
                  </button>
                </div>
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
                        <Form.Text className='error-msg'></Form.Text>
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
                        className={`form-group ${
                          errors.password?.message ? 'error-occured' : ''
                        }`}
                        controlId='formnewPassword'
                      >
                        <Form.Label>New Password</Form.Label>
                        <div className='password-box no-eye'>
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
                          className={`show-hide-pass ${isShowPassword ? 'show-pass' : ''}`}
                          onClick={handleShowHidePassword}
                        ></span>
                        </div>
                      </Form.Group>
                    </div>
                  </div>
                  <span
                      className={`show-hide-pass ${
                        isShowPassword ? 'show-pass' : ''
                      }`}
                      onClick={handleShowHidePassword}
                    ></span>
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
                          {errors.cPassword?.message && (
                            <Form.Text className='error-msg'>
                              {errors.cPassword?.message}{' '}
                            </Form.Text>
                          )}
                        </div>
                      </Form.Group>
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          </div>
        </div>
    </>
  )
}

export default ChangePassword
