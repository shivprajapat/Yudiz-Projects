import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { Login, VerifyOTP } from '../../redux/actions/auth.js'
import storage from '../../localStorage/localStorage'
import { useLocation, useNavigate } from 'react-router-dom'

function VerificationPage (Component) {
  function MyComponent (props) {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [modalMessage, setModalMessage] = useState(false)
    const [user, setuser] = useState('')
    const [pass, setPass] = useState('')
    const [PlatForm, setPlatForm] = useState('')
    const resStatus = useSelector((state) => state.auth.resStatus)
    const resMessage = useSelector((state) => state.auth.resMessage)
    const token = useSelector((state) => state.auth.token)
    const userData = useSelector((state) => state.auth.userData)
    const loginUser = useSelector((state) => state.auth.loginUser)
    const FirebaseToken = useSelector((state) => state.auth.FirebaseToken)
    const loginPass = useSelector((state) => state.auth.loginPass)
    const otpVerified = useSelector((state) => state.auth.otpVerified)
    const previousProps = useRef({ resMessage, resStatus }).current

    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => { // set the value
      loginUser && loginUser.length && setuser(loginUser)
      loginPass && loginPass.length && setPass(loginPass)
    }, [loginUser, loginPass])

    function doLogin () {
      const deviceId = storage.getItem('ID')
      Loginfun(user, pass, deviceId, PlatForm)
      setLoading(true)
    }

    useEffect(() => {
      if (previousProps.resMessage !== resMessage) {
        if (otpVerified === true && resStatus && previousProps.otpVerified !== otpVerified) {
          if (location?.state?.profile) {
            navigate('/profile', { state: { message: resMessage } })
          } else {
            doLogin()
          }
        } else {
          if (resMessage) {
            setMessage(resMessage)
            setModalMessage(true)
          }
          setLoading(false)
        }
      }
      return () => {
        previousProps.resMessage = resMessage
        previousProps.otpVerified = otpVerified
      }
    }, [resStatus, resMessage, otpVerified])

    useEffect(() => {
      if (modalMessage) {
        setTimeout(() => {
          setModalMessage(false)
          setLoading(false)
        }, 2000)
      }
    }, [modalMessage])

    function Loginfun (userName, password, loginID, platForm) {
      loginID && dispatch(Login(FirebaseToken, platForm, userName, password, loginID))
    }

    function VerifyOTPFun (Type, Auth, sCode, platFormData) {
      const deviceId = storage.getItem('ID')
      setPlatForm(platFormData)
      dispatch(VerifyOTP(user, Type, Auth, sCode, deviceId, FirebaseToken))
      setLoading(true)
    }

    return (
      <Component
        {...props}
        Login={Loginfun}
        VerifyOTP={VerifyOTPFun}
        loading={loading}
        message={message}
        modalMessage={modalMessage}
        otpVerified={otpVerified}
        resMessage={resMessage}
        resStatus={resStatus}
        setModalMessage={setModalMessage}
        token={token}
        user={user}
        userData={userData}
      />
    )
  }
  MyComponent.propTypes = {
    location: PropTypes.object,
    history: PropTypes.object
  }
  MyComponent.displayName = MyComponent
  return MyComponent
}

export default VerificationPage
