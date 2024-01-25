import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getMatchDetails } from '../../../../actions/match'
import { AddMatchPlayer, getMatchPlayerDetails, UpdateMatchPlayer } from '../../../../actions/matchplayer'
import { getPlayerRoleList } from '../../../../actions/playerRole'
import Navbar from '../../../../components/Navbar'
import EditMatchPlayerDetails from './EditMatchPlayerDetails'
import PropTypes from 'prop-types'
import { getPlayersList, getPlayersTotalCount } from '../../../../actions/player'

function IndexUpdateMatchPlayer (props) {
  const [matchId, setMatchId] = useState('')
  const [matchPlayerId, setMatchPlayerId] = useState('')
  const token = useSelector(state => state.auth.token)
  const matchPlayerDetails = useSelector(state => state.matchplayer.matchPlayerDetails)
  const matchDetails = useSelector(state => state.match.matchDetails)
  const playerRoleList = useSelector(state => state.playerRole.playerRoleList)
  const teamName = useSelector(state => state.team.teamName)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const dispatch = useDispatch()
  const sportsType = props.location.pathname.includes('cricket') ? 'cricket' : props.location.pathname.includes('football') ? 'football' : props.location.pathname.includes('basketball') ? 'basketball' : props.location.pathname.includes('kabaddi') ? 'kabaddi' : ''

  // dispatch action to add new match player
  function AddNewMatchPlayer (aPlayers, scorePoints, seasonPoints, TeamName, show) {
    const addMatchPlayerData = {
      aPlayers, scorePoints, seasonPoints, TeamName, show, sportsType, token, matchId
    }
    dispatch(AddMatchPlayer(addMatchPlayerData))
  }

  // dispatch action to update match player
  function UpdatePlayer (playerName, playerId, playerImage, playerRole, credits, scorePoints, seasonPoints, TeamName, show, id) {
    const updateMatchPlayerData = {
      playerName, playerId, playerImage, playerRole, credits, scorePoints, seasonPoints, TeamName, show, sportsType, matchId, matchPlayerId: id, token
    }
    dispatch(UpdateMatchPlayer(updateMatchPlayerData))
  }

  function getList (start, limit, sort, order, searchText, provider) {
    const getPlayerList = {
      start, limit, sort, order, searchText: searchText.trim(), provider, sportsType, token
    }
    dispatch(getPlayersList(getPlayerList))
  }

  function getPlayersTotalCountFunc (searchText, provider) {
    const data = {
      searchText, provider, sportsType, token
    }
    dispatch(getPlayersTotalCount(data))
  }

  useEffect(() => {
    const { match } = props
    if (match.params.id1 && match.params.id2) {
      if ((Auth && Auth === 'SUPER') || (adminPermission?.MATCHPLAYER !== 'N')) {
        dispatch(getMatchPlayerDetails(match.params.id2, token))
      }
      setMatchId(match.params.id1)
      setMatchPlayerId(match.params.id2)
    }
    if (match.params.id1) {
      setMatchId(match.params.id1)
    }
    if ((Auth && Auth === 'SUPER') || (adminPermission?.MATCH !== 'N')) {
      dispatch(getMatchDetails(match.params.id1, token))
    }
    if ((Auth && Auth === 'SUPER') || (adminPermission?.ROLES !== 'N')) {
      dispatch(getPlayerRoleList(sportsType, token))
    }
  }, [])

  return (
    <div>
      <Navbar {...props} />
      <EditMatchPlayerDetails
        {...props}
        AddNewMatchPlayer={AddNewMatchPlayer}
        // AddMultipleMatchPlayer={AddMultipleMatchPlayer}
        UpdateMatchPlayer={UpdatePlayer}
        playerRoleList={playerRoleList}
        teamName={teamName}
        matchPlayerDetails={matchPlayerDetails}
        matchDetails={matchDetails}
        getMatchDetails={getMatchDetails}
        cancelLink={`/${sportsType}/match-management/match-player-management/${matchId}`}
        aScorePoint={`/${sportsType}/match-management/match-player-management/score-points/${matchId}`}
        eScorePoint={`/${sportsType}/match-management/match-player-management/score-points/${matchId}/${matchPlayerId}`}
        getList={getList}
        getPlayersTotalCountFunc={getPlayersTotalCountFunc}

      />
    </div>
  )
}

IndexUpdateMatchPlayer.propTypes = {
  location: PropTypes.object,
  match: PropTypes.object
}

export default IndexUpdateMatchPlayer
