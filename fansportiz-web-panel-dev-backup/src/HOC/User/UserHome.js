import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getMatchDetails, getBannerStatics } from '../../redux/actions/match'
import { getMatchLeagueDetails } from '../../redux/actions/league'
import useGetStreamButton from '../../api/settings/queries/useGetStreamButton'
import useActiveSports from '../../api/activeSports/queries/useActiveSports'
import { GetUserProfile } from '../../redux/actions/profile'

const UserHome = (Component) => {
  const MyComponent = (props) => {
    const { data: streamButtonData } = useGetStreamButton()
    const dispatch = useDispatch()
    const [pathName] = useState('')
    const [url, setUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const [bannerImg, setBannerImg] = useState([])
    const token = useSelector(state => state.auth.token) || localStorage.getItem('Token')
    const getUrlLink = useSelector(state => state.url.getUrl)
    const resStatus = useSelector(state => state.match.resStatus)
    const resMessage = useSelector(state => state.match.resMessage)
    const bannerData = useSelector(state => state.match.bannerData)
    const currencyLogo = useSelector(state => state.settings.currencyLogo)
    const matchDetails = useSelector(state => state.match.matchDetails)
    const userInfo = useSelector(state => state.profile.userInfo)
    // const isShowingStreamButton = useSelector(state => state.profle.isShowingStreamButton)
    const matchLeagueDetails = useSelector(state => state.league.matchLeagueDetails)
    const { data: activeSports } = useActiveSports()
    const previousProps = useRef({ bannerData, getUrlLink, resMessage, resStatus, matchLeagueDetails }).current

    useEffect(() => {
      if (token) {
        // dispatch(GetHomeBanner('H'))
        // dispatch(onGetStreamButton())
      }
    }, [token])

    useEffect(() => {
      if (getUrlLink) {
        setUrl(getUrlLink)
      }
    }, [getUrlLink])

    useEffect(() => {
      if (previousProps.resMessage !== resMessage) {
        if (!resStatus) {
          setLoading(false)
        }
      }
      return () => {
        previousProps.resMessage = resMessage
      }
    }, [resMessage, resStatus])

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

    function onBannerStatistics (ID) {
      if (ID && token) {
        dispatch(getBannerStatics(ID, token))
      }
    }

    function onGetUserProfile () {
      token && dispatch(GetUserProfile(token))
    }

    return (
      <Component
        {...props}
        activeSports={activeSports}
        bannerImg={bannerImg}
        currencyLogo={currencyLogo}
        isShowingStreamButton={streamButtonData?.bShowStreamButton}
        loading={loading}
        matchDetails={matchDetails}
        matchLeagueDetails={matchLeagueDetails}
        onBannerStatistics={onBannerStatistics}
        onGetLeagueDetails={onGetLeagueDetails}
        onGetMatchDetails={onGetMatchDetails}
        onGetUserProfile={onGetUserProfile}
        pathName={pathName}
        resMessage={resMessage}
        resStatus={resStatus}
        token={token}
        url={url}
        userInfo={userInfo}
      />
    )
  }
  MyComponent.displayName = MyComponent
  return MyComponent
}

export default UserHome
