import React, { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getMyTeamList, getMyTeamPlayerList } from '../../redux/actions/team'
import { joinLeague } from '../../redux/actions/league'
import { ApplyMatchPromoCode, GetUserProfile, GetMatchPromoCode } from '../../redux/actions/profile'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'

export const JoinContest = (Component) => {
  const MyComponent = (props) => {
    const { data, teamList } = props
    const dispatch = useDispatch()
    const [matchID, setmatchId] = useState('')
    const [firstPrize, setFirstPrize] = useState(0)
    const [firstRankType, setFirstRankType] = useState('')
    const [lastPrize, setLastPrize] = useState(1)
    const [haveTeam, setTeamList] = useState(false)
    const [loading, setLoading] = useState(false)
    const [promocodeLoading, setPromocodeLoading] = useState(false)
    const [modalMessage, setModalMessage] = useState(false)
    const [message, setMessage] = useState('')
    const toggleMessage = () => setModalMessage(!modalMessage)
    const [joined, setJoined] = useState([])
    const teamPlayerList = useSelector(state => state.team.teamPlayerList)
    const resStatus = useSelector(state => state.league.resStatus)
    const resMessage = useSelector(state => state.league.resMessage)
    const profileResStatus = useSelector(state => state.profile.resStatus)
    const profileResMessage = useSelector(state => state.profile.resMessage)
    const appliedPromocode = useSelector(state => state.profile.appliedPromocode)
    const matchPromoCodeList = useSelector(state => state.profile.matchPromoCodeList)
    const userInfo = useSelector(state => state.profile.userInfo)
    const amountData = useSelector(state => state.league.amountData)
    const MatchLeagueId = useSelector(state => state.league.MatchLeagueId)
    const applyPromocodeData = useSelector(state => state.profile.applyPromocodeData)
    const contestJoinList = useSelector(state => state.team.contestJoinList)
    const currencyLogo = useSelector(state => state.settings.currencyLogo)
    const token = useSelector(state => state.auth.token) || localStorage.getItem('Token')

    const previousProps = useRef({
      resStatus, resMessage, contestJoinList, teamList, applyPromocodeData, profileResStatus, profileResMessage, matchPromoCodeList
    }).current

    const { sMatchId } = useParams()

    useEffect(() => {
      if (sMatchId) {
        setmatchId(sMatchId)
      }
      if (teamList && teamList.length !== 0) {
        setTeamList(true)
      }
    }, [token])

    useEffect(() => {
      if (previousProps.resMessage !== resMessage) {
        if (resStatus !== null) {
          if (resMessage) {
            setLoading(false)
            setModalMessage(false)
            setMessage(resMessage)
          }
        }
      }
      return () => {
        previousProps.resMessage = resMessage
      }
    }, [resMessage, resStatus])

    useEffect(() => {
      if (previousProps.profileResMessage !== profileResMessage) {
        if (profileResStatus !== null) {
          if (profileResMessage) {
            setLoading(false)
            setModalMessage(false)
            setMessage(profileResMessage)
          }
        }
      }
      return () => {
        previousProps.profileResMessage = profileResMessage
      }
    }, [profileResMessage, profileResStatus])

    useEffect(() => {
      if (previousProps.applyPromocodeData !== applyPromocodeData) {
        if (applyPromocodeData) {
          setLoading(false)
        }
      }
      return () => {
        previousProps.applyPromocodeData = applyPromocodeData
      }
    }, [applyPromocodeData])

    useEffect(() => {
      if (data && data.aLeaguePrize) {
        data && data.aLeaguePrize.length && data.aLeaguePrize.map((a) => {
          if (a.nRankFrom === 1) {
            if (a.eRankType === 'E') {
              setFirstPrize(a.sInfo)
            } else {
              setFirstPrize(a.nPrize)
            }
            setFirstRankType(a.eRankType)
          }
          if (a.nRankTo >= lastPrize) {
            setLastPrize(a.nRankTo)
          }
          return a
        })
      }
      setLoading(false)
    }, [data])

    // useEffect(() => {
    //   if (data && data.aLeaguePrize) {
    //     let fPrize = '';
    //     if (data && data.bPoolPrize && data.bPrivateLeague) {
    //       data && data.aLeaguePrize.length && data.aLeaguePrize.map((a) => {// handle the response
    //         if (a.nRankFrom === 1) {
    //           if (a.eRankType === 'E') {
    //             setFirstPrize(a.sInfo)
    //           } else {
    //             setFirstPrize((a.nPrize * data.nTotalPayout) / 100)
    //           }
    //           setFirstRankType(a.eRankType)
    //         }
    //         if (a.nRankTo >= lastPrize) {
    //           setLastPrize(a.nRankTo)
    //         }
    //         return a
    //       })
    //     } else if (data && data.bPoolPrize && data.nDeductPercent !== null && (!data.bPrivateLeague)) {
    //       if (data.eMatchStatus === 'U') {
    //         fPrize = Math.floor(Number(((data.nPrice * maxValue(data.nMin, data.nJoined) * 100) / (((data && data.nDeductPercent) || 0) + 100))))
    //         data && data.aLeaguePrize.length && data.aLeaguePrize.map((a) => {// handle the response
    //           if (a.nRankFrom === 1) {
    //             if (a.eRankType === 'E') {
    //               setFirstPrize(a.sInfo)
    //             } else {
    //               setFirstPrize((a.nPrize * fPrize) / 100)
    //             }
    //             setFirstRankType(a.eRankType)
    //           }
    //           if (a.nRankTo >= lastPrize) {
    //             setLastPrize(a.nRankTo)
    //           }
    //           return a
    //         })
    //       } else {
    //         fPrize = Math.floor(Number(((data.nPrice * data.nJoined * 100) / (((data && data.nDeductPercent) || 0) + 100))))
    //         data && data.aLeaguePrize.length && data.aLeaguePrize.map((a) => {// handle the response
    //           if (a.nRankFrom === 1) {
    //             if (a.eRankType === 'E') {
    //               setFirstPrize(a.sInfo)
    //             } else {
    //               setFirstPrize((a.nPrize * fPrize) / 100)
    //             }
    //             setFirstRankType(a.eRankType)
    //           }
    //           if (a.nRankTo >= lastPrize) {
    //             setLastPrize(a.nRankTo)
    //           }
    //           return a
    //         })
    //       }
    //     } else {
    //       data && data.aLeaguePrize.length && data.aLeaguePrize.map((a) => {// handle the response
    //         if (a.nRankFrom === 1) {
    //           if (a.eRankType === 'E') {
    //             setFirstPrize(a.sInfo)
    //           } else {
    //             setFirstPrize(a.nPrize)
    //           }
    //           setFirstRankType(a.eRankType)
    //         }
    //         if (a.nRankTo >= lastPrize) {
    //           setLastPrize(a.nRankTo)
    //         }
    //         return a
    //       })
    //     }
    //   }
    //   setLoading(false)
    // }, [data])

    useEffect(() => {
      if (contestJoinList && contestJoinList.length !== 0 && data && data.nTeamJoinLimit) {
        const Joined = contestJoinList.find(a => a.iMatchLeagueId === data._id)
        if (Joined && Joined.nJoinedCount && Joined.nJoinedCount >= data.nTeamJoinLimit) {
          setJoined(Joined)
        }
      }
    }, [contestJoinList])

    useEffect(() => {
      if (teamList !== previousProps.teamList) {
        if (resStatus !== null) {
          setLoading(false)
        }
      }
      return () => {
        previousProps.teamList = teamList
      }
    }, [teamList])

    useEffect(() => {
      if (matchPromoCodeList !== previousProps.matchPromoCodeList) {
        if ((matchPromoCodeList && matchPromoCodeList.length > 0) || matchPromoCodeList) {
          setPromocodeLoading(false)
        }
      }
      return () => {
        previousProps.matchPromoCodeList = matchPromoCodeList
      }
    }, [matchPromoCodeList])

    function joinContest (iUserTeamId, promoCode) {
      const isPrivateLeague = data.bPrivateLeague ? data.bPrivateLeague : false
      const shareCode = data.sShareCode ? data.sShareCode : ''
      if (iUserTeamId) {
        if (data && data._id && data.iMatchId && token) {
          setMessage('')
          dispatch(joinLeague(data._id, iUserTeamId, isPrivateLeague, token, shareCode, promoCode))
          setLoading(true)
          setModalMessage(false)
        }
      }
    }

    function getTeamList () {
      if (data && data.iMatchId && token) {
        dispatch(getMyTeamList(data.iMatchId, token))
        setLoading(true)
      }
    }

    function onApplyPromo (data) {
      if (token) {
        dispatch(ApplyMatchPromoCode(data, token))
        setLoading(true)
      }
    }

    function onGetUserProfile () {
      if (token) {
        dispatch(GetUserProfile(token))
      }
    }
    function onGetPromocodeList (Id) {
      if (token) {
        dispatch(GetMatchPromoCode(Id, token))
        setPromocodeLoading(true)
      }
    }

    function getMatchPlayersFunc (Id, token) {
      dispatch(getMyTeamPlayerList(Id, token))
    }

    return (
      <Component
        {...props}
        MatchLeagueId={MatchLeagueId}
        amountData={amountData}
        appliedPromocode={appliedPromocode}
        applyPromo={onApplyPromo}
        applyPromocodeData={applyPromocodeData}
        contestJoinList={contestJoinList}
        currencyLogo={currencyLogo}
        firstPrize={firstPrize}
        firstRankType={firstRankType}
        getMatchPlayersFunc={getMatchPlayersFunc}
        getMyTeamList={getTeamList}
        haveTeam={haveTeam}
        joinContest={joinContest}
        joined={joined}
        lastPrize={lastPrize}
        loading={loading}
        matchID={matchID}
        matchPromoCodeList={matchPromoCodeList}
        message={message}
        modalMessage={modalMessage}
        onGetPromocodeList={onGetPromocodeList}
        onGetUserProfile={onGetUserProfile}
        promocodeLoading={promocodeLoading}
        setLoading={setLoading}
        setModalMessage={setModalMessage}
        teamList={teamList}
        teamPlayerList={teamPlayerList}
        toggleMessage={toggleMessage}
        token={token}
        userInfo={userInfo}
      />
    )
  }
  MyComponent.propTypes = {
    match: PropTypes.object,
    data: PropTypes.object,
    teamList: PropTypes.object
  }
  MyComponent.displayName = MyComponent
  return MyComponent
}

export default JoinContest
