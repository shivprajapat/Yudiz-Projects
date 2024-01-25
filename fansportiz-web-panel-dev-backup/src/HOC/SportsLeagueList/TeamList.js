import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getMyTeamList, getUserTeam, getCompareUserTeam, getMyTeamPlayerList, getDreamTeam } from '../../redux/actions/team'
import { getMatchDetails } from '../../redux/actions/match'
import { listMatchPlayer } from '../../redux/actions/player'
import { getAllTeamLeaderBoardList, getMyTeamLeaderBoardList } from '../../redux/actions/leaderBoard'
import PropTypes from 'prop-types'
import { useLocation, useParams } from 'react-router-dom'
import useActiveSports from '../../api/activeSports/queries/useActiveSports'

export const TeamList = (Component) => {
  const MyComponent = (props) => {
    const { activeTab, notCalling } = props
    const [userTeamData, setUserTeamData] = useState({})
    const [loading, setLoading] = useState(false)
    const [url, setUrl] = useState('')
    const [modalOpen, setModalOpen] = useState(false)
    const [message, setMessage] = useState('')
    const dispatch = useDispatch()
    const teamList = useSelector(state => state.team.teamList)
    const userTeam = useSelector(state => state.team.userTeam)
    const dreamTeam = useSelector(state => state.team.dreamTeam)
    const teamPlayerList = useSelector(state => state.team.teamPlayerList)
    const matchDetails = useSelector(state => state.match.matchDetails)
    const getUrlLink = useSelector(state => state.url.getUrl)
    const userCompareTeam = useSelector(state => state.team.userCompareTeam)
    const matchPlayer = useSelector(state => state.player.matchPlayer)
    const myTeamsLeaderBoardList = useSelector(state => state.leaderBoard.myTeamsLeaderBoardList)
    const allLeaderBoardList = useSelector(state => state.leaderBoard.allLeaderBoardList)
    const nPutTime = useSelector(state => state.leaderBoard.nPutTime)
    const token = useSelector(state => state.auth.token) || localStorage.getItem('Token')
    const { data: activeSports } = useActiveSports()
    const teamResMessage = useSelector(state => state.team.resMessage)

    const { sportsType, sMatchId } = useParams()
    const location = useLocation()

    const playerRoles = activeSports && activeSports.find(sport => sport.sKey === ((sportsType).toUpperCase())) && activeSports.find(sport => sport.sKey === ((sportsType).toUpperCase())).aPlayerRoles
    const previousProps = useRef({
      teamList, userTeam, activeTab, userCompareTeam, matchDetails, teamPlayerList, getUrlLink, dreamTeam
    }).current

    async function redirection () {
      if (location?.pathname.includes('/dream-team-preview') && sMatchId && token) {
        myTeamPlayerList(sMatchId)
      }
      if (sMatchId) { // handle the initialize
        myTeamPlayerList(sMatchId)
        await !notCalling && myTeamList()
      }
      if (sMatchId && sportsType && token && !teamPlayerList) {
        myTeamPlayerList(sMatchId)
        // dispatch(getMyTeamPlayerList(sMatchId, token))
        dispatch(getMatchDetails(sMatchId, sportsType, token))
        dispatch(getMyTeamList(sMatchId, token))
        setLoading(true)
      }
    }

    useEffect(() => {
      redirection()

      // if (teamPlayerList && teamPlayerList.length >= 1 && (id && teamPlayerList[0].iMatchId !== id)) {
      //   await dispatch(getMyTeamPlayerList(id, token))
      // } else if (teamPlayerList && teamPlayerList.length >= 1 && (sMatchId && teamPlayerList[0].iMatchId !== sMatchId)) {
      //   await dispatch(getMyTeamPlayerList(sMatchId, token))
      // }
    }, [token])

    useEffect(() => {
      if (message) {
        setTimeout(() => setModalOpen(false), 5000)
      }
    }, [message])

    useEffect(() => {
      if (previousProps.teamList !== teamList) { // handle the loader
        if (teamList) {
          setLoading(false)
        }
      }
      return () => {
        previousProps.teamList = teamList
      }
    }, [teamList])

    useEffect(() => {
      if (previousProps.getUrlLink !== getUrlLink) { // handle the response
        if (getUrlLink) {
          setUrl(getUrlLink)
        }
      }
      return () => {
        previousProps.getUrlLink = getUrlLink
      }
    }, [getUrlLink])

    useEffect(() => {
      if (previousProps.userTeam !== userTeam) { // handle the loader
        if (userTeam) {
          setUserTeamData(userTeam)
          setLoading(false)
        }
      }
      return () => {
        previousProps.userTeam = userTeam
      }
    }, [userTeam])

    useEffect(() => {
      if (previousProps.dreamTeam !== dreamTeam) {
        if (dreamTeam) {
          setUserTeamData(dreamTeam)
          setLoading(false)
        }
      }

      return () => {
        previousProps.dreamTeam = dreamTeam
      }
    }, [dreamTeam])

    useEffect(() => {
      if (previousProps.teamPlayerList !== teamPlayerList) { // handle the loader
        if (teamPlayerList) {
          setLoading(false)
        }
      }
      return () => {
        previousProps.teamPlayerList = teamPlayerList
      }
    }, [teamPlayerList])

    function getUserTeamFun (userTeamId) {
      token && dispatch(getUserTeam(userTeamId, token))
    }

    function getUserCompareTeamFun (userTeamId) {
      token && dispatch(getCompareUserTeam(userTeamId, token))
    }

    function refreshContent () {
      myTeamList()
    }

    function getMatchPlayerList (Id) {
      if (Id) {
        token && dispatch(listMatchPlayer(Id, token))
      }
    }

    function myTeamList () {
      if (token && sMatchId) {
        dispatch(getMyTeamList(sMatchId, token))
        setLoading(true)
      }
    }

    function getDreamTeamFunc (sMatchId, token) {
      dispatch(getDreamTeam(sMatchId, token))
      setLoading(true)
    }

    function myTeamPlayerList (matchId) {
      dispatch(getMyTeamPlayerList(matchId, token))
      setLoading(true)
    }

    function getMyTeamLeaderBoardListFunc (leagueId) {
      dispatch(getMyTeamLeaderBoardList(leagueId, token))
    }

    function myAllTeamPagination (limit, offset, leagueId) {
      dispatch(getAllTeamLeaderBoardList(limit, offset, leagueId, token, nPutTime))
    }

    return (
      <Component
        {...props}
        allLeaderBoardList={allLeaderBoardList}
        dreamTeam={dreamTeam}
        getDreamTeamFunc={getDreamTeamFunc}
        getMatchPlayerList={getMatchPlayerList}
        getMyTeamLeaderBoardListFunc={getMyTeamLeaderBoardListFunc}
        getUserCompareTeam={getUserCompareTeamFun}
        getUserTeam={getUserTeamFun}
        loading={loading}
        matchDetails={matchDetails}
        matchPlayer={matchPlayer}
        message={message}
        modalOpen={modalOpen}
        myAllTeamPagination={myAllTeamPagination}
        myTeamList={myTeamList}
        myTeamsLeaderBoardList={myTeamsLeaderBoardList}
        playerRoles={playerRoles}
        refreshContent={refreshContent}
        setLoading={setLoading}
        setMessage={setMessage}
        setModalOpen={setModalOpen}
        sportsType={sportsType}
        teamList={teamList}
        teamPlayerList={teamPlayerList}
        teamResMessage={teamResMessage}
        token={token}
        url={url}
        userTeam={userTeamData}
      />
    )
  }
  MyComponent.propTypes = {
    match: PropTypes.object,
    activeTab: PropTypes.string,
    notCalling: PropTypes.bool
  }
  return MyComponent
}

export default TeamList
