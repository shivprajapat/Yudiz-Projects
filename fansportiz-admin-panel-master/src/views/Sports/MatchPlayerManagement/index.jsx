import React, { useState, useEffect, Fragment, useRef } from 'react'
import qs from 'query-string'
import { useDispatch, useSelector } from 'react-redux'
import NavbarComponent from '../../../components/Navbar'
import SportsHeader from '../SportsHeader'
import MatchPlayerComponent from './MatchPlayerComponent'
import { fetchMatchPlayer, fetchplaying11, getMatchPlayerList, getGenerateScorePoint, lineupsOut, UpdateMatchPlayer, generateScorePoint, calculateSeasonPoint, fetchPlaying7, fetchPlaying5 } from '../../../actions/matchplayer'
import { getMatchDetails } from '../../../actions/match'
import Loading from '../../../components/Loading'
import PropTypes from 'prop-types'
import { getPlayerRoleList } from '../../../actions/playerRole'

function IndexPlayerManagement (props) {
  const {
    match
  } = props
  const content = useRef()
  const [loading, setLoading] = useState(false)
  const [matchName, setMatchName] = useState('')
  const [status, setStatus] = useState('')
  const [searchValue, setSearchValue] = useState('')
  const [initialFlag, setinitialFlag] = useState(false)
  const token = useSelector(state => state.auth.token)
  const matchPlayerList = useSelector(state => state.matchplayer.matchPlayerList)
  const MatchDetails = useSelector(state => state.match.matchDetails)
  const playerRoleList = useSelector(state => state.playerRole.playerRoleList)
  const resStatus = useSelector(state => state.matchplayer.resStatus)
  const resMessage = useSelector(state => state.matchplayer.resMessage)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const previousProps = useRef({
    resMessage, resStatus
  }).current
  const [matchId, setMatchId] = useState('')
  const dispatch = useDispatch()
  const sportsType = props.location.pathname.includes('cricket') ? 'cricket' : props.location.pathname.includes('football') ? 'football' : props.location.pathname.includes('basketball') ? 'basketball' : props.location.pathname.includes('kabaddi') ? 'kabaddi' : ''

  useEffect(() => {
    const obj = qs.parse(props.location.search)
    if (obj.search) {
      setSearchValue(obj.search)
    }
    if (match.params.id) {
      setMatchId(match.params.id)
      dispatch(getMatchDetails(match.params.id, token))
    }
    if ((Auth && Auth === 'SUPER') || (adminPermission?.ROLES !== 'N')) {
      dispatch(getPlayerRoleList(sportsType, token))
    }
  }, [])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        setLoading(false)
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resStatus, resMessage])

  useEffect(() => {
    if (MatchDetails) {
      setMatchName(MatchDetails.sName)
      setStatus(MatchDetails.eStatus)
    }
  }, [MatchDetails])

  function onHandleSearch (e) {
    setSearchValue(e.target.value)
    setinitialFlag(true)
  }

  // dispatch action to get match player's list
  function getList (start, limit, sort, order, searchText, role, team) {
    const matchPlayerListData = {
      start, limit, sort, order, searchText, role, team, token, Id: match.params.id
    }
    dispatch(getMatchPlayerList(matchPlayerListData))
  }

  // dispatch action to generate score points
  function generateScorePointFun () {
    setLoading(true)
    if (sportsType === 'cricket') {
      dispatch(getGenerateScorePoint(match.params.id, token))
    } else {
      dispatch(generateScorePoint(sportsType, match.params.id, token))
    }
  }

  // dispatch action to fetch players for match
  function fetchMatchPlayerList () {
    setLoading(true)
    dispatch(fetchMatchPlayer(sportsType, match.params.id, token))
  }

  // dispatch action to fetch the player's list whoever gonna play(cricket, football)
  function fetchPlayingeleven () {
    setLoading(true)
    dispatch(fetchplaying11(sportsType, match.params.id, token))
  }

  // dispatch action to fetch the player's list whoever gonna play(kabaddi)
  function fetchPlayingSevenFunc () {
    dispatch(fetchPlaying7(match.params.id, token))
  }

  // dispatch action to fetch the player's list whoever gonna play(basketball)
  function fetchPlayingFiveFunc () {
    dispatch(fetchPlaying5(match.params.id, token))
  }

  // dispatch action to show player's status at app side whoever gonna play
  function lineupsOutfunction (bLineupsOut) {
    setLoading(true)
    dispatch(lineupsOut(bLineupsOut, matchId, token))
  }

  function onRefreshFun () {
    content.current.onRefresh()
  }

  function UpdatePlayer (playerName, playerId, playerImage, playerRole, credits, scorePoints, seasonPoints, TeamName, show, frontendStatus, matchPlayerId) {
    const updateMatchPlayerData = {
      playerName, playerId, playerImage, playerRole, credits, scorePoints, seasonPoints: parseFloat(seasonPoints), TeamName, show, frontendStatus, sportsType, token, matchId, matchPlayerId
    }
    dispatch(UpdateMatchPlayer(updateMatchPlayerData))
  }

  // dispatch action to calculate season points
  function seasonPoint () {
    setLoading(true)
    dispatch(calculateSeasonPoint(matchId, token))
  }

  function heading () {
    const title = sportsType.charAt(0).toUpperCase() + sportsType.slice(1) + ' Match Players'
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
        {loading && <Loading />}
        <section className="management-section common-box">
          <SportsHeader
            heading={heading()}
            handleSearch={onHandleSearch}
            buttonText="Add Match Player"
            matchPlayerManagement
            search={searchValue}
            status={status}
            fetchMatchPlayerList={fetchMatchPlayerList}
            fetchPlaying11={fetchPlayingeleven}
            fetchPlayingSevenFunc={fetchPlayingSevenFunc}
            fetchPlayingFiveFunc={fetchPlayingFiveFunc}
            lineupsOut={lineupsOutfunction}
            generateScorePoint={generateScorePointFun}
            MatchDetails={MatchDetails}
            onRefresh={onRefreshFun}
            MatchPageLink={`/${sportsType}/match-management/view-match/${match.params.id}`}
            setUrl={`/${sportsType}/match-management/match-player-management/add-match-player/${match.params.id}`}
            matchId={matchId}
            seasonPoint={seasonPoint}
            hidden
            refresh
            scorePoint
            fetchPlayingEleven={sportsType === 'cricket' || sportsType === 'football'}
            fetchPlayingSeven={sportsType === 'kabaddi'}
            fetchPlayingFive={sportsType === 'basketball'}
            LineUpsOut
            fetchMatchPlayer
            isShowAddButton
            permission={(Auth && Auth === 'SUPER') || (adminPermission?.MATCHPLAYER !== 'N' && adminPermission.MATCHPLAYER !== 'R')}
          />
          <MatchPlayerComponent
            {...props}
            ref={content}
            List={matchPlayerList}
            UpdateMatchPlayer={UpdatePlayer}
            MatchDetails={MatchDetails}
            editLink={`/${sportsType}/match-management/match-player-management/update-match-player/${match.params.id}`}
            getList={getList}
            search={searchValue}
            flag={initialFlag}
            playerRoleList={playerRoleList}
          />
        </section>
      </main>
    </Fragment>
  )
}

IndexPlayerManagement.propTypes = {
  location: PropTypes.object,
  match: PropTypes.object
}

export default IndexPlayerManagement
