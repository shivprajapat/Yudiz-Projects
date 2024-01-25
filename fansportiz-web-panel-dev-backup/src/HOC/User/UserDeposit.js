import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { GetHomeBanner, getMatchDetails, getBannerStatics } from '../../redux/actions/match'
import { getMatchLeagueDetails, joinLeague } from '../../redux/actions/league'
import { depositValidationList, ApplyPromoCode, GetPaymentOption, GetPromoCode, AddCashfree, GetUserProfile, createPayment, ClearDeposit } from '../../redux/actions/profile'
import { getFixDepositAmounts } from '../../redux/actions/setting'
import PropTypes from 'prop-types'
import { useLocation } from 'react-router-dom'

export const UserDeposit = (Component) => {
  const MyComponent = (props) => {
    const dispatch = useDispatch()
    const { payment } = props
    const [appliedPromocode, setApplied] = useState(false)
    const [url, setUrl] = useState('')
    const [modalMessage, setModalMessage] = useState(false)
    const [loading, setLoading] = useState(false)
    const [bannerImg, setBannerImg] = useState([])
    const token = useSelector(state => state.auth.token) || localStorage.getItem('Token')
    const getUrlLink = useSelector(state => state.url.getUrl)
    const resStatus = useSelector(state => state.profile.resStatus)
    const resMessage = useSelector(state => state.profile.resMessage)
    const promoCode = useSelector(state => state.profile.promoCode)
    const paymentData = useSelector(state => state.profile.paymentData)
    const addedDeposit = useSelector(state => state.profile.addDeposit)
    const currencyLogo = useSelector(state => state.settings.currencyLogo)
    const fixAmounts = useSelector(state => state.settings.fixAmounts)
    const checkPromocode = useSelector(state => state.profile.checkPromocode)
    const matchDetails = useSelector(state => state.match.matchDetails)
    const bannerData = useSelector(state => state.match.bannerData)
    const amountData = useSelector(state => state.league.amountData)
    const pList = useSelector(state => state.profile.pList)
    const settingValidation = useSelector(state => state.profile.settingValidation)
    const paymentToken = useSelector(state => state.profile.paymentToken)
    const paymentResMessage = useSelector(state => state.profile.paymentResMessage)
    const paymentResStatus = useSelector(state => state.profile.paymentResStatus)
    const userInfo = useSelector(state => state.profile.userInfo)
    const previousProps = useRef({ bannerData, resMessage, getUrlLink, resStatus, addedDeposit }).current

    const location = useLocation()

    useEffect(() => {
      if (location.pathname.includes('deposit')) {
        dispatch(getFixDepositAmounts())
      }
    }, [])

    useEffect(() => { // call initialize
      if (token) {
        dispatch(GetHomeBanner('D'))
        onDepositValidation('Deposit')
        dispatch(GetPromoCode(token))
        getUserDetails()
        if (payment) { dispatch(GetPaymentOption(token)) }
        setLoading(true)
      }
      if (getUrlLink) {
        setUrl(getUrlLink)
      }
    }, [token])

    useEffect(() => {
      if (getUrlLink) {
        setUrl(getUrlLink)
      }
    }, [getUrlLink])

    useEffect(() => {
      if (previousProps.bannerData !== bannerData) {
        if (bannerData) {
          const items = []
          if (bannerData.length > 0) {
            bannerData.sort((a, b) => a.nPosition - b.nPosition).map((data) => {
              items.push({ src: data.sImage, eCategory: data.eCategory, eScreen: data.eScreen, iMatchId: data.iMatchId, iMatchLeagueId: data.iMatchLeagueId, key: data._id, sLink: data.sLink, eType: data.eType, sDescription: data.sDescription })
              return items
            })
          }
          setBannerImg(items)
        }
      }
      return () => {
        previousProps.bannerData = bannerData
      }
    }, [bannerData])

    useEffect(() => {
      if (previousProps.matchDetails !== matchDetails) {
        if (matchDetails && matchDetails._id) {
          setLoading(false)
        }
      }
      return () => {
        previousProps.matchDetails = matchDetails
      }
    }, [matchDetails])

    useEffect(() => {
      if (previousProps.addedDeposit !== addedDeposit) {
        if (addedDeposit) {
          setLoading(false)
        }
      }
      return () => {
        previousProps.addedDeposit = addedDeposit
      }
    }, [addedDeposit])

    useEffect(() => {
      if (previousProps.resMessage !== resMessage) {
        if (resMessage) {
          setLoading(false)
          setModalMessage(true)
          setTimeout(() => setModalMessage(false), 3000)
        }
        if (resStatus === false) {
          setLoading(false)
          setModalMessage(true)
          setTimeout(() => setModalMessage(false), 3000)
        }
        if (checkPromocode) {
          setApplied(true)
        } else {
          setApplied(false)
        }
      }
      return () => {
        previousProps.resMessage = resMessage
      }
    }, [resStatus, resMessage])

    function applyPromoFunc (data) {
      setLoading(true)
      token && dispatch(ApplyPromoCode(data, token))
    }

    function addCashFree (Amount, Type, PlatForm, OrderCurrency, sPromocode) {
      dispatch(AddCashfree(Amount, Type, PlatForm, OrderCurrency, sPromocode, token))
      setLoading(true)
    }

    function getUserDetails () {
      token && dispatch(GetUserProfile(token))
    }

    function clearDeposite () {
      dispatch(ClearDeposit())
    }

    function onDepositValidation (type) {
      token && dispatch(depositValidationList(type, token))
    }

    function onJoinContest (joinData) {
      token && dispatch(joinLeague(joinData.verifiedId, joinData.userTeams, joinData.bPrivateLeague || false, token, '', ''))
    }

    function CreatePayment (data) {
      dispatch(createPayment(data, token))
    }

    function onGetMatchDetails (ID) {
      if (ID && token) {
        dispatch(getMatchDetails(ID, '', token))
        setLoading(true)
      }
    }

    function onGetLeagueDetails (ID) {
      if (ID && token) {
        dispatch(getMatchLeagueDetails(ID, token))
        setLoading(true)
      }
    }

    function onBannerStatictics (ID) {
      if (ID && token) {
        dispatch(getBannerStatics(ID, token))
      }
    }

    return (
      <Component {...props}
        AddingCashFree={addCashFree}
        CreatePayment={CreatePayment}
        GetUserProfile={getUserDetails}
        amountData={amountData}
        appliedPromocode={appliedPromocode}
        applyPromo={applyPromoFunc}
        bannerImg={bannerImg}
        checkPromocode={checkPromocode}
        clearDeposite={clearDeposite}
        currencyLogo={currencyLogo}
        fixAmounts={fixAmounts}
        isAddedDeposit={addedDeposit}
        loading={loading}
        matchDetails={matchDetails}
        modalMessage={modalMessage}
        onBannerStatictics={onBannerStatictics}
        onDepositValidation={onDepositValidation}
        onGetLeagueDetails={onGetLeagueDetails}
        onGetMatchDetails={onGetMatchDetails}
        onJoinContest={onJoinContest}
        paymentData={paymentData}
        paymentList={pList}
        paymentResMessage={paymentResMessage}
        paymentResStatus={paymentResStatus}
        paymentToken={paymentToken}
        promoCodeList={promoCode}
        resMessage={resMessage}
        resStatus={resStatus}
        setApplied={setApplied}
        setLoading={setLoading}
        settingValidation={settingValidation}
        url={url}
        userInfo={userInfo}
      />
    )
  }
  MyComponent.propTypes = {
    payment: PropTypes.any
  }
  return MyComponent
}
export default UserDeposit
