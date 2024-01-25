import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { VerificationSendOTP, VerificationVerifyOTP } from '../../redux/actions/auth.js'
import { UpdateUserProfile } from '../../redux/actions/profile'
import storage from '../../localStorage/localStorage'

function Verification (Component) {
  function MyComponent (props) {
    const dispatch = useDispatch()

    const [message, setMessage] = useState('')
    const [modalMessage, setModalMessage] = useState(false)
    const [verifiedOtp, setVerified] = useState(false)
    const [sendedOTP, setSendedOTP] = useState(false)

    const token = useSelector((state) => state.auth.token)
    const resStatus = useSelector((state) => state.auth.resStatus)
    const resMessage = useSelector((state) => state.auth.resMessage)
    const sendOtp = useSelector((state) => state.auth.sendOtp)
    const otpVerified = useSelector((state) => state.auth.otpVerified)
    const userInfo = useSelector((state) => state.auth.userData)
    const FirebaseToken = useSelector((state) => state.auth.FirebaseToken)
    const [loading, setLoading] = useState(false)
    const previousProps = useRef({ resStatus, resMessage, otpVerified }).current

    useEffect(() => {
      setSendedOTP(false)
      setVerified(false)
    }, [])

    useEffect(() => {
      if (previousProps.sendOtp !== sendOtp) {
        if (sendOtp) {
          setSendedOTP(sendOtp)
          setLoading(false)
        }
      }
      return () => {
        previousProps.sendOtp = sendOtp
      }
    }, [sendOtp])

    useEffect(() => {
      if (previousProps.otpVerified !== otpVerified) {
        if (otpVerified !== null) {
          setVerified(otpVerified)
          setLoading(false)
        }
      }
      return () => {
        previousProps.otpVerified = otpVerified
      }
    }, [otpVerified])

    useEffect(() => {
      if (previousProps.resMessage !== resMessage) {
        if (resMessage) {
          setLoading(false)
          setModalMessage(true)
          setMessage(resMessage)
          setTimeout(() => setModalMessage(false), 3000)
        }
      }
      return () => {
        previousProps.resMessage = resMessage
      }
    }, [resStatus, resMessage])

    function updateProfile (platform, type, userData) {
      if (token) {
        dispatch(UpdateUserProfile(platform, type, userData, token))
        setLoading(true)
      }
    }

    function onSendOTP (mobileNumber, Type, Auth) {
      if (token) {
        dispatch(VerificationSendOTP(mobileNumber, Type, Auth, token))
        setLoading(true)
      }
    }

    function onVerifyOTP (mobileNumber, Type, Auth, sCode) {
      const deviceId = storage.getItem('ID')
      token && dispatch(VerificationVerifyOTP(mobileNumber, Type, Auth, sCode, deviceId, token, FirebaseToken))
    }

    return (
      <Component
        {...props}
        loading={loading}
        message={message}
        modalMessage={modalMessage}
        onSendOTP={onSendOTP}
        onVerifyOTP={onVerifyOTP}
        otpVerified={verifiedOtp}
        resMessage={resMessage}
        resStatus={resStatus}
        sendOtp={sendedOTP}
        setLoading={setLoading}
        updateProfile={updateProfile}
        userInfo={userInfo}
      />
    )
  }
  MyComponent.displayName = MyComponent
  return MyComponent
}

export default Verification
