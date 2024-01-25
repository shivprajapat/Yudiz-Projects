import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AddKycDetail, getDisclaimer, GetKycDetail, sendKycOtp, UpdateKycDetail } from '../../redux/actions/profile'

export const UserKyc = (Component) => {
  const MyComponent = (props) => {
    const dispatch = useDispatch()
    const [modalMessage, setModalMessage] = useState(false)
    const [loading, setLoading] = useState(false)
    const token = useSelector(state => state.auth.token) || localStorage.getItem('Token')
    const resStatus = useSelector(state => state.profile.resStatus)
    const resMessage = useSelector(state => state.profile.resMessage)
    const kycAdded = useSelector(state => state.profile.kycAdded)
    const kycUpdated = useSelector(state => state.profile.kycUpdated)
    const kycDetail = useSelector(state => state.profile.kycDetail)
    const disclaimer = useSelector(state => state.profile.disclaimer)
    const getKycUrlLink = useSelector(state => state.url.getKycUrl)
    const aadhaarData = useSelector(state => state.profile.aadhaarData)
    const previousProps = useRef({ resMessage, resStatus, kycDetail }).current
    useEffect(() => {
      if (token) {
        dispatch(GetKycDetail(token))
        dispatch(getDisclaimer(token))
        setLoading(true)
      }
    }, [token])

    useEffect(() => {
      if (modalMessage) {
        setTimeout(() => setModalMessage(false), 2000)
      }
    }, [modalMessage])

    useEffect(() => {
      if (previousProps.resMessage !== resMessage) {
        if (resMessage && resStatus !== null) {
          setModalMessage(true)
          setLoading(false)
        } else {
          !resMessage && !resStatus && setLoading(false)
        }
      }
      return () => {
        previousProps.resMessage = resMessage
      }
    }, [resStatus, resMessage])

    useEffect(() => {
      if (previousProps.kycAdded !== kycAdded) {
        if (kycAdded) {
          getKyc()
        }
      }
      return () => {
        previousProps.kycAdded = kycAdded
      }
    }, [kycAdded])

    function getKyc () {
      token && dispatch(GetKycDetail(token))
      setLoading(true)
    }

    function sendKycOtpFunc (aadhaarNo) {
      dispatch(sendKycOtp(aadhaarNo, token))
    }

    function AddKycFun (type, panImg, panNumber, aadharNo, aadharFrontImg, aadharBackImg, PanName) {
      token && dispatch(AddKycDetail(type, panImg, panNumber, aadharNo, aadharFrontImg, aadharBackImg, token, PanName))
      setLoading(true)
    }
    function UpdateKycFun (type, panImg, panNumber, aadharNo, aadharFrontImg, aadharBackImg, PanName) {
      token && dispatch(UpdateKycDetail(type, panImg, panNumber, aadharNo, aadharFrontImg, aadharBackImg, token, PanName))
      setLoading(true)
    }

    return (
      <Component {...props}
        AddKyc={AddKycFun}
        UpdateKyc={UpdateKycFun}
        aadhaarData={aadhaarData}
        disclaimer={disclaimer}
        getKyc={getKyc}
        kycAdded={kycAdded}
        kycDetail={kycDetail}
        kycUpdated={kycUpdated}
        loading={loading}
        modalMessage={modalMessage}
        resMessage={resMessage}
        resStatus={resStatus}
        sendKycOtpFunc={sendKycOtpFunc}
        setLoading={setLoading}
        url={getKycUrlLink}
      />
    )
  }
  MyComponent.displayName = MyComponent
  return MyComponent
}
export default UserKyc
