import React, { useRef, useEffect } from 'react'
import { Button, Form } from 'react-bootstrap'
import Language from '../../../Components/Language'
import AuthLeftLogo from '../../../Components/AuthLeftLogo'
import { Link, useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useDispatch, useSelector } from 'react-redux'
import { useSnackbar } from 'react-notistack'
import { sendOTP } from '../../../Actions/auth'
const validationSchema = yup.object().shape({
  emailMob: yup.string()
    .required('E-Mail/Mobile Number is required')
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
function LoginWithOtp () {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const isSend = useSelector(state => state.auth.isOTPSend)
  const isAuthMessage = useSelector(state => state.auth.resMessage)
  const previousProps = useRef({ isSend, isAuthMessage }).current
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema)
  })
  // Method to set url
  useEffect(() => {
    localStorage.setItem('url', location?.pathname)
  }, [])
  const { onChange, name } = register('emailMob')
  const onSubmit = data => {
    localStorage.setItem('EmailMobile', data.emailMob)
    const userData = {
      login: data.emailMob
    }
    if (userData) {
      dispatch(sendOTP(userData))
    }
    // reset()
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
        navigate('/login-with-otp/one-time-password')
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
        <div className="form-box-section">
          <Language />
         <div className="middle-form">
          <div className="title-box">
              <h2>Counsellor Login</h2>
            </div>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Form.Group
                className={`form-group ${errors.emailMob?.message ? 'error-occured' : ''}`}
                controlId="formBasicEmail"
              >
                <Form.Label>E-Mail or Mobile Number</Form.Label>
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
                   {errors.emailMob?.message && <Form.Text className="error-msg">{errors.emailMob?.message} </Form.Text>}
              </Form.Group>
              <Button variant="primary" type="submit" className='theme-btn large-btn'>
                Send OTP
              </Button>
            </Form>
            <div className="seprater-box">
              <span>Or</span>
            </div>
            <Link to="/" className='d-block text-center' >Login with Password</Link>
          </div>
          <div className="redirect-to-signin">
            <p>Don&apos;t have an account yet? <Link to="/counsellor/signup">Create an account</Link></p>
          </div>
        </div>
      </div>
    </>
  )
}

export default LoginWithOtp
