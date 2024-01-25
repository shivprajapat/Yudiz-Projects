import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { VerificationSendOTP, VerificationVerifyOTP, CheckExist } from '../../redux/actions/auth.js'
import { UpdateUserProfile, GetUserProfile } from '../../redux/actions/profile'
import storage from '../../localStorage/localStorage'
export const UserDetailsChange = (Component) => {
  const MyComponent = (props) => {
    const dispatch = useDispatch()
    const [modalMessage, setModalMessage] = useState(false)
    const [verifiedOtp, setVerified] = useState(false)
    const [sendedOTP, setSendedOTP] = useState(false)

    const token = useSelector(state => state.auth.token) || localStorage.getItem('Token')
    const resStatus = useSelector(state => state.auth.resStatus)
    const resMessage = useSelector(state => state.auth.resMessage)
    const sendOtp = useSelector(state => state.auth.sendOtp)
    const otpVerified = useSelector(state => state.auth.otpVerified)
    const isChecked = useSelector(state => state.auth.isChecked)
    const userInfo = useSelector(state => state.profile.userInfo)
    const FirebaseToken = useSelector(state => state.auth.FirebaseToken)
    const messageType = useSelector(state => state.auth.messageType)
    const [loading, setLoading] = useState(false)
    const previousProps = useRef({ userInfo, resStatus, resMessage, otpVerified, isChecked, sendOtp }).current

    useEffect(() => {
      setSendedOTP(false)
      setVerified(false)
    }, [])

    useEffect(() => {
      getUserProfile()
    }, [token])

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
        if (otpVerified) {
          setVerified(otpVerified)
          setLoading(false)
        }
      }
      return () => {
        previousProps.otpVerified = otpVerified
      }
    }, [otpVerified])

    useEffect(() => {
      if (previousProps.userInfo !== userInfo) {
        if (userInfo) {
          setLoading(false)
        }
      }
      return () => {
        previousProps.userInfo = userInfo
      }
    }, [userInfo])

    useEffect(() => {
      if (previousProps.resMessage !== resMessage) {
        if (resMessage) {
          setLoading(false)
          setModalMessage(true)
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
      if (token) {
        dispatch(VerificationVerifyOTP(mobileNumber, Type, Auth, sCode, deviceId, token, FirebaseToken))
        setLoading(true)
      }
    }

    function isCheckExist (type, value) {
      if (type && value && value.length > 0) {
        dispatch(CheckExist(type, value))
      }
    }

    function getUserProfile () {
      if (token) {
        dispatch(GetUserProfile(token))
        setLoading(true)
      }
    }

    return (
      <Component
        {...props}
        isCheckExist={isCheckExist}
        isChecked={isChecked}
        loading={loading}
        messageType={messageType}
        modalMessage={modalMessage}
        onSendOTP={onSendOTP}
        onVerifyOTP={onVerifyOTP}
        otpVerified={verifiedOtp}
        resMessage={resMessage}
        resStatus={resStatus}
        sendOtp={sendedOTP}
        setLoading={setLoading}
        setSendedOTP={setSendedOTP}
        updateProfile={updateProfile}
        userInfo={userInfo}
      />
    )
  }
  MyComponent.displayName = MyComponent
  return MyComponent
}
export default UserDetailsChange
