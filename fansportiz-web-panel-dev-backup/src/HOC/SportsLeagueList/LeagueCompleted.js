import React, { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { listofjoinedLeague, getMatchLeagueDetails } from '../../redux/actions/league'
import { getMyTeamList, getMyTeamPlayerList } from '../../redux/actions/team'
import { getMatchDetails } from '../../redux/actions/match'
import { listMatchPlayer, getPlayerScorePoints, getPlayerSeasonNames, getUniquePlayers } from '../../redux/actions/player'
import { getMyTeamLeaderBoardList, getAllTeamLeaderBoardList } from '../../redux/actions/leaderBoard'
import { getFetchLiveInnings } from '../../redux/actions/scoreCard'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'

function LeagueCompleted (Component) {
  const MyComponent = (props) => {
    const { activeTab, leaguesInfo } = props
    const [loading, setLoading] = useState(false)
    const [joinedLoading, setJoinedLoading] = useState(false)
    const [loadingScorecard, setLoadingScorecard] = useState(false)
    const [url, setUrl] = useState('')
    const [allTeam, setAllTeam] = useState([])
    const [joinedData, setJoinedData] = useState([])
    const [Details, setDetailss] = useState({})
    const [selectedTeamCompare, setSelectedTeamCompare] = useState([])
    const [firstTeam, setFirstTeam] = useState({})
    const [secondTeam, setSecondTeam] = useState({})
    const [limit] = useState(50)
    const [offset] = useState(0)

    const dispatch = useDispatch()
    const matchLeagueDetails = useSelector(state => state.league.matchLeagueDetails)
    const matchDetails = useSelector(state => state.match.matchDetails)
    const joinedLeagueList = useSelector(state => state.league.joinedLeagueList)
    const teamList = useSelector(state => state.team.teamList)
    const allLeaderBoardList = useSelector(state => state.leaderBoard.allLeaderBoardList)
    const myTeamsLeaderBoardList = useSelector(state => state.leaderBoard.myTeamsLeaderBoardList)
    const teamPlayerList = useSelector(state => state.team.teamPlayerList)
    const matchPlayerMatchId = useSelector(state => state.team.matchPlayerMatchId)
    const playerMatchPlayerMatchId = useSelector(state => state.player.matchPlayerMatchId)
    const bCached = useSelector(state => state.leaderBoard.bCached)
    const bFullResponse = useSelector(state => state.leaderBoard.bFullResponse)
    const nPutTime = useSelector(state => state.leaderBoard.nPutTime)
    const matchPlayerList = useSelector(state => state.player.matchPlayer)
    const pointBreakUp = useSelector(state => state.player.pointBreakUp)
    const getUrlLink = useSelector(state => state.url.getUrl)
    const nScoredPoints = useSelector(state => state.player.nScoredPoints)
    const playerData = useSelector(state => state.player.playerData)
    const uniquePlayerLeagueList = useSelector(state => state.player.uniquePlayerLeagueList)
    const uniquePlayerList = useSelector(state => state.player.uniquePlayerList)
    const currencyLogo = useSelector(state => state.settings.currencyLogo)
    const userData = useSelector(state => state.auth.userData) || JSON.parse(localStorage.getItem('userData'))
    const token = useSelector(state => state.auth.token) || localStorage.getItem('Token')
    const fullLiveInning = useSelector(state => state.scoreCard.fullLiveInning)
    const isFetchLiveInning = useSelector(state => state.scoreCard.isFetchLiveInning)
    const previousProps = useRef({
      isFetchLiveInning, teamPlayerList, matchDetails, getUrlLink, joinedLeagueList, matchLeagueDetails, activeTab, myTeamsLeaderBoardList, teamList, matchPlayerList, allLeaderBoardList, token
    }).current

    const { sMatchId, sLeagueId, sportsType } = useParams()

    useEffect(() => {
      if (sLeagueId && token) {
        dispatch(getMatchLeagueDetails(sLeagueId, token))
      }
      if (getUrlLink && token) {
        setUrl(getUrlLink)
      }
      if ((!matchDetails || (matchDetails && matchDetails._id && sMatchId !== matchDetails._id)) && token) {
        dispatch(getMatchDetails(sMatchId, sportsType, token))
        setLoadingScorecard(true)
      }
      if ((token && matchPlayerMatchId !== sMatchId) || !teamPlayerList) {
        dispatch(getMyTeamPlayerList(sMatchId, token))
      }
      if ((token && playerMatchPlayerMatchId !== sMatchId) || !matchPlayerList) {
        dispatch(listMatchPlayer(sMatchId, token))
      }
    }, [token])

    useEffect(() => {
      if (previousProps.isFetchLiveInning !== isFetchLiveInning) {
        if (isFetchLiveInning) {
          setJoinedLoading(false)
        }
      }
      return () => {
        previousProps.isFetchLiveInning = isFetchLiveInning
      }
    }, [isFetchLiveInning])

    useEffect(() => {
      if (previousProps.matchDetails !== matchDetails) {
        if (matchDetails && matchDetails._id) {
          setLoadingScorecard(false)
        }
      }
      return () => {
        previousProps.matchDetails = matchDetails
      }
    }, [matchDetails])

    useEffect(() => {
      if (previousProps.getUrlLink !== getUrlLink) {
        if (getUrlLink && getUrlLink.length !== 0) {
          setUrl(getUrlLink)
        }
      }
      return () => {
        previousProps.getUrlLink = getUrlLink
      }
    }, [getUrlLink])

    function addCompare (Team) {
      if (!selectedTeamCompare.includes(Team._id) && selectedTeamCompare.length !== 2) {
        if (selectedTeamCompare && selectedTeamCompare.length !== 0) {
          if (firstTeam && firstTeam._id) {
            setSecondTeam(Team)
          } else if (secondTeam && secondTeam._id) {
            setFirstTeam(Team)
          }
        } else {
          setFirstTeam(Team)
        }
        setSelectedTeamCompare([...selectedTeamCompare, Team._id])
      } else {
        if (selectedTeamCompare.includes(Team._id)) {
          const FilterData = selectedTeamCompare && selectedTeamCompare.length !== 0 && selectedTeamCompare.filter(data => data !== Team._id)
          setSelectedTeamCompare(FilterData)
          if (firstTeam._id === Team._id) {
            setFirstTeam({})
          } else if (secondTeam._id === Team._id) {
            setSecondTeam({})
          }
        }
      }
    }

    function clearTeamSelected () {
      setSelectedTeamCompare([])
      setFirstTeam({})
      setSecondTeam({})
    }

    useEffect(() => {
      if (previousProps.allLeaderBoardList !== allLeaderBoardList) {
        if (allLeaderBoardList && allLeaderBoardList.length !== 0) {
          const data = allLeaderBoardList.sort((a, b) => b.nTotalPoints - a.nTotalPoints).filter((teamLeaderboard) => teamLeaderboard.iUserId !== userData?._id)
          setAllTeam(data)
          setLoading(false)
        }
      }
      return () => {
        previousProps.allLeaderBoardList = allLeaderBoardList
      }
    }, [allLeaderBoardList])

    useEffect(() => {
      if (matchPlayerList && matchPlayerList.length !== 0) {
        setLoading(false)
      }
      return () => {
        previousProps.matchPlayerList = matchPlayerList
      }
    }, [matchPlayerList])

    useEffect(() => {
      if (previousProps.activeTab !== activeTab) {
        if (sMatchId && !leaguesInfo) {
          if (activeTab === '1' && token) {
            dispatch(listofjoinedLeague(sMatchId, token))
            setJoinedLoading(true)
          } else if (activeTab === '2' && token) {
            dispatch(getMyTeamList(sMatchId, token))
          } else if (activeTab === '3' && token) {
            dispatch(listMatchPlayer(sMatchId, token))
            dispatch(getUniquePlayers(sMatchId, token))
          } else if (activeTab === '4') {
            dispatch(getFetchLiveInnings(sMatchId, ''))
            setJoinedLoading(true)
          }
          setLoading(true)
        } else {
          if (activeTab === '2' && sLeagueId && token) {
            dispatch(getMyTeamLeaderBoardList(sLeagueId, token))
            dispatch(getAllTeamLeaderBoardList(limit, offset, sLeagueId, token, nPutTime))
            dispatch(getMyTeamList(sMatchId, token))
            setLoading(true)
          } else if (activeTab === '3' && token) {
            dispatch(listMatchPlayer(sMatchId, token))
            dispatch(getUniquePlayers(sMatchId, token))
            setLoading(true)
          } else if (activeTab === '4') {
            dispatch(getFetchLiveInnings(sMatchId, ''))
            setJoinedLoading(true)
          }
        }
      } else {
        if (sMatchId && !leaguesInfo) {
          if (activeTab === '1' && token) {
            dispatch(listofjoinedLeague(sMatchId, token))
            setJoinedLoading(true)
          } else if (activeTab === '2' && token) {
            dispatch(getMyTeamList(sMatchId, token))
            !leaguesInfo && token && dispatch(listofjoinedLeague(sMatchId, token))
          } else if (activeTab === '3' && token) {
            dispatch(listMatchPlayer(sMatchId, token))
            dispatch(getUniquePlayers(sMatchId, token))
          } else if (activeTab === '4') {
            dispatch(getFetchLiveInnings(sMatchId, ''))
            setJoinedLoading(true)
          }
          setLoading(true)
        } else {
          if ((activeTab === '2' || activeTab === 2) && sLeagueId && token) {
            dispatch(getMyTeamLeaderBoardList(sLeagueId, token))
            dispatch(getAllTeamLeaderBoardList(limit, offset, sLeagueId, token, nPutTime))
            dispatch(getMyTeamList(sMatchId, token))
            !leaguesInfo && dispatch(listofjoinedLeague(sMatchId, token))
            setLoading(true)
          } else if (activeTab === '3' && token) {
            dispatch(listMatchPlayer(sMatchId, token))
            dispatch(getUniquePlayers(sMatchId, token))
            setLoading(true)
          } else if (activeTab === '1' && !leaguesInfo && token) {
            dispatch(listofjoinedLeague(sMatchId, token))
            setJoinedLoading(true)
          } else if (activeTab === '4') {
            dispatch(getFetchLiveInnings(sMatchId, ''))
            setJoinedLoading(true)
          }
        }
      }
      return () => {
        previousProps.activeTab = activeTab
      }
    }, [activeTab, token])

    useEffect(() => {
      if (previousProps.joinedLeagueList !== joinedLeagueList) {
        if (joinedLeagueList) {
          setJoinedData(joinedLeagueList)
          setJoinedLoading(false)
          setLoading(false)
        }
      }
      return () => {
        previousProps.joinedLeagueList = joinedLeagueList
      }
    }, [joinedLeagueList])

    useEffect(() => {
      if (previousProps.teamList !== teamList) {
        if (teamList) {
          setLoading(false)
        }
      }
      return () => {
        previousProps.teamList = teamList
      }
    }, [teamList])

    useEffect(() => {
      if (previousProps.matchLeagueDetails !== matchLeagueDetails) {
        if (matchLeagueDetails) {
          setDetailss(matchLeagueDetails)
        }
      }
      return () => {
        previousProps.matchLeagueDetails = matchLeagueDetails
      }
    }, [matchLeagueDetails])

    function playerScorePoints (pID) {
      token && dispatch(getPlayerScorePoints(pID, token))
      token && dispatch(getPlayerSeasonNames(pID, token))
    }

    function gatTeamList () {
      if (sMatchId) {
        token && dispatch(getMyTeamList(sMatchId, token))
      }
    }

    function getMyTeamLeaderBoardListFunc () {
      dispatch(getMyTeamLeaderBoardList(sLeagueId, token))
    }

    function onUniquePlayers () {
      if (sMatchId) {
        token && dispatch(getUniquePlayers(sMatchId, token))
      }
    }

    function myAllTeamPagination (limit, offset) {
      const leagueId = sLeagueId
      token && dispatch(getAllTeamLeaderBoardList(limit, offset, leagueId, token, nPutTime))
    }

    return (
      <Component
        {...props}
        addCompare={addCompare}
        allLeaderBoardList={allTeam}
        bCached={bCached}
        bFullResponse={bFullResponse}
        clearTeamSelected={clearTeamSelected}
        currencyLogo={currencyLogo}
        firstTeam={firstTeam}
        fullLiveInning={fullLiveInning}
        getMyTeamLeaderBoardListFunc={getMyTeamLeaderBoardListFunc}
        getMyTeamList={gatTeamList}
        joinedLeagueList={joinedData}
        joinedLoading={joinedLoading}
        leagueDetails={Details}
        loading={loading}
        loadingScorecard={loadingScorecard}
        matchDetails={matchDetails}
        matchPlayerList={matchPlayerList}
        myAllTeamPagination={myAllTeamPagination}
        myTeamsLeaderBoardList={myTeamsLeaderBoardList}
        nScoredPoints={nScoredPoints}
        onUniquePlayers={onUniquePlayers}
        otherTeamJoinList={allLeaderBoardList}
        participate
        playerData={playerData}
        playerScorePoints={playerScorePoints}
        pointBreakUp={pointBreakUp}
        secondTeam={secondTeam}
        selectedTeamCompare={selectedTeamCompare}
        setLoading={setLoading}
        teamList={teamList}
        teamPlayerList={teamPlayerList}
        token={token}
        uniquePlayerLeagueList={uniquePlayerLeagueList}
        uniquePlayerList={uniquePlayerList}
        url={url}
        userData={userData}
      />
    )
  }
  MyComponent.propTypes = {
    activeTab: PropTypes.bool,
    leaguesInfo: PropTypes.any
  }
  MyComponent.displayName = MyComponent
  return MyComponent
}

export default LeagueCompleted
