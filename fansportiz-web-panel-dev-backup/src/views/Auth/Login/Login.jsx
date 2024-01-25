import React, { useState, useEffect } from 'react'
import {
  Button, Form, FormGroup, Input, Label, Alert
} from 'reactstrap'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router-dom'
import {
  verifyEmail, verifyPassword, verifyMobileNumber
} from '../../../utils/helper'
// import { OldSocialLogin as SocialLogin } from 'react-social-login'
import Loading from '../../../component/Loading'
// import googleIcon from '../../../assests/images/google_icon.svg'
// import facebookIcon from '../../../assests/images/facebook_icon.svg'
import hidePassword from '../../../assests/images/hidePasswordEye.svg'
import eye from '../../../assests/images/showPasswordEye.svg'
import useLogin from '../../../api/auth/mutations/useLogin'
const classNames = require('classnames')

function LoginForm () {
  const FirebaseToken = localStorage.getItem('FirebaseToken')
  const [userName, setUserName] = useState('')
  const [Password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [modalMessage, setModalMessage] = useState(false)
  // const [token, setToken] = useState('')

  // useEffect(() => {
  //   if (socialRegisterData) {
  //     navigate('/sign-up', { state: { socialRegisterData, token } })
  //   }
  // }, [socialRegisterData])

  function handleChange (event, type) {
    switch (type) {
      case 'UserName':
        setUserName(event.target.value)
        break
      case 'Password':
        setPassword(event.target.value)
        break
      default:
        break
    }
  }

  const { mutate: login, isLoading } = useLogin({ setMessage, setModalMessage, userName, Password })

  function logIn (e) {
    e.preventDefault()
    if (verifyPassword(Password) && (verifyMobileNumber(userName) || verifyEmail(userName))) {
      const deviceId = localStorage.getItem('ID')
      login({ FirebaseToken, Platform: 'W', userName, Password, loginID: deviceId })
    } else {
      setMessage(<FormattedMessage id="Please_enter_valid_credentials" />)
      setModalMessage(true)
    }
  }

  useEffect(() => {
    setTimeout(() => {
      setModalMessage(false)
    }, 2000)
  }, [modalMessage])

  // Google Login
  // function googleLogin (user, err) {
  //   if (user && user._token && user._token.idToken) {
  //     // googleSignUp('G', user._token.idToken)
  //     setToken(user._token.idToken)
  //   }
  // }

  // Facebook Login
  // function facebookLogin (user, err) {
  //   if (user && user._token && user._token.accessToken) {
  //     // googleSignUp('F', user._token.accessToken)
  //     setToken(user._token.accessToken)
  //   }
  // }

  return (
    <>
      {modalMessage
        ? <Alert color="primary" isOpen={modalMessage}>{message}</Alert>
        : ''}
      {isLoading && <Loading />}
      <Form className="form login">
        <FormGroup className="c-input">
          <Input autocomplete="off" className={classNames({ 'hash-contain': userName })} id="userName" onChange={(e) => { handleChange(e, 'UserName') }} type="text" />
          <Label className="label m-0" for="userName"><FormattedMessage id="Email_or_Username" /></Label>
        </FormGroup>
        <FormGroup className="c-input mb-0">
          <Input
            autocomplete="off"
            className={classNames({ 'hash-contain': Password })}
            id="password"
            onChange={(e) => { handleChange(e, 'Password') }}
            type={showPassword ? 'text' : 'password'}
          />
          <div className="class-eye" onClick={() => setShowPassword(!showPassword)} onFocus={(e) => e.preventDefault} onKeyDown={(e) => e.preventDefault()} role="button" tabIndex={0}>
            <img alt="" src={showPassword ? eye : hidePassword} />
          </div>
          <Label className="label m-0" for="password"><FormattedMessage id="Password" /></Label>
        </FormGroup>
        <FormGroup>
          <div className={document.dir === 'rtl' ? 'text-start' : 'text-end'}>
            <Link className="forgot-link mb-2 mt-2" to="/forgot-password"><FormattedMessage id="Forgot_password" /></Link>
          </div>
        </FormGroup>
        <Button block color="primary" disabled={!Password || !userName} onClick={(e) => logIn(e)} type="submit"><FormattedMessage id="Login" /></Button>
        <div className="b-link mt-4">
          <FormattedMessage id="Do_not_have_an_account" />
          <Link className="signup-text" title="Sign up" to="/sign-up"><FormattedMessage id="Sign_up" /></Link>
        </div>
        {/* <div className="d-flex flex-column align-items-center login-with">
          <p className="small-text"><FormattedMessage id="OR_LOGIN_WITH" /></p>
          <div className='fullWidth'>
            <SocialLogin
              provider='google'
              appId='218538323308-p1bf5od94pbdfna1rstq3s1kea8gpgfr.apps.googleusercontent.com'
              key='AIzaSyBbVb54ZxgNwG-c3ImBDBRS2OZrlVO_23s'
              callback={googleLogin}
              scope={'https://www.googleapis.com/auth/user.gender.read'}
            >
              <div className="s-btn m-0 btn btn-secondary btn-block">
                <img src={googleIcon} alt="Google" />
                <FormattedMessage id="continue_with_Google" />
              </div>
            </SocialLogin>
          </div>
          <div className='socialIcon'>
            <SocialLogin
              provider='facebook'
              appId='255241426395097'
              callback={facebookLogin}
            >
              <div className="s-btn m-0 btn btn-secondary btn-block">
                <img src={facebookIcon} alt="Facebook" width="34px" />
                <FormattedMessage id="continue_with_Facebook" />
              </div>
            </SocialLogin>
          </div>
        </div> */}
      </Form>
    </>
  )
}

export default LoginForm
