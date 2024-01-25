import React, { useRef, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { resetPassword, adminResetPassword } from '../../../Actions/auth'
import { Button, Form } from 'react-bootstrap'
import AuthLeftLogo from '../../../Components/AuthLeftLogo'
import BackArrow from '../../../Components/BackArrow'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { useSnackbar } from 'react-notistack'

// Regex for password
const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

// Validation-Scheme for fields
const validationSchema = yup.object().shape({
  password: yup.string().required('Password is required').matches(passRegex, 'Password must contain at least eight characters, at least one number and both lower and uppercase letters and special characters'),
  cPassword: yup.string().required('Confirm Password is required')
    .oneOf([yup.ref('password'), null], 'Password and Confirm password must be same ')
})
function ResetPassword (props) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const params = useParams()
  const { enqueueSnackbar } = useSnackbar()
  const [isShowPassword, setShowPassword] = useState(false)
  const [type, setType] = useState('password')
  const AuthToken = useSelector(state => state.auth.authToken)
  const isResetFlag = useSelector(state => state.auth.isReset)
  const isAdminResetFlag = useSelector(state => state.auth.isAdminReset)
  const resMessageFlag = useSelector(state => state.auth.resMessage)
  const previousProps = useRef({ AuthToken, isResetFlag, resMessageFlag }).current
  const AuthTokenadmin = useSelector(state => state.auth.adminToken)
  // const str = location?.pathname
  // const substring = str.substr(0, 4)
  // location?.pathname === '/admin/reset-password/token'
  // eslint-disable-next-line react/prop-types
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(validationSchema)
  })
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

  const { onChange, name } = register('password', 'cPassword')
  const onSubmit = data => {
    localStorage.setItem('EmailMobile', data.emailMob)
    let userData = {}
    if (location?.pathname === '/admin/reset-password') {
      userData = {
        password: data.password,
        confirm_password: data.cPassword,
        token: AuthTokenadmin
      }
      if (userData) {
        dispatch(adminResetPassword(userData, 'admin'))
      }
    } else if (location?.pathname === '/center/reset-password') {
      userData = {
        password: data.password,
        confirm_password: data.cPassword,
        token: AuthTokenadmin
      }
      if (userData) {
        dispatch(adminResetPassword(userData, 'center'))
      }
    } else {
      userData = {
        password: data.password,
        confirm_password: data.cPassword,
        token: AuthToken
      }
      if (userData) {
        dispatch(resetPassword(userData))
      }
    }
    reset()
  }

  // Toastify Notification
  useEffect(() => {
    if (previousProps?.isResetFlag !== isResetFlag) {
      if (isResetFlag) {
        enqueueSnackbar(`${resMessageFlag}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        navigate('/')
      } else if (isResetFlag === false) {
        enqueueSnackbar(`${resMessageFlag}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        }
        )
      }
    }
    return () => {
      previousProps.isResetFlag = isResetFlag
    }
  }, [isResetFlag])
  // Toastify Notification
  useEffect(() => {
    if (previousProps?.isAdminResetFlag !== isAdminResetFlag) {
      if (isAdminResetFlag) {
        enqueueSnackbar(`${resMessageFlag}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        if (location?.pathname === '/center/reset-password') { navigate('/center/login') } else {
          navigate('/admin/login')
        }
      } else if (isAdminResetFlag === false) {
        enqueueSnackbar(`${resMessageFlag}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        }
        )
      }
    }
    return () => {
      previousProps.isAdminResetFlag = isAdminResetFlag
    }
  }, [isAdminResetFlag])
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
           <BackArrow location={location} token={params.token} />
          <div className="title-box">
              <h2>Reset Password</h2>
            </div>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Form.Group className="form-group " controlId="formnewPassword">
                <Form.Label>New Password</Form.Label>
                <div className="password-box no-eye" >
                  <Form.Control
                     type={type}
                     placeholder="Enter New Password"
                     name={name}
                     onChange={(e) => {
                       onChange(e)
                       onHandleChange(e, 'password')
                     }}
                    {...register('password', { required: true })}
                  />
                  <span
                              className={`show-hide-pass ${isShowPassword ? 'show-pass' : ''}`}
                              onClick={handleShowHidePassword} >
                            </span>
                </div>
                {errors.password?.message && <Form.Text className="error-msg">{errors.password?.message} </Form.Text>}
              </Form.Group>
              <Form.Group className="form-group " controlId="formconfirmPassword">
                <Form.Label>Confirm Passwod</Form.Label>
                <div className="password-box no-eye" >
                  <Form.Control
                     type="password"
                     placeholder="Re-enter New Password"
                     name={name}
                     onChange={(e) => {
                       onChange(e)
                       onHandleChange(e, 'cPassword')
                     }}
                    {...register('cPassword', { required: true })}
                  />
                  {errors.cPassword?.message && <Form.Text className="error-msg">{errors.cPassword?.message} </Form.Text>}
                </div>
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

export default ResetPassword
