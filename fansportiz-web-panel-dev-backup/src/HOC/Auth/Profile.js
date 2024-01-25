import React, { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ChangePassword } from '../../redux/actions/profile'

export const Profile = (Component) => {
  const MyComponent = (props) => {
    const dispatch = useDispatch()
    const [modalMessage, setModalMessage] = useState(false)
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)

    const resStatus = useSelector(state => state.profile.resStatus)
    const resMessage = useSelector(state => state.profile.resMessage)
    const nChangedPassword = useSelector(state => state.profile.nChangedPassword)
    const previousProps = useRef({ resMessage, resStatus, nChangedPassword }).current

    const token = useSelector(state => state.auth.token) || localStorage.getItem('Token')

    useEffect(() => {
      if (modalMessage) {
        setTimeout(() => {
          setModalMessage(false)
        }, 2000)
      }
    }, [modalMessage])

    useEffect(() => {
      if (previousProps.resMessage !== resMessage) {
        if (resMessage) {
          setMessage(resMessage)
          setLoading(false)
          setModalMessage(true)
        }
      }
      return () => {
        previousProps.resMessage = resMessage
      }
    }, [resStatus, resMessage])

    function ChangePasswordfun (oldPassword, newPassword) {
      if (token) {
        dispatch(ChangePassword(oldPassword, newPassword, token))
        setLoading(true)
      }
    }

    return (
      <Component
        {...props}
        ChangePassword={ChangePasswordfun}
        loading={loading}
        message={message}
        modalMessage={modalMessage}
        nChangedPassword={nChangedPassword}
        resMessage={resMessage}
        resStatus={resStatus}
      />
    )
  }
  MyComponent.displayName = MyComponent
  return MyComponent
}

export default Profile
