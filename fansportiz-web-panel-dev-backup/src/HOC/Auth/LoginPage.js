import { useQuery } from '@tanstack/react-query'
import React, { useEffect, useState, useRef, useContext } from 'react'
import { useSelector } from 'react-redux'
import { client } from '../../api/client.js'
import { VerifyOTP, googleLogin, deleteAccount, deleteAccountReasons } from '../../redux/actions/auth.js'
import { getCurrentReferRule, getUserReferralsList, GetUserStatastics, remindReferUser, UpdateUserProfile } from '../../redux/actions/profile.js'
import PropTypes from 'prop-types'
import { UserContext } from '../../redux/userContext.js'
// import useLogout from '../../api/auth/mutations/useLogout.js'
import useGetUserProfile from '../../api/user/queries/useGetUserProfile.js'

export const LoginPage = (Component) => {
  const MyComponent = (props) => {
    // const dispatch = useDispatch()
    const { dispatch } = useContext(UserContext)
    const [userToken] = useState('')
    const [modalMessage, setModalMessage] = useState(false)
    const [loading, setLoading] = useState(false)
    const [url, setUrl] = useState('')
    const [message, setMessage] = useState('')
    const [profileModelMessage, setProfileMessage] = useState('')
    const resStatus = useSelector(state => state.auth.resStatus)
    const resMessage = useSelector(state => state.auth.resMessage)
    // const FirebaseToken = useSelector(state => state.auth.FirebaseToken)
    const FirebaseToken = localStorage.getItem('FirebaseToken')
    const profileMessage = useSelector(state => state.profile.resMessage)
    const profileStatus = useSelector(state => state.profile.resStatus)
    const updatedProfilePic = useSelector(state => state.profile.updateProfilePic)
    const userInformation = useSelector(state => state.profile.userInfo)
    const getUrlLink = useSelector(state => state.url.getUrl)
    // const token = localStorage.getItem('Token')
    // const Token = queryClient.getQueryData('Token')

    const { data: token } = useQuery({
      queryKey: ['Token', userToken],
      queryFn: () => client.setQueryData('Token', userToken),
      enabled: !!userToken
    })

    const { data: userData } = useGetUserProfile()

    const isAuth = useSelector(state => state.auth.isAuth)
    const addedDeposit = useSelector(state => state.profile.addDeposit)
    const statisticsData = useSelector(state => state.profile.statisticsData)
    const currencyLogo = useSelector(state => state.settings.currencyLogo)
    const nOtpSend = useSelector(state => state.auth.nOtpSend)
    const socialRegisterData = useSelector(state => state.auth.socialRegisterData)
    const userInfo = useSelector(state => state.profile.userInfo)
    const currentReferRule = useSelector(state => state.profile.currentReferRule)
    const userReferralsList = useSelector(state => state.profile.userReferralsList)
    const deleteAccountReasonsList = useSelector(state => state.auth.deleteAccountReasons)
    const previousProps = useRef({ resMessage, resStatus, userInfo, getUrlLink, socialRegisterData, updatedProfilePic }).current

    // useEffect(() => {
    //   dispatch(GetUserProfile())
    //   onGetUserStatastics()
    //   setLoading(true)
    // }, [])

    useEffect(() => {
      if (getUrlLink) {
        setUrl(getUrlLink)
      }
    }, [getUrlLink])

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
      if (previousProps.profileMessage !== profileMessage) {
        if (profileMessage) {
          setLoading(false)
          setModalMessage(true)
          setProfileMessage(profileMessage)
          setTimeout(() => setModalMessage(false), 2000)
        }
        if (previousProps.updatedProfilePic !== updatedProfilePic) {
          if (updatedProfilePic) {
            // dispatch(GetUserProfile())
            onGetUserStatastics()
          }
        }
      }
      return () => {
        previousProps.profileMessage = profileMessage
        previousProps.updatedProfilePic = updatedProfilePic
      }
    }, [profileMessage, profileStatus])

    useEffect(() => {
      if (previousProps.resMessage !== resMessage) {
        if (resMessage && resMessage.length) {
          setMessage(resMessage)
          setModalMessage(true)
          setLoading(false)
          setTimeout(() => setModalMessage(false), 2000)
        }
      }
      return () => {
        previousProps.resMessage = resMessage
      }
    }, [resStatus, resMessage])

    useEffect(() => {
      if (socialRegisterData) {
        setLoading(false)
      }
    }, [socialRegisterData])

    // const Loginfun = (Platform, userName, Password, loginID) => {
    //   login({ FirebaseToken, Platform, userName, Password, loginID })
    // }

    // function Loginfun (platform, userName, Password, loginID) {
    //   if (loginID) {
    //     dispatch(Login(FirebaseToken, platform, userName, Password, loginID))
    //     setLoading(true)
    //   }
    // }

    function googleRegister (socialType, Token) {
      if (Token && socialType) {
        dispatch(googleLogin(socialType, Token))
        setLoading(true)
      }
    }

    function VerifyOTPFun (mobileNumber, Type, Auth, sCode, loginID) {
      dispatch(VerifyOTP(mobileNumber, Type, Auth, sCode, loginID, FirebaseToken))
    }

    function updateProfilePic (platform, img, data) {
      dispatch(UpdateUserProfile(platform, img, data))
      setLoading(true)
    }

    // const { mutate: logoutMutation } = useLogout()

    // const LogoutFunc = () => {
    //   logoutMutation({ })
    // }

    // function Logout () {
    //   dispatch(logout())
    //   setLoading(true)
    // }

    // function onGetUserInfo () {
    //   dispatch(GetUserProfile())
    //   setLoading(true)
    // }

    function onGetUserStatastics () {
      dispatch(GetUserStatastics())
      setLoading(true)
    }

    function deleteAccountReasonsFunc () {
      dispatch(deleteAccountReasons())
    }

    function deleteAccountFunc (reason, userToken) {
      dispatch(deleteAccount(reason, userToken))
    }

    function getReferRuleFunc () {
      dispatch(getCurrentReferRule(token))
    }

    function getUserReferralsListFunc () {
      dispatch(getUserReferralsList(token))
    }

    function remindUser (id) {
      dispatch(remindReferUser(id, token))
    }

    return (
      <Component
        {...props}
        DeleteAccount={deleteAccountFunc}
        DeleteAccountReasonsFunc={deleteAccountReasonsFunc}
        FirebaseToken={FirebaseToken}
        // Logout={LogoutFunc}
        VerifyOTP={VerifyOTPFun}
        addedDeposit={addedDeposit}
        currencyLogo={currencyLogo}
        currentReferRule={currentReferRule}
        deleteAccountReasonsList={deleteAccountReasonsList}
        getReferRuleFunc={getReferRuleFunc}
        getUserReferralsListFunc={getUserReferralsListFunc}
        googleSignUp={googleRegister}
        isAuth={isAuth}
        loading={loading}
        message={message}
        modalMessage={modalMessage}
        nOtpSend={nOtpSend}
        onGetUserStatastics={onGetUserStatastics}
        profileData={userInfo}
        profileMessage={profileMessage}
        profileModelMessage={profileModelMessage}
        profileStatus={profileStatus}
        remindUser={remindUser}
        resMessage={resMessage}
        resStatus={resStatus}
        setMessage={setMessage}
        setModalMessage={setModalMessage}
        socialRegisterData={socialRegisterData}
        statisticsData={statisticsData}
        updateProfilePic={updateProfilePic}
        updatedProfilePic={updatedProfilePic}
        url={url}
        userData={userData}
        userInformation={userInformation}
        userReferralsList={userReferralsList}
      />
    )
  }
  // MyComponent.displayName = MyComponent
  MyComponent.propTypes = {
    history: PropTypes.object
  }
  return MyComponent
}

export default LoginPage
