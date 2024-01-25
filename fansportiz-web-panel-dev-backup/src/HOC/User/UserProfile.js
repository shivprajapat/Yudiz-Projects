import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { GetUserProfile, UpdateUserProfile, getPreferenceDetails, UpdatePreferenceDetails } from '../../redux/actions/profile'
export const UserProfile = (Component) => {
  const MyComponent = (props) => {
    const dispatch = useDispatch()
    const [modalMessage, setModalMessage] = useState(false)

    const token = useSelector(state => state.auth.token) || localStorage.getItem('Token')
    const resStatus = useSelector(state => state.profile.resStatus)
    const resMessage = useSelector(state => state.profile.resMessage)
    const userInfo = useSelector(state => state.profile.userInfo)
    const stateList = useSelector(state => state.profile.stateList)
    const isUpdatedProfile = useSelector(state => state.profile.isUpdatedProfile)
    const cityList = useSelector(state => state.profile.cityList)
    const preferenceDetails = useSelector(state => state.profile.preferenceDetails)
    const [loading, setLoading] = useState(false)
    const previousProps = useRef({ userInfo, resStatus, resMessage, isUpdatedProfile }).current

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

    function updatePreferenceDetails (preferenceInformation) {
      token && dispatch(UpdatePreferenceDetails(preferenceInformation, token))
    }

    function getUserProfile () {
      if (token) {
        dispatch(GetUserProfile(token))
        setLoading(true)
      }
    }

    function getPreferenceInfo () {
      if (token) {
        dispatch(getPreferenceDetails(token))
        setLoading(true)
      }
    }

    return (
      <Component
        {...props}
        cityList={cityList}
        getPreferenceInfo={getPreferenceInfo}
        getUserProfile={getUserProfile}
        isUpdatedProfile={isUpdatedProfile}
        loading={loading}
        modalMessage={modalMessage}
        preferenceDetails={preferenceDetails}
        resMessage={resMessage}
        resStatus={resStatus}
        setLoading={setLoading}
        stateList={stateList}
        token={token}
        updatePreferenceDetails={updatePreferenceDetails}
        updateProfile={updateProfile}
        userInfo={userInfo}
      />
    )
  }
  MyComponent.displayName = MyComponent
  return MyComponent
}
export default UserProfile
