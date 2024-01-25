import React, { Fragment, useState, useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { verifyEmail, verifyMobileNumber, verifyPassword, handleInputValue } from '../../../utils/helper'
import { Button, Form, FormGroup, Input, Label, Alert, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap'
import PropTypes from 'prop-types'
import Loading from '../../../component/Loading'
import hidePassword from '../../../assests/images/hidePasswordEye.svg'
import eye from '../../../assests/images/showPasswordEye.svg'
import classnames from 'classnames'
import useSendOTP from '../../../api/auth/mutations/useSendOTP'
import useVerifyOTP from '../../../api/auth/mutations/useVerifyOTP'
import useForgotPassword from '../../../api/auth/mutations/useForgotPassword'
const classNames = require('classnames')

function ForgotPasswordForm (props) {
  const { setTitle, title } = props

  const [activeTab, setActiveTab] = useState('2')
  const [email, setEmail] = useState('')
  const [errEmail, setErrEmail] = useState('')
  const [mobileNumber, setMobileNumber] = useState('')
  const [errMobileNumber, setErrMobileNumber] = useState('')
  const [otp, setOtp] = useState('')
  const [errOtp, setErrOtp] = useState('')
  const [password, setPassword] = useState('')
  const [passwordErr, setPasswordErr] = useState('')
  const [confirmPassword, setRePassword] = useState('')
  const [confirmPasswordErr, setConfirmPasswordErr] = useState('')
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(60)
  const [showPassword, setShowPassword] = useState(false)
  const [showRePassword, setShowRePassword] = useState(false)
  const [message, setMessage] = useState('')
  const [modalMessage, setModalMessage] = useState()

  const deviceId = localStorage.getItem('ID')
  const FirebaseToken = localStorage.getItem('FirebaseToken')

  const { mutate: SendOTPMutation, isLoading: sendOTPLoading, isSuccess: isOtpSent } = useSendOTP({ setMessage, setModalMessage })
  const { mutate: VerifyOTPMutation, isSuccess: isOtpVerified, isLoading: otpVerifiedLoading } = useVerifyOTP({
    setMessage,
    setModalMessage,
    authType: 'F'
  })
  const { mutate: ForgotPasswordMutation, isLoading: resetPasswordLoading } = useForgotPassword({
    setMessage,
    setModalMessage
  })

  useEffect(() => {
    const myInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1)
      }
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(myInterval)
        } else {
          setMinutes(minutes - 1)
          setSeconds(59)
        }
      }
    }, 1000)
    return () => {
      clearInterval(myInterval)
    }
  }, [minutes, seconds])

  const toggle = tab => {
    if (activeTab !== tab) setActiveTab(tab)
  }

  useEffect(() => {
    if (modalMessage) {
      setTimeout(() => {
        setModalMessage(false)
      }, 3000)
    }
  }, [modalMessage])

  useEffect(() => {
    if (isOtpSent) {
      setTitle(<FormattedMessage id='Reset_Password' />)
    }
  }, [isOtpSent])

  useEffect(() => {
    if (isOtpVerified) {
      setTitle(<FormattedMessage id='Forgot_Password' />)
      if ((verifyEmail(email) || verifyMobileNumber(mobileNumber)) && otp && verifyPassword(password) && (confirmPassword === password)) {
        ForgotPasswordMutation({ sLogin: email || mobileNumber, sType: email ? 'E' : 'M', sAuth: 'F', sCode: otp, sNewPassword: password })
      }
    }
  }, [isOtpVerified])

  function handleChange (event, type) {
    setModalMessage(false)
    switch (type) {
      case 'Email':
        setErrEmail('')
        setEmail(event.target.value)
        break
      case 'MobileNumber':
        if (!isNaN(event.target.value)) {
          setErrMobileNumber('')
          setMobileNumber(event.target.value)
        }
        break
      case 'PASSWORD':
        setPasswordErr('')
        setPassword(event.target.value)
        break
      case 'RE_PASSWORD':
        setConfirmPasswordErr('')
        setRePassword(event.target.value)
        break
      case 'OTP':
        setErrOtp('')
        setOtp(event.target.value)
        break
      default:
        break
    }
  }

  function sendOTP (e) {
    e.preventDefault()
    if (verifyEmail(email) || verifyMobileNumber(mobileNumber)) {
      SendOTPMutation({ mobileNumber: email || mobileNumber, sType: email ? 'E' : 'M', sAuth: 'F' })
      setMinutes(0)
      setSeconds(60)
    } else {
      if (!verifyEmail(email) && activeTab === '1') {
        setErrEmail(<FormattedMessage id="Invalid_email" />)
      }
      if (!verifyMobileNumber(mobileNumber) && activeTab === '2') {
        setErrMobileNumber(<FormattedMessage id="Invalid_mobile_number" />)
      }
    }
  }

  function ForgetPassword (e) {
    e.preventDefault()
    if ((verifyEmail(email) || verifyMobileNumber(mobileNumber)) && otp?.length >= 4 && otp?.length <= 6 && verifyPassword(password) && (confirmPassword === password)) {
      VerifyOTPMutation({ mobileNumber: email || mobileNumber, sType: email ? 'E' : 'M', sAuth: 'F', sCode: otp, ID: deviceId, FirebaseToken })
    } else {
      if (!verifyEmail(email) && activeTab === '1') {
        setErrEmail(<FormattedMessage id="Invalid_email" />)
      }
      if (!verifyMobileNumber(mobileNumber) && activeTab === '2') {
        if (activeTab === '2') {
          setErrMobileNumber(<FormattedMessage id="Invalid_mobile_number" />)
        }
      }
      if (!verifyPassword(password)) {
        setPasswordErr(<FormattedMessage id="Password_must_be_8_to_15_characters" />)
      }
      if (otp.length < 4 || otp.length > 6) {
        setErrOtp(<FormattedMessage id="OTP_length_validation" />)
      }
      if (confirmPassword !== password) {
        setConfirmPasswordErr(<FormattedMessage id="Password_and_confirm_password_must_be_same" />)
      }
    }
  }

  return (
    <>
      {modalMessage
        ? <Alert color="primary" isOpen={modalMessage}>{message}</Alert>
        : ''}
      {(sendOTPLoading || otpVerifiedLoading || resetPasswordLoading) && <Loading />}
      {title?.props?.id === 'Forgot_Password' && (
        <Nav className="tabs justify-content-center">
          <NavItem className="w-50 text-center">
            <NavLink className={classnames({ active: activeTab === '2' })}
              disabled={isOtpSent}
              onClick={() => {
                toggle('2')
                setEmail('')
              }}
            >
              <FormattedMessage id="Via_SMS" />
            </NavLink>
          </NavItem>
          <NavItem className="w-50 text-center">
            <NavLink className={classnames({ active: activeTab === '1' })}
              disabled={isOtpSent}
              onClick={() => {
                toggle('1')
                setMobileNumber('')
              }}
            >
              <FormattedMessage id="Via_Email" />
            </NavLink>
          </NavItem>
        </Nav>
      )}
      <div>
        <TabContent activeTab={activeTab}>
          <TabPane tabId="1">
            {!isOtpSent && !isOtpVerified && (
            <Form className="form sign-up pt-0">
              <p className={`m-msg ${document.dir !== 'rtl' && 'text-start'}`}><FormattedMessage id="Please_enter_your_registered_email_address" /></p>
              <FormGroup className="c-input">
                <div className="fake-input" >
                  <Input autoComplete='off' className={classNames({ 'hash-contain': email, error: errEmail })} disabled={isOtpSent || isOtpVerified} id="email" onChange={(e) => { handleChange(e, 'Email') }} type="Email" value={email} />
                  <Label className="label m-0" for="email"><FormattedMessage id="Email" /></Label>
                </div>
                <p className="error-text">{errEmail}</p>
              </FormGroup>
              <Button block color="primary" disabled={!isOtpVerified ? (email ? (errEmail || email === '') : (errMobileNumber || mobileNumber === '')) : (passwordErr || confirmPasswordErr || password === '' || confirmPassword === '')} hidden={isOtpSent && !isOtpVerified} onClick={sendOTP} type="submit"><FormattedMessage id="Submit" /></Button>
            </Form>
            )}
            {isOtpSent && !isOtpVerified && (
            <Form className="form pt-0">
              <p className={`m-msg ${document.dir !== 'rtl' && 'text-start'}`}>
                <FormattedMessage id="You_will_received_OTP_on" />
                <b>{email}</b>
              </p>
              <FormGroup className="c-input">
                <div className="fake-input" >
                  <Input autoComplete='off' className={classNames({ 'hash-contain': otp, error: errOtp }) } disabled={isOtpVerified} id="otp" onChange={(e) => { handleChange(e, 'OTP') }} type='number' value={otp} />
                  <Label className="label m-0" for="otp"><FormattedMessage id="OTP" /></Label>
                </div>
                <p className="error-text">{errOtp}</p>
              </FormGroup>
              <FormGroup className="c-input">
                <div className="fake-input" >
                  <Input autoComplete='off' className={classNames({ 'hash-contain': password, error: passwordErr })} id="password" onChange={(e) => { handleChange(e, 'PASSWORD') }} type={showPassword ? 'text' : 'password'} value={password} />
                  <div className='class-eye' onClick={() => setShowPassword(!showPassword)}>
                    <img src={showPassword ? eye : hidePassword} />
                  </div>
                  <Label className="label m-0" for="password"><FormattedMessage id="Password" /></Label>
                </div>
                <p className="error-text">{passwordErr}</p>
              </FormGroup>
              <FormGroup className="c-input">
                <div className="fake-input" >
                  <Input autoComplete='off' className={classNames({ 'hash-contain': confirmPassword, error: confirmPasswordErr })} id="confirmpassword" onChange={(e) => { handleChange(e, 'RE_PASSWORD') }} type={showRePassword ? 'text' : 'password'} value={confirmPassword} />
                  <div className='class-eye' onClick={() => setShowRePassword(!showRePassword)}>
                    <img src={showRePassword ? eye : hidePassword} />
                  </div>
                  <Label className="label m-0" for="confirmpassword"><FormattedMessage id="Confirm_Password" /></Label>
                </div>
                <p className="error-text">{confirmPasswordErr}</p>
              </FormGroup>
              <Button block color="primary" disabled={!otp || errOtp} hidden={!isOtpSent && !isOtpVerified} onClick={ForgetPassword} type='submit'><FormattedMessage id="Submit" /></Button>
            </Form>
            )}
          </TabPane>
          <TabPane tabId="2">
            {!isOtpSent && !isOtpVerified && (
            <Form className="form sign-up pt-0">
              <p className={`m-msg ${document.dir !== 'rtl' && 'text-start'}`}><FormattedMessage id="Please_enter_your_registered_mobile_number" /></p>
              <FormGroup className="c-input">
                <div className="fake-input" >
                  <div className="data-num" data-num='+91'>
                    <Input autoComplete="off" className={classNames({ 'hash-contain': mobileNumber, error: errMobileNumber }, 'data-nums')} data-nums='+91' disabled={isOtpSent || isOtpVerified} id="mobileNumber" onChange={(e) => { handleChange(e, 'MobileNumber') }} type='number' value={mobileNumber} />
                    <Label className="label m-0" for="mobileNumber"><FormattedMessage id="Mobile_Number" /></Label>
                    <span className='mobile-no-prefix' dir='ltr'>+91</span>
                  </div>
                </div>
                <p className="error-text">{errMobileNumber}</p>
              </FormGroup>
              <Button block color="primary" disabled={!isOtpVerified ? (email ? (errEmail || email === '') : (errMobileNumber || mobileNumber === '')) : (passwordErr || confirmPasswordErr || password === '' || confirmPassword === '')} hidden={isOtpSent && !isOtpVerified} onClick={sendOTP} type="submit"><FormattedMessage id="Submit" /></Button>
            </Form>
            )}
            {isOtpSent && !isOtpVerified && (
            <Form className="form pt-0">
              <p className={`m-msg ${document.dir !== 'rtl' && 'text-start'}`}>
                <FormattedMessage id="You_will_received_OTP_on" />
                <b dir='ltr'>
                  +91
                  {' '}
                  {handleInputValue(mobileNumber)}
                </b>
              </p>
              <FormGroup className="c-input">
                <div className="fake-input" >
                  <Input autoComplete='off' className={classNames({ 'hash-contain': otp, error: errOtp })} disabled={isOtpVerified} id="otp" onChange={(e) => { handleChange(e, 'OTP') }} type='number' value={otp} />
                  <Label className="label m-0" for="otp"><FormattedMessage id="OTP" /></Label>
                </div>
                <p className="error-text">{errOtp}</p>
              </FormGroup>
              <FormGroup className="c-input">
                <div className="fake-input" >
                  <Input autoComplete='off' className={classNames({ 'hash-contain': password, error: passwordErr })} id="password" onChange={(e) => { handleChange(e, 'PASSWORD') }} type={showPassword ? 'text' : 'password'} value={password} />
                  <div className='class-eye' onClick={() => setShowPassword(!showPassword)}>
                    <img src={showPassword ? eye : hidePassword} />
                  </div>
                  <Label className="label m-0" for="password"><FormattedMessage id="Password" /></Label>
                </div>
                <p className="error-text">{passwordErr}</p>
              </FormGroup>
              <FormGroup className="c-input">
                <div className="fake-input" >
                  <Input autoComplete='off' className={classNames({ 'hash-contain': confirmPassword, error: confirmPasswordErr })} id="confirmpassword" onChange={(e) => { handleChange(e, 'RE_PASSWORD') }} type={showRePassword ? 'text' : 'password'} value={confirmPassword} />
                  <div className='class-eye' onClick={() => setShowRePassword(!showRePassword)}>
                    <img src={showRePassword ? eye : hidePassword} />
                  </div>
                  <Label className="label m-0" for="confirmpassword"><FormattedMessage id="Confirm_Password" /></Label>
                </div>
                <p className="error-text">{confirmPasswordErr}</p>
              </FormGroup>
              <Button block color="primary" disabled={!otp || errOtp} hidden={!isOtpSent && !isOtpVerified} onClick={ForgetPassword} type='submit'><FormattedMessage id="Submit" /></Button>
            </Form>
            )}
          </TabPane>
        </TabContent>
        {title?.props?.id === 'Reset_Password' && (
        <div className="b-link">
          { minutes === 0 && seconds === 0
            ? <Button className='signup-text' color='link' onClick={sendOTP} title="Resend_OTP"><FormattedMessage id="Resend_OTP" /></Button>
            : (
              <p className='timer'>
                {minutes < 10 ? `0${minutes}` : minutes}
                :
                {seconds < 10 ? `0${seconds}` : seconds}
              </p>
              )
              }
        </div>
        )}
        {/* </div> */}
      </div>
    </>
  )
}
ForgotPasswordForm.propTypes = {
  setTitle: PropTypes.func,
  title: PropTypes.string
}

export default ForgotPasswordForm
