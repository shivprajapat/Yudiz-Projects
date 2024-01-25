import React, { useRef, useEffect } from 'react'

/* NPM-Packages */
// import { Formik } from 'formik'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useSnackbar } from 'react-notistack'

/* React-bootstrap Components */
import { Button, Form, Spinner } from 'react-bootstrap'

/* Language Component */
import AuthLeftLogo from '../../../Components/AuthLeftLogo'
import BackArrow from '../../../Components/BackArrow'

/* Action File */
import { emailVerifiedAction, forgotPasswordEmailAction } from '../../../Actions/auth'

// Validation-Scheme for fields
const validationSchema = yup.object().shape({
  emailMob: yup.string()
    .required('E-Mail is required')
    .test('test-name', 'Enter Valid E-Mail',
      function (value) {
        const emailRegex = /.+@.+\.[A-Za-z]+$/
        const isValidEmail = emailRegex.test(value)
        if (!isValidEmail) {
          return false
        }
        return true
      })
})

function ForgotPassword () {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { enqueueSnackbar } = useSnackbar()
  // State Data
  const isSend = useSelector(state => state.auth.isEmailVerified)
  const isVerify = useSelector(state => state.auth.isAdminEmailVerified)
  const isAuthMessage = useSelector(state => state.auth.resMessage)
  const loading = useSelector(state => state.auth.loading)
  const previousProps = useRef({ isSend, isAuthMessage, isVerify }).current

  // UseForm Methods
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(validationSchema)
  })
  const { onChange, name } = register('emailMob')

  // Method to set url
  useEffect(() => {
    localStorage.setItem('url', location?.pathname)
  }, [])

  // Form onSubmit Method
  const onSubmit = data => {
    localStorage.setItem('EmailMobile', data.emailMob)
    let userData = ''
    // eslint-disable-next-line no-lone-blocks
    {
      location?.pathname === '/forgot-password'
        ? userData = {
          email_mobile: data.emailMob
        }
        : location?.pathname === '/center/forgot-password'
          ? userData = {
            emailMobile: data.emailMob
          }
          : userData = {
            email: data.emailMob
          }
    }

    if (userData) {
      // eslint-disable-next-line no-lone-blocks
      {
        location?.pathname === '/forgot-password'
          ? dispatch(emailVerifiedAction(userData))
          : location?.pathname === '/center/forgot-password'
            ? dispatch(forgotPasswordEmailAction(userData, 'center'))
            : dispatch(forgotPasswordEmailAction(userData, 'admin'))
      }
    }
  }

  // Toastify Notification
  useEffect(() => {
    if (previousProps?.isSend !== isSend) {
      if (isSend) {
        enqueueSnackbar(`${isAuthMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        navigate('/one-time-password')
        reset()
      } else if (isSend === false) {
        enqueueSnackbar(`${isAuthMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        }
        )
      }
    }
    return () => {
      previousProps.isSend = isSend
    }
  }, [isSend])

  useEffect(() => {
    if (previousProps?.isVerify !== isVerify) {
      if (isVerify) {
        enqueueSnackbar(`${isAuthMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        if (location?.pathname === '/center/forgot-password') {
          navigate('/center/one-time-password')
        } else {
          navigate('/admin/one-time-password')
        }
      } else if (isVerify === false) {
        enqueueSnackbar(`${isAuthMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        }
        )
      }
    }
    return () => {
      previousProps.isVerify = isVerify
    }
  }, [isVerify])

  // Custom HandleChange Function to handle initial values and set fields values
  const onHandleChange = (e, type) => {
    switch (type) {
      case 'emailMob':
        // setEmailMob(e.target.value)
        break
      default:
        break
    }
  }

  return (
    <>
     <div className="common-layout">
                <AuthLeftLogo />
                  <div className="form-box-section justify-content-center">
                  <div className="middle-form">
                    <BackArrow location={location} />
                    <div className="title-box has-subtitle">
                        <h2>Forget Password</h2>
                        <h4>Enter your email address and we&apos;ll send you a OTP to reset your password.</h4>
                      </div>
                      <Form onSubmit={handleSubmit(onSubmit)}>
                        <Form.Group
                              className={`form-group ${errors.emailMob?.message === 'required' ? 'error-occured' : ''}`}
                             controlId="formBasicEmail">
                          <Form.Label>Enter E-Mail </Form.Label>
                          <Form.Control
                              type="text"
                              name={name}
                              placeholder="Enter E-Mail "
                              onChange={(e) => {
                                onChange(e)
                                onHandleChange(e, 'emailMob')
                              }}
                              {...register('emailMob', { required: true })}
                          />
                          {/* {
                            touched.emailMob && errors.emailMob && <Form.Text className="error-msg">{errors.emailMob}</Form.Text>
                          } */}
                          {errors.emailMob?.message && <Form.Text className="error-msg">{errors.emailMob?.message} </Form.Text>}
                        </Form.Group>
                        <Button variant="primary" type="submit" className='theme-btn large-btn'>
                          Send {loading && <Spinner className="text-center" animation="border" size='sm' />}
                        </Button>
                      </Form>
                    </div>
                  </div>
                </div>
    </>
  )
}

export default ForgotPassword
