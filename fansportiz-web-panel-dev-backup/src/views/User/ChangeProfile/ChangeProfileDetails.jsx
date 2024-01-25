import React, { useEffect, useState, useRef, Fragment } from 'react'
import { Form, FormGroup, Label, Input, Alert, Button } from 'reactstrap'
import { isNumber, verifyEmail, verifyLength, verifyMobileNumber } from '../../../utils/helper'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import Loading from '../../../component/Loading'
import UserDetailsChange from '../../../HOC/User/UserDetailsChange'
import { useNavigate, useParams } from 'react-router-dom'
const classNames = require('classnames')
function ChangeProfileDetails (props) {
  const { resMessage, isCheckExist, setSendedOTP, updateProfile, messageType, loading, modalMessage, userInfo, onSendOTP, isChecked, onVerifyOTP, otpVerified, sendOtp } = props
  const [otp, setOtp] = useState('')
  const [errOtp, setErrOtp] = useState('')
  const [email, setEmail] = useState('')
  const [mobileNumber, setMobileNumber] = useState('')
  const [errEmail, setErrEmail] = useState('')
  const [durationTime, setDurationTime] = useState('')
  const [intervalRef, setIntervalRef] = useState(null)
  const [errNumber, setErrNumber] = useState('')
  const [sendedOtp, setSendedOtp] = useState(false)
  const previousProps = useRef({ otpVerified, isChecked }).current

  const { type } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    setErrEmail('')
    setErrNumber('')
  }, [])

  useEffect(() => { // handle the response
    if (userInfo) {
      setEmail(userInfo.sEmail)
      setMobileNumber(userInfo.sMobNum)
    }
  }, [userInfo])

  useEffect(() => { // handle the response
    if (sendedOtp) {
      changeClock()
      setTimeout(() => {
        setSendedOtp(false)
      }, 30000)
    }
  }, [sendedOtp])

  useEffect(() => { // handle the response
    if (previousProps.otpVerified !== otpVerified) {
      if (otpVerified) {
        updateProfile('w', 'data', { sEmail: email, sMobNum: mobileNumber })
        navigate('/profile/user-info', { state: { message: resMessage } })
        setSendedOTP(false)
      }
    }
    return () => {
      previousProps.otpVerified = otpVerified
    }
  }, [otpVerified])

  useEffect(() => { // handle the response
    if (previousProps.isChecked !== isChecked) {
      if (isChecked && !sendedOtp) {
        onSendOTP(type === 'email' ? email : type === 'mobile-number' && mobileNumber, type === 'email' ? 'E' : type === 'mobile-number' && 'M', 'V')
        setSendedOtp(true)
      }
    }
    return () => {
      previousProps.isChecked = isChecked
    }
  }, [isChecked])

  useEffect(() => { // handle the response
    if (messageType === 'M') {
      setErrNumber(<FormattedMessage id="Mobile_no_already_exist" />)
    }
    if (messageType === 'E') {
      setErrEmail(<FormattedMessage id="Email_already_exist" />)
    }
  }, [messageType])

  // set the values
  function handleChange (event, type) {
    switch (type) {
      case 'OTP':
        if (!isNaN(event.target.value)) {
          if (event.target.value.length === 4) {
            setErrOtp('')
          } else {
            if (event.target.value.length !== 4) {
              setErrOtp(<FormattedMessage id="OTP_length_validation" />)
            } else {
              setErrOtp(<FormattedMessage id="OTP_must_be_number" />)
            }
          }
          setOtp(event.target.value)
        }
        break
      case 'Email':
        if (verifyLength(event.target.value, 1) && verifyEmail(event.target.value)) {
          setErrEmail('')
        } else {
          if (event.target.value === '') {
            setErrEmail(<FormattedMessage id="Required_Email" />)
          } else {
            setErrEmail(<FormattedMessage id="Invalid_email" />)
          }
        }
        setEmail(event.target.value)
        break
      case 'PhoneNumber':
        if (isNumber(event.target.value) || !event.target.value) {
          if (event.target.value && verifyMobileNumber(event.target.value)) {
            setErrNumber('')
          } else {
            setErrNumber(<FormattedMessage id="Mobile_number_is_required" />)
          }
          setMobileNumber(event.target.value)
        }
        break
      default:
        break
    }
  }

  // check the validation apis
  function BlurFunction (value, type) {
    switch (type) {
      case 'Email':
        if (verifyLength(value, 1) && verifyEmail(value) && userInfo && (userInfo.sEmail !== value)) {
          isCheckExist('E', value)
        }
        break
      case 'PhoneNumber':
        if (verifyMobileNumber(value) && userInfo && (userInfo.sMobNum !== value)) {
          isCheckExist('M', value)
        }
        break
      default:
        break
    }
  }

  const handleSubmit = (e) => { // Check is exist or not
    e.preventDefault()
    if (type === 'Email') {
      isCheckExist('E', email)
    } else {
      isCheckExist('M', mobileNumber)
    }
  }

  const VerifiedOTP = (e) => {
    e.preventDefault()
    onVerifyOTP(type === 'email' ? email : type === 'mobile-number' && mobileNumber, type === 'email' ? 'E' : type === 'mobile-number' && 'M', 'V', otp)
  }

  const changeClock = () => {
    let duration = 30
    if (duration > 0) {
      setIntervalRef(
        setInterval(() => {
          if (duration >= 0) {
            setDurationTime(duration)
            duration = duration - 1
          }
        }, 1000)
      )
    }
    return () => {
      clearInterval(intervalRef)
    }
  }
  return (
    <>
      {loading && <Loading />}
      {modalMessage ? <Alert color="primary" isOpen={modalMessage}>{resMessage}</Alert> : ''}
      <div className="user-container bg-white">
        <Form className="form sign-up pb-0">
          {
          type === 'email'
            ? (
              <Fragment>
                <FormGroup className="c-input">
                  <Input autoComplete='off' className={classNames('bg-white', { 'hash-contain': email, error: errEmail })} id="Email" name="sEmail" onBlur={(e) => { BlurFunction(e, 'Email') }} onChange={(e) => { handleChange(e, 'Email') }} type="email" value={email}/>
                  <Label className="no-change label m-0" for="Email"><FormattedMessage id="Email" /></Label>
                  <p className="error-text">{errEmail}</p>
                </FormGroup>
              </Fragment>
              )
            : (
              <Fragment>
                <FormGroup className="c-input">
                  <Input autoComplete='off' className={classNames('bg-white', 'hidden-border', { 'hash-contain': mobileNumber, error: errNumber })} id="MobileNumber" maxLength={10} name="sMobNum" onBlur={(e) => { BlurFunction(e, 'PhoneNumber') }} onChange={(e) => { handleChange(e, 'PhoneNumber') }} type="text" value={mobileNumber}/>
                  <Label className="no-change label m-0" for="MobileNumber"><FormattedMessage id="Mobile_Number" /></Label>
                  <p className="error-text">{errNumber}</p>
                </FormGroup>
              </Fragment>
              )
        }
          {sendOtp && !otpVerified && (
          <Fragment>
            <FormGroup className="c-input">
              <Input autoComplete='off' autoFocus className={classNames({ 'hash-contain': otp, error: errOtp }) } disabled={otpVerified} id="otp" maxLength={4} onChange={(e) => { handleChange(e, 'OTP') }} value={otp} />
              <p className="error-text">{errOtp}</p>
              <Label className="label m-0" for="otp"><FormattedMessage id="OTP" /></Label>
              <div className="text-end ">
                <Button className="forgot-link bluecolor" color="link" disabled={!!sendedOtp} onClick={handleSubmit}>
                  {' '}
                  <FormattedMessage id="Resen_OTP" />
                  {' '}
                  {(durationTime > 0)
                    ? (
                      <span>
                        <FormattedMessage id="In" />
                        {' '}
                        {`${durationTime}`}
                        {' '}
                        <FormattedMessage id="Sec" />
                      </span>
                      )
                    : ''}
                </Button>
              </div>
            </FormGroup>
            <Button block color="primary" disabled={!otp || errOtp} hidden={otpVerified} onClick={VerifiedOTP}><FormattedMessage id="Verify_OTP" /></Button>
          </Fragment>
          )
        }
          <div className="f-bottom w-padding text-center">
            <Button block
              color="primary-two"
              disabled={errEmail || errNumber}
              hidden={sendOtp && !otpVerified}
              onClick={handleSubmit}
              type="submit"
            >
              <FormattedMessage id="Get_OTP" />
            </Button>
          </div>
        </Form>
      </div>
    </>
  )
}
ChangeProfileDetails.propTypes = {
  UpdateProfile: PropTypes.func,
  resMessage: PropTypes.string,
  token: PropTypes.string,
  resStatus: PropTypes.bool,
  userInfo: PropTypes.shape({
    sEmail: PropTypes.string,
    sMobNum: PropTypes.string
  }),
  history: PropTypes.shape({
    push: PropTypes.func
  }),
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
      type: PropTypes.string
    })
  }),
  loading: PropTypes.bool,
  sendOtp: PropTypes.bool,
  otpVerified: PropTypes.bool,
  isChecked: PropTypes.bool,
  modalMessage: PropTypes.func,
  getUserProfile: PropTypes.func,
  updateProfile: PropTypes.func,
  setLoading: PropTypes.func,
  onSendOTP: PropTypes.func,
  isCheckExist: PropTypes.func,
  messageType: PropTypes.string,
  onVerifyOTP: PropTypes.func,
  setSendedOTP: PropTypes.func
}
export default UserDetailsChange(ChangeProfileDetails)
