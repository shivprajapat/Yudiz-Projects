import React, { useRef, useEffect, useState } from 'react'

/* NPM-Packages */
// import { Formik } from 'formik'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useSnackbar } from 'react-notistack'

/* React-bootstrap Components */
import { Button, Form } from 'react-bootstrap'

/* Language Component */
import AuthLeftLogo from '../../../Components/AuthLeftLogo'
import BackArrow from '../../../Components/BackArrow'

/* Action File */
import { emailVerifiedAction } from '../../../Actions/auth'

// Validation-Scheme for fields
const validationSchema = yup.object().shape({
  emailMob: yup.string()
    .required('Email/Mobile Number is required')
    .test('test-name', 'Enter Valid E-Mail/Mobile Number',
      function (value) {
        const emailRegex = /.+@.+\.[A-Za-z]+$/
        const phoneRegex = /^(\+\d{1,3}[- ]?)?\d{10}$/
        const isValidEmail = emailRegex.test(value)
        const isValidPhone = phoneRegex.test(value)
        if (!isValidEmail && !isValidPhone) {
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

  // useState
  const [isEmail, setisEmail] = useState(false)

  // State Data
  const isSend = useSelector(state => state.auth.isEmailVerified)
  const isAuthMessage = useSelector(state => state.auth.resMessage)
  const previousProps = useRef({ isSend, isAuthMessage }).current

  // UseForm Methods
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema)
  })
  const { onChange, name } = register('emailMob')

  // Method to set url
  useEffect(() => {
    localStorage.setItem('url', location.pathname)
  }, [])

  // Form onSubmit Method
  const onSubmit = data => {
    localStorage.setItem('EmailMobile', data.emailMob)
    const re = /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/
    if (re.test(data.emailMob)) {
      setisEmail(true)
    }
    const userData = {
      emailMobile: data.emailMob
    }
    if (userData) {
      dispatch(emailVerifiedAction(userData))
    }
  }

  // Toastify Notification
  useEffect(() => {
    if (previousProps?.isSend !== isSend) {
      if (isSend) {
        enqueueSnackbar(`${isAuthMessage}`, {
          variant: 'success',
          autoHide: true,
          hide: 3000
        })
        navigate('/one-time-password', { state: { isEmail } })
      } else if (isSend === false) {
        enqueueSnackbar(`${isAuthMessage}`, {
          variant: 'error',
          autoHide: true,
          hide: 3000
        }
        )
      }
    }
    return () => {
      previousProps.isSend = isSend
    }
  }, [isSend])

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
                    <BackArrow />
                    <div className="title-box has-subtitle">
                        <h2>Forget Password</h2>
                        <h4>Enter your email address and we&apos;ll send you a OTP to reset your password.</h4>
                      </div>
                      <Form onSubmit={handleSubmit(onSubmit)}>
                        <Form.Group
                             className={`form-group ${errors.emailMob?.message ? 'error-occured' : ''}`}
                             controlId="formBasicEmail">
                          <Form.Label>Enter E-Mail or Mobile Number</Form.Label>
                          <Form.Control
                              type="text"
                              name={name}
                              placeholder="Enter E-Mail or Mobile Number"
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
                          Send
                        </Button>
                      </Form>
                    </div>
                  </div>
                </div>
    </>
  )
}

export default ForgotPassword
