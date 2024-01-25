import React, { useEffect, useState } from 'react'
// import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import {
  Button, Form, FormGroup, Input, Label, Alert
} from 'reactstrap'
import { handleInputValue, isNumber, verifyEmail } from '../../../utils/helper'
import Loading from '../../../component/Loading'
import useLogin from '../../../api/auth/mutations/useLogin'
import useSendOTP from '../../../api/auth/mutations/useSendOTP'
import useVerifyOTP from '../../../api/auth/mutations/useVerifyOTP'
import { useLocation } from 'react-router-dom'
const classNames = require('classnames')

function VerificationForm () {
  const { state: { userName, Password, profile } } = useLocation()
  const [otp, setOTP] = useState('')
  const [errOtp, setErrOtp] = useState('')
  const [intervalRef, setIntervalRef] = useState(null)
  const [sendedOtp, setSendedOtp] = useState(true)
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(60)
  const [message, setMessage] = useState('')
  const [modalMessage, setModalMessage] = useState(false)
  const deviceId = localStorage.getItem('ID')
  const FirebaseToken = localStorage.getItem('FirebaseToken')

  const { mutate: login, isLoading: loginLoading } = useLogin({ setMessage, setModalMessage, userName: userName, Password: Password })
  const { mutate: SendOTPMutation, isLoading: sendOtpLoading } = useSendOTP({ setMessage, setModalMessage })
  const { mutate: VerifyOTPMutation } = useVerifyOTP({
    setMessage,
    setModalMessage,
    authType: profile ? 'V' : 'L',
    Mutation: login,
    userData: { FirebaseToken, Platform: 'W', userName: userName, Password: Password, loginID: deviceId }
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

  function ResendOtpProfile () {
    if (userName && profile) {
      SendOTPMutation({ mobileNumber: userName, sType: verifyEmail(userName) ? 'E' : 'M', sAuth: 'V' })
      setSendedOtp(true)
      setMinutes(0)
      setSeconds(60)
    }
  }

  function ResendOtpLogin () {
    if (Password && userName) {
      login({ FirebaseToken, Platform: 'W', userName: userName, Password: Password, loginID: deviceId })
      setSendedOtp(true)
      setMinutes(0)
      setSeconds(60)
    }
  }

  useEffect(() => {
    if (profile) {
      ResendOtpProfile()
    }
  }, [profile])

  function handleChange (event, type) {
    setModalMessage(false)
    switch (type) {
      case 'OTP':
        setErrOtp('')
        setOTP(event.target.value)
        break
      default:
        break
    }
  }

  function VerifyLoginOtp (e) {
    if (otp) {
      if (isNumber(otp) && otp.length >= 4 && otp.length <= 6) {
        setErrOtp('')
        VerifyOTPMutation({ mobileNumber: userName, sType: verifyEmail(userName) ? 'E' : 'M', sAuth: 'L', sCode: otp, ID: deviceId, FirebaseToken })
      } else if (otp.length < 4 || otp.length > 6) {
        setErrOtp(<FormattedMessage id="OTP_length_validation" />)
      } else {
        setErrOtp(<FormattedMessage id="OTP_must_be_number" />)
      }
      e.preventDefault()
    }
  }

  const VerifyProfileOTP = (e) => {
    e.preventDefault()
    VerifyOTPMutation({ mobileNumber: userName, sType: verifyEmail(userName) ? 'E' : 'M', sAuth: 'V', sCode: otp, ID: deviceId, FirebaseToken })
  }

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

  return (
    <>
      {modalMessage
        ? (
          <Alert color="primary" isOpen={modalMessage}>{message}</Alert>
          )
        : ''}
      {(loginLoading || sendOtpLoading) && <Loading />}
      <Form className="form sign-up ">
        {userName
          ? (
            <p className={`m-msg ${document.dir !== 'rtl' && 'text-start'}`}>
              <FormattedMessage id="Please_enter_the_OTP_to_verify_your_account" />
              {verifyEmail(userName) ? '' : '+91'}
              {handleInputValue(userName)}
            </p>
            )
          : ''}
        <FormGroup className="c-input">
          <Input autoFocus autocomplete="off" className={classNames({ 'hash-contain': otp })} id="otp" onChange={(e) => { handleChange(e, 'OTP') }} type="number" />
          <p className="error-text">{errOtp}</p>
          <Label className="label m-0" for="otp"><FormattedMessage id="OTP" /></Label>
        </FormGroup>
        <Button block color="primary" disabled={!otp || errOtp} onClick={profile ? VerifyProfileOTP : VerifyLoginOtp} type="submit"><FormattedMessage id="Verify" /></Button>
        <div className="b-link">
          {minutes === 0 && seconds === 0
            ? <Button className="signup-text" color="link" onClick={profile ? ResendOtpProfile : ResendOtpLogin} title="Resend_OTP"><FormattedMessage id="Resend_OTP" /></Button>
            : (
              <p className="timer">
                {minutes < 10 ? `0${minutes}` : minutes}
                :
                {seconds < 10 ? `0${seconds}` : seconds}
              </p>
              )}
        </div>
      </Form>
    </>
  )
}

VerificationForm.propTypes = {
}

export default VerificationForm
