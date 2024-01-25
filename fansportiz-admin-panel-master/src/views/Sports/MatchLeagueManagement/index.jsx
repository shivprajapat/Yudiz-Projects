import React, { useState, useEffect, Fragment, useRef } from 'react'
import qs from 'query-string'
import { useDispatch, useSelector } from 'react-redux'
import { getMatchDetails, priceDistriBution, winPrizeDistribution } from '../../../actions/match'
import { canceledMatchLeague, getLeagueCount, getMatchLeagueList, pointCalculate, normalBotTeams } from '../../../actions/matchleague'
import SportsHeader from '../SportsHeader'
import MatchLeagueComponent from './MatchLeagueComponent'
import NavbarComponent from '../../../components/Navbar'
import { getRankCalculate, getWinReturn } from '../../../actions/matchplayer'
import { getSettingList } from '../../../actions/setting'
import PropTypes from 'prop-types'
import axios from 'axios'

function IndexMatchLeagueManagement (props) {
  const {
    match
  } = props
  const content = useRef()
  const [searchText, setSearchText] = useState('')
  const [matchName, setMatchName] = useState('')
  const [matchStatus, setMatchStatus] = useState('')
  const [initialFlag, setinitialFlag] = useState(false)
  const [pointCalculateFlag, setPointCalculateFlag] = useState(false)
  const [rankCalculateFlag, setRankCalculateFlag] = useState(false)
  const [prizeCalculateFlag, setPrizeCalculateFlag] = useState(false)
  const [winPrizeCalculateFlag, setWinPrizeCalculateFlag] = useState(false)
  const [pointCalculateInterval, setPointCalculateInterval] = useState({})
  const [rankCalculateInterval, setRankCalculateInterval] = useState({})
  const [prizeCalculateInterval, setPrizeCalculateInterval] = useState({})
  const [winPrizeCalculateInterval, setWinPrizeCalculateInterval] = useState({})
  const token = useSelector(state => state.auth.token)
  const matchLeagueList = useSelector(state => state.matchleague.matchLeagueList)
  const MatchDetails = useSelector(state => state.match.matchDetails)
  const leagueCount = useSelector(state => state.matchleague.leagueCount)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const settingList = useSelector(state => state.setting.settingList)
  const matchLeagueResponse = useSelector(state => state.matchleague.resFlag)
  const matchPlayerResponse = useSelector(state => state.matchplayer.resFlag)
  const matchPrizeResponse = useSelector(state => state.match.prizeFlag)
  const matchWinResponse = useSelector(state => state.match.winFlag)
  const sportsType = props.location.pathname.includes('cricket') ? 'cricket' : props.location.pathname.includes('football') ? 'football' : props.location.pathname.includes('basketball') ? 'basketball' : props.location.pathname.includes('kabaddi') ? 'kabaddi' : ''
  const dispatch = useDispatch()

  const previousProps = useRef({ MatchDetails }).current

  const cancelTokenSource = useRef()

  useEffect(() => {
    if (match.params.id) {
      dispatch(getMatchDetails(match.params.id, token))
    }
    const obj = qs.parse(props.location.search)
    if (obj.search) {
      setSearchText(obj.search)
    }

    // return () => {
    //   clearInterval(pointCalculateInterval)
    //   clearInterval(rankCalculateInterval)
    //   clearInterval(prizeCalculateInterval)
    //   clearInterval(winPrizeCalculateInterval)
    // }
  }, [])

  useEffect(() => {
    if (MatchDetails && previousProps.MatchDetails !== MatchDetails) {
      setMatchName(MatchDetails.sName)
      setMatchStatus(MatchDetails.eStatus)
      leagueCountFunc(MatchDetails.eStatus)
    }

    return () => {
      previousProps.MatchDetails = MatchDetails
    }
  }, [MatchDetails])

  useEffect(() => {
    if (leagueCount) {
      if (leagueCount?.nPointCalculated === leagueCount?.nJoinedUsers && pointCalculateFlag) {
        setPointCalculateFlag(false)
        clearInterval(pointCalculateInterval)
        cancelTokenSource.current.cancel()
      }
      if (leagueCount?.nRankCalculated === leagueCount?.nJoinedUsers && rankCalculateFlag) {
        setRankCalculateFlag(false)
        clearInterval(rankCalculateInterval)
        cancelTokenSource.current.cancel()
      }
      if (leagueCount?.nPrizeCalculated === leagueCount?.nLeagueCount && prizeCalculateFlag) {
        setPrizeCalculateFlag(false)
        clearInterval(prizeCalculateInterval)
        cancelTokenSource.current.cancel()
      }
      if (leagueCount?.nWinDistributed === leagueCount?.nLeagueCount && winPrizeCalculateFlag) {
        setWinPrizeCalculateFlag(false)
        clearInterval(winPrizeCalculateInterval)
        cancelTokenSource.current.cancel()
      }
    }

    // return () => {
    //   clearInterval(pointCalculateInterval)
    //   clearInterval(rankCalculateInterval)
    //   clearInterval(prizeCalculateInterval)
    //   clearInterval(winPrizeCalculateInterval)
    // }
  }, [leagueCount])

  useEffect(() => {
    cancelTokenSource.current = axios.CancelToken.source()
    const cancelToken = cancelTokenSource.current.token

    if (pointCalculateFlag && matchLeagueResponse) {
      const intervalPointCalculate = setInterval(() => {
        if (matchStatus) {
          leagueCountFunc(matchStatus, cancelToken)
        }
      }, 2000)
      setPointCalculateInterval(intervalPointCalculate)
    }

    if (rankCalculateFlag && matchPlayerResponse) {
      const intervalRankCalculate = setInterval(() => {
        if (matchStatus) {
          leagueCountFunc(matchStatus, cancelToken)
        }
      }, 2000)
      setRankCalculateInterval(intervalRankCalculate)
    }

    if (prizeCalculateFlag && matchPrizeResponse) {
      const intervalPriceCalculate = setInterval(() => {
        if (matchStatus) {
          leagueCountFunc(matchStatus, cancelToken)
        }
      }, 2000)
      setPrizeCalculateInterval(intervalPriceCalculate)
    }

    if (winPrizeCalculateFlag && matchWinResponse) {
      const intervalWinPrizeCalculate = setInterval(() => {
        if (matchStatus) {
          leagueCountFunc(matchStatus, cancelToken)
        }
      }, 2000)
      setWinPrizeCalculateInterval(intervalWinPrizeCalculate)
    }

    return () => {
      clearInterval(pointCalculateInterval)
      clearInterval(rankCalculateInterval)
      clearInterval(prizeCalculateInterval)
      clearInterval(winPrizeCalculateInterval)
    }
  }, [pointCalculateFlag, rankCalculateFlag, prizeCalculateFlag, winPrizeCalculateFlag, matchLeagueResponse, matchPlayerResponse, matchPrizeResponse, matchWinResponse])

  function clearPendingReq () {
    clearInterval(pointCalculateInterval)
    clearInterval(rankCalculateInterval)
    clearInterval(prizeCalculateInterval)
    clearInterval(winPrizeCalculateInterval)
    cancelTokenSource.current.cancel()
  }

  function onHandleSearch (e) {
    setSearchText(e.target.value)
    setinitialFlag(true)
  }

  function getList (start, limit, sort, order, search, leagueType, isFullList) {
    const matchLeagueData = {
      start, limit, sort, order, searchText: search, leagueType, isFullList, ID: match.params.id, sportsType, token
    }
    dispatch(getMatchLeagueList(matchLeagueData))
  }

  function getMatchDetailsFunc () {
    dispatch(getMatchDetails(match.params.id, token))
  }

  function leagueCountFunc (status, cancelToken) {
    dispatch(getLeagueCount(status, cancelToken, match.params.id, token))
  }

  // dispatch action to cancel league
  function cancelLeague (iMatchLeagueId) {
    dispatch(canceledMatchLeague(iMatchLeagueId, token))
  }

  // dispatch action to calculate prize distribution for match leagues
  function prizeDistributionFunc () {
    setPrizeCalculateFlag(true)
    dispatch(priceDistriBution(match.params.id, token))
  }

  // dispatch action to calculate win prize distribution for match leagues
  function winPrizeDistributionFunc () {
    setWinPrizeCalculateFlag(true)
    dispatch(winPrizeDistribution(match.params.id, token))
  }

  function onRefreshFun () {
    content.current.onRefresh()
  }

  function pointCalculateFunc () {
    setPointCalculateFlag(true)
    dispatch(pointCalculate(match.params.id, token))
  }

  // dispatch action to calculate rank for match leagues
  function rankCalculate () {
    setRankCalculateFlag(true)
    dispatch(getRankCalculate(match.params.id, token))
  }

  function getSettingsList (start, limit, sort, order, search) {
    dispatch(getSettingList(start, limit, sort, order, search.trim(), token))
  }

  function winReturn () {
    dispatch(getWinReturn(match.params.id, token))
  }

  function editNormalBotTeams () {
    dispatch(normalBotTeams(match.params.id, token))
  }

  function onExport () {
    content.current.onExport()
  }

  function heading () {
    const title = sportsType.charAt(0).toUpperCase() + sportsType.slice(1) + ' Match Leagues'
    if (matchName) {
      if (window.innerWidth <= 480) {
        return <div>{title}<p>{`(${matchName})`}</p></div>
      } else {
        return <div>{title} {`(${matchName})`}</div>
      }
    } else {
      return <div>{title}</div>
    }
  }

  return (
    <Fragment>
      <NavbarComponent {...props} />
      <main className="main-content">
        <section className="management-section common-box">
          <SportsHeader
            heading={heading()}
            handleSearch={onHandleSearch}
            buttonText="Add Match League"
            MatchDetails={MatchDetails}
            search={searchText}
            setUrl={`/${sportsType}/match-management/match-league-management/add-match-league/${match.params.id}`}
            SearchPlaceholder="Search Match League"
            onRefresh={onRefreshFun}
            MatchPageLink={`/${sportsType}/match-management/view-match/${match.params.id}`}
            refresh
            otherButton
            isShow
            normalBotTeamsTrue={MatchDetails?.bLineupsOut || false}
            editNormalBotTeams={editNormalBotTeams}
            matchLeagueList={matchLeagueList}
            onExport={onExport}
            matchLeague
            hidden
            status={matchStatus}
            leagueCount={leagueCount}
            winReturn={winReturn}
            rankCalculate={rankCalculate}
            pointCalculate={pointCalculateFunc}
            permission={(Auth && Auth === 'SUPER') || (adminPermission?.MATCHLEAGUE !== 'R')}
            prizeDistributionFunc={prizeDistributionFunc}
            winPrizeDistributionFunc={winPrizeDistributionFunc}
            clearPendingReq={clearPendingReq}
          />
          <MatchLeagueComponent
            {...props}
            ref={content}
            List={matchLeagueList}
            getList={getList}
            MatchDetails={MatchDetails}
            getMatchDetailsFunc={getMatchDetailsFunc}
            userLeague={`/${sportsType}/match-management/match-league-management/user-league/${match.params.id}`}
            systemBotsLogs={`/${sportsType}/match-management/match-league-management/system-bot-logs/${match.params.id}`}
            systemTeams={`/${sportsType}/match-management/match-league-management/system-team-match-players/${match.params.id}`}
            search={searchText}
            flag={initialFlag}
            cashback={`/${sportsType}/match-management/match-league-management/match-league-cashback-list/${match.params.id}`}
            promoUsage={`/${sportsType}/match-management/match-league-management/match-league-promo-usage-list/${match.params.id}`}
            prizeDistributionFunc={prizeDistributionFunc}
            winPrizeDistributionFunc={winPrizeDistributionFunc}
            cancelLeague={cancelLeague}
            matchStatus={matchStatus}
            leagueCount={leagueCount}
            leagueCountFunc={leagueCountFunc}
            permission={(Auth && Auth === 'SUPER') || (adminPermission?.MATCHLEAGUE !== 'R')}
            pointCalculateFlag={pointCalculateFlag}
            rankCalculateFlag={rankCalculateFlag}
            prizeCalculateFlag={prizeCalculateFlag}
            winPrizeCalculateFlag={winPrizeCalculateFlag}
            getSettingList={getSettingsList}
            settingList={settingList}
          />
        </section>
      </main>
    </Fragment>
  )
}

IndexMatchLeagueManagement.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object
}

export default IndexMatchLeagueManagement
