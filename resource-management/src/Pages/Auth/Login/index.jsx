import React, { useRef, useState } from 'react'

import Banner from 'Components/Banner'
import AuthForm from 'Components/AuthForm/'
import Input from 'Components/Input'
import Button from 'Components/Button'
import { useMutation } from 'react-query'
import { loginApi } from '../../../Query/Auth/auth.query'
import { addToken, verifyLength } from 'helpers/helper'
import { Link, useNavigate } from 'react-router-dom'
import { ReactComponent as Email } from '../../../Assets/Icons/email.svg'
import { ReactComponent as Eye } from '../../../Assets/Icons/eye.svg'
import { ReactComponent as CloseEye } from '../../../Assets/Icons/closeEye.svg'

export default function Login() {
  const [email, setEmail] = useState('')
  const [errEmail, setErrEmail] = useState('')

  const [password, setPassword] = useState('')
  const [errPassword, setErrPassword] = useState('')

  const [show, setShow] = useState(false)

  const isRemember = useRef(null)

  const navigate = useNavigate()

  const { isLoading, mutate, isError, error } = useMutation(loginApi, {
    onSuccess: (data) => {
      const checked = isRemember.current.checked
      addToken(data?.data?.newToken?.sToken, checked)
      navigate('/dashboard')
    },
    onError: () => {
      setEmail('')
      setPassword('')
    },
  })

  function handleChange(e, type) {
    e.preventDefault()
    switch (type) {
      case 'Email':
        if (verifyLength(e.target.value, 1)) {
          setErrEmail('')
        } else if (!verifyLength(e.target.value, 1)) {
          setErrEmail('Required field')
        }
        setEmail(e.target.value)
        break
      case 'Password':
        if (verifyLength(e.target.value, 1)) {
          setErrPassword('')
        } else if (!verifyLength(e.target.value, 1)) {
          setErrPassword('Required field')
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
      mutate({ sLogin: email, sPassword: password })
    } else {
      if (!verifyLength(email, 1)) {
        setErrEmail('Required field')
      }
      if (!verifyLength(password, 1)) {
        setErrPassword('Required field')
      }
    }
  }
  return (
    <>
      <section className="auth_section">
        <Banner />
        <AuthForm title="Sign In" subTitle="please enter your credential to login" onSubmit={logIn}>
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
              <input type="checkbox" id="remember_me" ref={isRemember} disabled={isLoading} />
              <label htmlFor="remember_me">remember me</label>
            </div>
            <div className="forgot_password">
              <Link to="/forgot-password">forgot password ?</Link>
            </div>
          </div>
          <Button loading={isLoading} className="mt-4 primary" fullWidth>
            Login
          </Button>
          <p className="errorResponse">{isError && error?.response?.data?.message}</p>
        </AuthForm>
      </section>
    </>
  )
}
