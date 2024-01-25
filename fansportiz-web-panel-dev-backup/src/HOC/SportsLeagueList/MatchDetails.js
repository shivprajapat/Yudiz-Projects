import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getMyTeamPlayerList } from '../../redux/actions/team'
import { getUniquePlayers, getUniquePlayersLeague } from '../../redux/actions/player'
import { getMatchDetails } from '../../redux/actions/match'
import PropTypes from 'prop-types'
import { useLocation } from 'react-router-dom'

export const MatchDetails = (Component) => {
  const MyComponent = (props) => {
    const dispatch = useDispatch()
    const matchDetails = useSelector(state => state.match.matchDetails)
    const token = useSelector(state => state.auth.token) || localStorage.getItem('Token')
    const getUrlLink = useSelector(state => state.url.getUrl)
    const teamPlayerList = useSelector(state => state.team.teamPlayerList)
    const uniquePlayerList = useSelector(state => state.player.uniquePlayerList)
    const uniquePlayerLeagueList = useSelector(state => state.player.uniquePlayerLeagueList)

    const location = useLocation()

    function onGetMatchDetails (ID) {
      if (ID && token) {
        dispatch(getMatchDetails(ID, '', token))
      }
    }

    function onMatchPlayer (id) {
      if (id) {
        dispatch(getMyTeamPlayerList(id))
      }
    }

    function onUniquePlayer (id) {
      if (token && id) {
        dispatch(getUniquePlayers(id, token))
      }
    }

    function onUniquePlayerLeague (id) {
      if (token && id) {
        dispatch(getUniquePlayersLeague(id, token))
      }
    }

    return (
      <Component
        {...props}
        data={matchDetails || location?.state?.data}
        onGetMatchDetails={onGetMatchDetails}
        onMatchPlayer={onMatchPlayer}
        onUniquePlayer={onUniquePlayer}
        onUniquePlayerLeague={onUniquePlayerLeague}
        teamPlayerList={teamPlayerList}
        token={token}
        uniquePlayerLeagueList={uniquePlayerLeagueList}
        uniquePlayerList={uniquePlayerList}
        url={getUrlLink}
      />
    )
  }
  MyComponent.propTypes = {
    match: PropTypes.object,
    location: PropTypes.any
  }
  MyComponent.displayName = MyComponent
  return MyComponent
}

export default MatchDetails
