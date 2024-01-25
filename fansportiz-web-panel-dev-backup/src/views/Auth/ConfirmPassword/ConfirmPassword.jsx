import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import {
  Alert, Button, Form, FormGroup, Input, Label
} from 'reactstrap'
import classNames from 'classnames'
import {
  handleInputValue, verifyEmail, verifyLength, verifyMobileNumber, verifyPassword
} from '../../../utils/helper'
import hidePassword from '../../../assests/images/hidePasswordEye.svg'
import eye from '../../../assests/images/showPasswordEye.svg'
import { useLocation } from 'react-router-dom'
import useRegister from '../../../api/auth/mutations/useRegister'
import useVerifyOTP from '../../../api/auth/mutations/useVerifyOTP'
import useSendOTP from '../../../api/auth/mutations/useSendOTP'

function ConfirmPassword () {
  const { state } = useLocation()

  const [sendedOtp, setSendedOtp] = useState(false)
  const [otp, setOTP] = useState('')
  const [otpErr, setOtpErr] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordErr, setPasswordErr] = useState('')
  const [confirmPasswordErr, setConfirmPasswordErr] = useState('')
  const [socialToken, setSocialToken] = useState('')
  const [intervalRef, setIntervalRef] = useState(null)
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(60)
  const [showPassword, setShowPassword] = useState(false)
  const [showRePassword, setShowRePassword] = useState(false)
  const [registerData, setRegisterData] = useState({})
  const [message, setMessage] = useState('')
  const [modalMessage, setModalMessage] = useState(false)
  const data = state
  const FirebaseToken = localStorage.getItem('FirebaseToken')
  const deviceId = localStorage.getItem('ID')

  const { mutate: RegistrationMutation } = useRegister({ setMessage, setModalMessage })
  const { mutate: VerifyOTPMutation } = useVerifyOTP({
    setMessage,
    setModalMessage,
    authType: 'R',
    Mutation: RegistrationMutation,
    userData: { FirebaseToken, Platform: 'W', sUsername: registerData?.userName, sEmail: registerData?.email, sMobNum: registerData?.mobileNumber, sPassword: password, sCode: otp, sReferCode: registerData?.referralCode, sDeviceId: deviceId, sSocialToken: socialToken, aPolicyId: registerData?.policyIds }
  })
  const { mutate: SendOTPMutation } = useSendOTP({ setMessage, setModalMessage })

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

  useEffect(() => {
    if (data?.mobileNumber && data?.userName && data?.email) {
      if (verifyMobileNumber(data?.mobileNumber) &&
        verifyLength(data?.userName, 3) &&
        verifyEmail(data?.email)) {
        SendOTPMutation({ mobileNumber: data?.mobileNumber, sType: 'M', sAuth: 'R' })
        setSendedOtp(true)
      }
    }
    if (state?.socialRegisterData) {
      setSocialToken(state.token)
    }
    if (data) {
      setRegisterData(data)
    }
  }, [])

  const changeClock = () => {
    let duration = 30
    if (duration > 0) {
      setIntervalRef(
        setInterval(() => {
          if (duration >= 0) {
            duration -= 1
          }
        }, 1000)
      )
    }
    return () => {
      clearInterval(intervalRef)
    }
  }

  useEffect(() => {
    if (sendedOtp) {
      changeClock()
      setTimeout(() => {
        setSendedOtp(false)
      }, 30000)
    }
  }, [sendedOtp])

  function sendOtp () {
    if (verifyMobileNumber(data?.mobileNumber) && verifyLength(data?.userName, 3) && verifyEmail(data?.email)) {
      SendOTPMutation({ mobileNumber: data?.mobileNumber, sType: 'M', sAuth: 'R' })
      setSendedOtp(true)
      setMinutes(0)
      setSeconds(60)
    }
  }

  function VerifiedOTP (e) {
    e.preventDefault()
    if (otp && password && confirmPassword && otp.length >= 4 && otp.length <= 6 && (password === confirmPassword && verifyPassword(password) && verifyPassword(confirmPassword))) {
      VerifyOTPMutation({ mobileNumber: data?.mobileNumber, sType: 'M', sAuth: 'R', sCode: otp, ID: deviceId, FirebaseToken })
    } else {
      if (password !== confirmPassword) {
        setMessage(<FormattedMessage id="Password_and_confirm_password_must_be_same" />)
        setModalMessage(true)
      } else if (!verifyPassword(confirmPassword)) setConfirmPasswordErr(<FormattedMessage id="Password_must_be_8_to_15_characters" />)
      else if (!verifyPassword(password)) setPasswordErr(<FormattedMessage id="Password_must_be_8_to_15_characters" />)

      if (otp.length < 4 || otp.length > 6) setOtpErr(<FormattedMessage id="OTP_length_validation" />)
    }
  }

  function handleChange (event, type) {
    setModalMessage(false)
    switch (type) {
      case 'PASSWORD':
        setPasswordErr('')
        setPassword(event.target.value)
        break
      case 'CONFIRM_PASSWORD':
        setConfirmPasswordErr('')
        setConfirmPassword(event.target.value)
        break
      case 'OTP':
        setOtpErr('')
        setOTP(event.target.value)
        break
      default:
        break
    }
  }

  useEffect(() => {
    if (modalMessage) {
      setTimeout(() => {
        setModalMessage(false)
      }, 2000)
    }
  }, [modalMessage])

  return (
    <>
      {modalMessage
        ? <Alert color="primary" isOpen={modalMessage}>{message}</Alert>
        : ''}
      <Form className="form sign-up pt-0">
        {data?.mobileNumber && (
        <p className="m-msg">
          <FormattedMessage id="Please_enter_the_OTP_to_verify_account" />
          +91
          {' '}
          {handleInputValue(data?.mobileNumber)}
          .
        </p>
        )}
        <FormGroup className="c-input">
          <Input autoFocus className={classNames({ 'hash-contain': otp, error: otpErr, 'mt-4': true })} id="otp" maxLength={6} onChange={(e) => { handleChange(e, 'OTP') }} required type='number' value={otp} />
          <Label className="label m-0" for="otp"><FormattedMessage id="OTP" /></Label>
          <p className="error-text">{otpErr}</p>
        </FormGroup>
        <FormGroup className="c-input">
          <Input autoComplete="off" className={classNames({ 'hash-contain': password, error: passwordErr })} id="password" onChange={(e) => { handleChange(e, 'PASSWORD') }} required type={showPassword ? 'text' : 'password'} value={password} />
          <div className="class-eye" onClick={() => setShowPassword(!showPassword)} onFocus={(e) => e.preventDefault} onKeyDown={(e) => e.preventDefault()} role="button" tabIndex={0}>
            <img alt="" src={showPassword ? eye : hidePassword} />
          </div>
          <Label className="label m-0" for="password"><FormattedMessage id="Password" /></Label>
          <p className="error-text">{passwordErr}</p>
        </FormGroup>
        <FormGroup className="c-input">
          <Input autoComplete="off" className={classNames({ 'hash-contain': confirmPassword, error: confirmPasswordErr })} id="confirmPassword" onChange={(e) => { handleChange(e, 'CONFIRM_PASSWORD') }} required type={showRePassword ? 'text' : 'password'} value={confirmPassword} />
          <div className="class-eye" onClick={() => setShowRePassword(!showRePassword)} onFocus={(e) => e.preventDefault()} onKeyDown={(e) => e.preventDefault()} role="button" tabIndex={0}>
            <img alt="" src={showRePassword ? eye : hidePassword} />
          </div>
          <Label className="label m-0" for="confirmPassword"><FormattedMessage id="Confirm_Password" /></Label>
          <p className="error-text">{confirmPasswordErr}</p>
        </FormGroup>
        <div className="text-center">
          <Button block color="primary" disabled={!otp || !password || !confirmPassword} onClick={VerifiedOTP} title="Get Started" type="submit"><FormattedMessage id="Get_Started" /></Button>
          <div className="b-link">
            { minutes === 0 && seconds === 0
              ? <Button className="signup-text" color="link" onClick={sendOtp} title="Resend_OTP"><FormattedMessage id="Resend_OTP" /></Button>
              : (
                <p className="timer">
                  {minutes < 10 ? `0${minutes}` : minutes}
                  :
                  {seconds < 10 ? `0${seconds}` : seconds}
                </p>
                )}
          </div>
        </div>
      </Form>
    </>
  )
}

export default ConfirmPassword
