import React, { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import storage from '../../localStorage/localStorage'
import { sendOTP, VerifyOTP, ForgotPassword } from '../../redux/actions/auth'

const ForgotPass = (Component) => {
  function MyComponent () {
    const dispatch = useDispatch()
    const [verifiedOtp, setVerified] = useState(false)
    const [sendedOTP, setSendedOTP] = useState(false)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [modalMessage, setModalMessage] = useState(false)
    const resStatus = useSelector((state) => state.auth.resStatus)
    const resMessage = useSelector((state) => state.auth.resMessage)
    const sendOtp = useSelector((state) => state.auth.sendOtp)
    const otpVerified = useSelector((state) => state.auth.otpVerified)
    const FirebaseToken = useSelector((state) => state.auth.FirebaseToken)

    const previousProps = useRef({
      resMessage, resStatus, otpVerified, sendOtp
    }).current

    useEffect(() => {
      if (previousProps.sendOtp !== sendOtp && sendOtp) {
        setSendedOTP(sendOtp)
        setLoading(false)
      }
      return () => {
        previousProps.sendOtp = sendOtp
      }
    }, [sendOtp])

    useEffect(() => {
      if (previousProps.otpVerified !== otpVerified && otpVerified) {
        setVerified(otpVerified)
        setLoading(false)
      }
      return () => {
        previousProps.otpVerified = otpVerified
      }
    }, [otpVerified])

    useEffect(() => {
      if (previousProps.resMessage !== resMessage && resMessage) {
        setMessage(resMessage)
        setModalMessage(true)
        setLoading(false)
      }
      return () => {
        previousProps.resMessage = resMessage
      }
    }, [resStatus, resMessage])

    useEffect(() => {
      if (message) {
        setTimeout(() => setModalMessage(false), 3000)
      }
    }, [message])

    function ForgotPasswordFunc (userName, Auth, Type, Code, Password) {
      dispatch(ForgotPassword(userName, Auth, Type, Code, Password))
    }

    function SendOTPFun (mobileNumber, Type, Auth) {
      dispatch(sendOTP(mobileNumber, Type, Auth))
    }

    function VerifyOTPFun (mobileNumber, Type, Auth, sCode) {
      const deviceId = storage.getItem('ID')
      dispatch(VerifyOTP(mobileNumber, Type, Auth, sCode, deviceId, FirebaseToken))
    }

    return (
      <Component
        resStatus={resStatus}
        otpVerified={otpVerified}
        setSendedOTP={setSendedOTP}
        setLoading={setLoading}
        resMessage={resMessage}
        ForgotPassword={ForgotPasswordFunc}
        verifiedOtp={verifiedOtp}
        VerifyOTP={VerifyOTPFun}
        SendOTP={SendOTPFun}
        sendOtpFlag={sendOtp}
        otpVerifiedFlag={otpVerified}
        sendedOTP={sendedOTP}
        loading={loading}
        message={message}
        modalMessage={modalMessage}
        setModalMessage={setModalMessage}
      />
    )
  }
  MyComponent.displayName = MyComponent
  return MyComponent
}

export default ForgotPass
