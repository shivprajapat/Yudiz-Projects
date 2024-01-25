import React, { useRef, useState, useContext } from 'react'

// component
import { loginApi } from 'Query/Auth/auth.query'
import AuthForm from 'Components/AuthForm/'
import Banner from 'Components/Banner'
import Button from 'Components/Button'
import Input from 'Components/Input'

// query
import { useMutation, useQueryClient } from 'react-query'

// icons
import { ReactComponent as CloseEye } from 'Assets/Icons/closeEye.svg'
import { ReactComponent as Email } from 'Assets/Icons/email.svg'
import Eye from 'Assets/Icons/Eye'

// helper
import { addToken, toaster, verifyLength } from 'helpers'

import { Link, useNavigate } from 'react-router-dom'
import { userContext } from '../../../context/user'
import { Form } from 'react-bootstrap'

export default function Login() {
  const { dispatch } = useContext(userContext)
  const queryClient = useQueryClient()
  const isRemember = useRef(null)
  const navigate = useNavigate()

  const [errPassword, setErrPassword] = useState('')
  const [errEmail, setErrEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [email, setEmail] = useState('')


  // post login data
  const { isLoading, mutate } = useMutation(loginApi, {
    onSuccess: (data) => {
      const checked = isRemember.current.checked
      addToken(data?.data?.newToken?.sToken, checked)
      dispatch({ type: "USER_TOKEN", payload: data?.data?.newToken?.sToken || '' })
      navigate('/dashboard')
      toaster(data?.data?.message)
    },
    onError: (error) => {
      setEmail('')
      setPassword('')
      toaster(error?.response?.data?.message, 'error')
    },
  })

  function handleChange(e, type) {
    e.preventDefault()
    switch (type) {
      case 'Email':
        if (verifyLength(e.target.value, 1)) {
          setErrEmail('')
        } else if (!verifyLength(e.target.value, 1)) {
          setErrEmail('Enter your email or mobile phone number')
        }
        setEmail(e.target.value)
        break
      case 'Password':
        if (verifyLength(e.target.value, 1)) {
          setErrPassword('')
        } else if (!verifyLength(e.target.value, 1)) {
          setErrPassword('Enter your password')
        }
        setPassword(e.target.value)
        break
      default:
        break
    }
  }

  function logIn(e) {
    e.preventDefault()
    if (verifyLength(email, 1) && verifyLength(password, 1)) {
      const sPushToken = queryClient.getQueryData('onsignal-token')
      mutate({ sLogin: email, sPassword: password, sPushToken })
    } else {
      if (!verifyLength(email, 1)) {
        setErrEmail('Enter your email or mobile phone number')
      }
      if (!verifyLength(password, 1)) {
        setErrPassword('Enter your password')
      }
    }
  }
  return (
    <>
      <section className="auth_section">
        <Banner />
        <AuthForm title="Sign In" subTitle="Please enter your credential to login" onSubmit={logIn}>
          <Input
            id={'email'}
            labelText={'Email / Phone No.'}
            type={'text'}
            placeholder={'Enter Email Address'}
            value={email}
            errorMessage={errEmail}
            onChange={(e) => {
              handleChange(e, 'Email')
            }}
            startIcon={<Email />}
            className="ps-5"
          />
          <Input
            id={'password'}
            labelText={'Password'}
            type={show ? 'text' : 'password'}
            value={password}
            placeholder={'Enter Your Password'}
            errorMessage={errPassword}
            onChange={(e) => {
              handleChange(e, 'Password')
            }}
            startIcon={show ? <Eye onClick={() => setShow(false)} /> : <CloseEye onClick={() => setShow(true)} />}
            className="ps-5"
          />
          <div className="login_option">
            <div className="rememberMe">
              <Form.Check type="checkbox" id="excludeBilling" ref={isRemember} disabled={isLoading} label="Remember me" />
            </div>
            <div className="forgot_password">
              <Link to="/forgot-password">Forgot password?</Link>
            </div>
          </div>
          <Button loading={isLoading} className="mt-4 primary" fullWidth>
            Login
          </Button>
        </AuthForm>
      </section>
    </>
  )
}
