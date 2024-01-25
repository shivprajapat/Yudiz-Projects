import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  sendOTP, VerifyOTP, Registration, CheckExist
} from '../../redux/actions/auth.js'
import storage from '../../localStorage/localStorage'

function RegisterPage (Component) {
  function MyComponent (props) {
    const dispatch = useDispatch()
    const [message, setMessage] = useState('')
    const [modalMessage, setModalMessage] = useState(false)
    const [loading, setLoading] = useState(false)
    const [sendedOTP, setSendedOTP] = useState(false)
    const [registerData, setRegisterData] = useState({})
    const [otpDone, setOtpDone] = useState(false)

    const resStatus = useSelector((state) => state.auth.resStatus)
    const resMessage = useSelector((state) => state.auth.resMessage)
    const messageType = useSelector((state) => state.auth.messageType)
    const FirebaseToken = useSelector((state) => state.auth.FirebaseToken)
    const otpVerified = useSelector((state) => state.auth.otpVerified)
    const registerSuccess = useSelector((state) => state.auth.registerSuccess)
    const sendOtp = useSelector((state) => state.auth.sendOtp)
    const previousProps = useRef({
      resMessage, resStatus, sendOtp, registerSuccess, otpVerified
    }).current
    useEffect(() => {
      if (previousProps.sendOtp !== sendOtp) {
        if (sendOtp) {
          setLoading(false)
        }
        setSendedOTP(sendOtp)
      }
      return () => {
        previousProps.sendOtp = sendOtp
      }
    }, [sendOtp])

    useEffect(() => {
      if (previousProps.registerSuccess !== registerSuccess) {
        if (registerSuccess) {
          setLoading(false)
        }
      }
      return () => {
        previousProps.registerSuccess = registerSuccess
      }
    }, [registerSuccess])

    useEffect(() => { // handle Api response
      // if (previousProps.otpVerified !== otpVerified) {
      if (otpVerified) {
        if (Object.keys(registerData).length > 0) {
          const deviceId = storage.getItem('ID')
          Registrationfun(registerData.Platform, registerData.userName, registerData.email, registerData.mobileNumber, registerData.Password, registerData.otp, registerData.referralCode, deviceId, registerData.socialToken, registerData.policyIds)
          setLoading(true)
        }
      } else {
        setMessage(resMessage)
        setModalMessage(true)
      }
      // }
    }, [otpVerified, otpDone])

    useEffect(() => {
      if (previousProps.resMessage !== resMessage) {
        if (resMessage) {
          if (messageType) {
            setMessage('')
            setModalMessage(false)
            setLoading(false)
          } else {
            setMessage(resMessage)
            if (resStatus) {
              setModalMessage(true)
              setLoading(false)
            }
          }
        }
      }
      return () => {
        previousProps.resMessage = resMessage
      }
    }, [resStatus, resMessage])

    useEffect(() => {
      if (modalMessage) {
        setTimeout(() => {
          setModalMessage(false)
        }, 2000)
      }
    }, [modalMessage])

    function SendOTPFun (mobileNumber, Auth) {
      dispatch(sendOTP(mobileNumber, 'M', Auth))
      setSendedOTP(true)
      setLoading(true)
    }

    function VerifyOTPFun (mobileNumber, Auth, sCode, data) {
      setRegisterData(data)
      const deviceId = storage.getItem('ID')
      if (!otpDone) {
        dispatch(VerifyOTP(mobileNumber, 'M', Auth, sCode, deviceId, FirebaseToken))
        setLoading(true)
      }
    }
    // Register
    function Registrationfun (Platform, userName, email, mobileNumber, Password, sCode, referralCode, loginID, socialToken, policyIds) {
      dispatch(Registration(FirebaseToken, Platform, userName, email, mobileNumber, Password, sCode, referralCode, loginID, socialToken, policyIds))
      setLoading(true)
    }

    function CheckExistFunc (type, value) {
      if (type && value && value.length > 0) {
        dispatch(CheckExist(type, value))
      }
    }

    return (
      <Component
        {...props}
        CheckExistFunc={CheckExistFunc}
        Registration={Registrationfun}
        SendOTP={SendOTPFun}
        VerifyOTP={VerifyOTPFun}
        loading={loading}
        message={message}
        messageType={messageType}
        modalMessage={modalMessage}
        otpDone={otpDone}
        otpVerified={otpVerified}
        registerSuccess={registerSuccess}
        resMessage={resMessage}
        resStatus={resStatus}
        sendOtp={sendOtp}
        sendedOTP={sendedOTP}
        setMessage={setMessage}
        setModalMessage={setModalMessage}
        setOtpDone={setOtpDone}
      />
    )
  }
  MyComponent.displayName = MyComponent
  return MyComponent
}

export default RegisterPage
