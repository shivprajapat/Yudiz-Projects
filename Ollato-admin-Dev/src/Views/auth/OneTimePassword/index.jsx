import React, { useRef, useEffect } from 'react'
import { Button, Form } from 'react-bootstrap'
import AuthLeftLogo from '../../../Components/AuthLeftLogo'
import BackArrow from '../../../Components/BackArrow'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useDispatch, useSelector } from 'react-redux'
import * as yup from 'yup'
import { otpVerifiedAction, verifyOtp } from '../../../Actions/auth'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSnackbar } from 'react-notistack'

// Validation-Scheme for fields
const validationSchema = yup.object().shape({
  input1: yup.string().required('OTP is required').matches(/^[0-9]*$/, 'Only numbers are allowed'),
  input2: yup.string().required('OTP is required').matches(/^[0-9]*$/, 'Only numbers are allowed'),
  input3: yup.string().required('OTP is required').matches(/^[0-9]*$/, 'Only numbers are allowed'),
  input4: yup.string().required('OTP is required').matches(/^[0-9]*$/, 'Only numbers are allowed')
})

function OneTimePassword (props) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { enqueueSnackbar } = useSnackbar()
  const isAuth = useSelector(state => state.auth.isAuthenticated)
  const isVerified = useSelector(state => state.auth.isOtpVerified)
  const isAuthMessage = useSelector(state => state.auth.resMessage)
  const AuthToken = useSelector(state => state.auth.authToken)
  const AuthTokenadmin = useSelector(state => state.auth.adminToken)
  const previousProps = useRef({ isAuth, isVerified, isAuthMessage }).current
  const EmailMobile = localStorage.getItem('EmailMobile')
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(validationSchema)
  })

  // eslint-disable-next-line react/prop-types
  const { onChange, name } = register('emailMob')

  const onSubmit = data => {
    let userData = {}
    userData = {
      otp: data.input1 + data.input2 + data.input3 + data.input4,
      token: AuthToken || AuthTokenadmin
    }
    // eslint-disable-next-line no-empty
    if (location?.pathname === '/one-time-password') {
      if (userData) {
        dispatch(otpVerifiedAction(userData, 'counsellor'))
      }
    } else if (location?.pathname === '/login-with-otp/one-time-password') {
      userData = {
        login: EmailMobile,
        otp: data.input1 + data.input2 + data.input3 + data.input4
      }
      dispatch(verifyOtp(userData))
    } else if (location?.pathname === '/admin/one-time-password') {
      dispatch(otpVerifiedAction(userData, 'admin'))
    } else if (location?.pathname === '/center/one-time-password') {
      dispatch(otpVerifiedAction(userData, 'center'))
    } else {
      userData = {
        login: EmailMobile,
        otp: data.input1 + data.input2 + data.input3 + data.input4
      }
    }
    reset()
  }
  // Auto next to next input field
  const inputfocus = (elmnt) => {
    if (elmnt.key === 'Delete' || elmnt.key === 'Backspace') {
      const next = elmnt.target.tabIndex - 2
      if (next > -1) {
        elmnt.target.form.elements[next].focus()
      }
    } else {
      const next = elmnt.target.tabIndex
      if (next <= 4) {
        elmnt.target.form.elements[next].focus()
      }
    }
  }

  // Toastify Notification
  useEffect(() => {
    if (previousProps?.isVerified !== isVerified) {
      if (isVerified) {
        enqueueSnackbar(`${isAuthMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        if (location?.pathname === '/admin/one-time-password') {
          navigate('/admin/reset-password')
        } else if (location?.pathname === '/center/one-time-password') {
          navigate('/center/reset-password')
        } else {
          navigate('/reset-password')
        }
      } else if (isVerified === false) {
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
      previousProps.isVerified = isVerified
    }
  }, [isVerified])

  useEffect(() => {
    if (previousProps?.isAuth !== isAuth) {
      if (isAuth) {
        enqueueSnackbar(`${isAuthMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        navigate('/counsellor-dashboard')
      } else if (isAuth === false) {
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
      previousProps.isAuth = isAuth
    }
  }, [isAuth])

  return (
    <>
      <div className="common-layout">
       <AuthLeftLogo />
        <div className="form-box-section justify-content-center">
         <div className="middle-form">
           <BackArrow location={location} />
           <Form.Group className="form-group " controlId="formBasicotp">
          <div className="title-box has-subtitle">
              <h2>One Time Password </h2>
              <h4>We sent you 4 digit OTP code in your Email ID <a href="mailto:abc@xyz.com">{EmailMobile}</a> </h4>
            </div>
        <Form onSubmit={handleSubmit(onSubmit)}>
                  <Form.Group className="form-group " controlId="formBasicotp">
                      <Form.Label>One Time Password</Form.Label>
                       <div className="otp-input-fields">
                          <Form.Group
                            className={`form-group ${errors.input1?.message ? 'error-occured' : ''}`}
                            controlId="formBasicotp"
                          >
                            <Form.Control
                               type="text"
                               name={name}
                               placeholder="X"
                               tabIndex="1" maxLength="1" onKeyUp={e => inputfocus(e)}
                               onChange={(e) => {
                                 onChange(e)
                               }}
                               {...register('input1', { required: true })}
                                />
                          </Form.Group>
                          <Form.Group
                             className={`form-group ${errors.input2?.message ? 'error-occured' : ''}`}
                             controlId="formBasicotp">
                            <Form.Control
                               type="text"
                               name={name}
                               placeholder="X"
                               tabIndex="2" maxLength="1" onKeyUp={e => inputfocus(e)}
                               onChange={(e) => {
                                 onChange(e)
                               }}
                               {...register('input2', { required: true })}
                            />
                          </Form.Group>
                          <Form.Group
                             className={`form-group ${errors.input3?.message ? 'error-occured' : ''}`}
                             controlId="formBasicotp">
                            <Form.Control
                               type="text"
                               name={name}
                               placeholder="X"
                               tabIndex="3" maxLength="1" onKeyUp={e => inputfocus(e)}
                               onChange={(e) => {
                                 onChange(e)
                               }}
                               {...register('input3', { required: true })}
                            />
                          </Form.Group>
                            <Form.Group
                               className={`form-group ${errors.input4?.message ? 'error-occured' : ''}`}
                               controlId="formBasicotp"
                               >
                              <Form.Control
                               type="text"
                               name={name}
                               placeholder="X"
                               tabIndex="4" maxLength="1" onKeyUp={e => inputfocus(e)}
                               onChange={(e) => {
                                 onChange(e)
                               }}
                               {...register('input4', { required: true })}
                            />
                            </Form.Group>
                        </div>

                        {
                          ((errors.input1?.message) ||
                          (errors.input2?.message) ||
                          (errors.input3?.message) ||
                          (errors.input4?.message)) &&
                          <Form.Text className="error-msg">{errors.input1?.message || errors.input2?.message || errors.input3?.message || errors.input4?.message}</Form.Text>
                        }
                      </Form.Group>
                    <Button variant="primary" type="submit" className='theme-btn large-btn'>
                      Send
                    </Button>
                </Form>
          </Form.Group>
          </div>
        </div>
      </div>
    </>
  )
}

export default OneTimePassword
