import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AddMatch from './AddMatch'
import PropTypes from 'prop-types'
import { getFormatsList } from '../../../../actions/pointSystem'
import { addMatch, getMatchDetails, updateMatch } from '../../../../actions/match'
import { getTeamName } from '../../../../actions/team'
import Navbar from '../../../../components/Navbar'

function IndexAddMatch (props) {
  const { match } = props
  const [matchId, setMatchId] = useState('')
  const dispatch = useDispatch()
  const token = useSelector(state => state.auth.token)
  const teamName = useSelector(state => state.team.teamName)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const eCategory = props.location.pathname.includes('cricket') ? 'cricket' : props.location.pathname.includes('football') ? 'football' : props.location.pathname.includes('basketball') ? 'basketball' : props.location.pathname.includes('baseball') ? 'baseball' : props.location.pathname.includes('kabaddi') ? 'kabaddi' : ''
  const FormatsList = useSelector(state => state.pointSystem.getFormatsList)

  useEffect(() => {
    if (match.params.id) {
      getMatchDetailsFunc()
      setMatchId(match.params.id)
    }
    const start = 0
    if ((Auth === 'SUPER') || (adminPermission?.TEAM === 'W')) {
      dispatch(getTeamName(eCategory, token, start, 10, ''))
    }
    dispatch(getFormatsList((eCategory).toUpperCase(), token))
  }, [])

  function getMatchDetailsFunc () {
    dispatch(getMatchDetails(match.params.id, token))
  }

  function AddMatchFunc (Series, seasonId, seasonName, SeasonKey, MatchName, MatchFormat, StartDate, TeamAName, TeamBName, TeamAScore, TeamBScore, Venue, matchOnTop, TossWinner, ChooseTossWinner, bDisabled, MaxTeamLimit, sSponsoredText, FantasyPostID, StreamURL, StreamType, matchKey, info, winningText, scoreCardFlag) {
    const addMatchData = {
      Series, seasonId, seasonName, SeasonKey, MatchName, MatchFormat, StartDate, TeamAName, TeamBName, TeamAScore, TeamBScore, Venue, eCategory, matchOnTop, TossWinner, ChooseTossWinner, bDisabled, MaxTeamLimit, sSponsoredText, FantasyPostID, StreamURL, StreamType, matchKey, info, winningText, scoreCardFlag, token
    }
    dispatch(addMatch(addMatchData))
  }

  function getTeamNameFun (Start, Search) {
    dispatch(getTeamName(eCategory, token, Start, 10, Search))
  }

  function UpdateMatchFunc (Series, seasonId, seasonName, SeasonKey, MatchName, MatchFormat, StartDate, TeamAName, TeamBName, TeamAScore, TeamBScore, Venue, MatchStatus, TossWinner, ChooseTossWinner, matchOnTop, bDisabled, MaxTeamLimit, sSponsoredText, FantasyPostID, StreamURL, StreamType, matchKey, info, winningText, scoreCardFlag) {
    const updateMatchData = {
      Series, seasonId, seasonName, SeasonKey, MatchName, MatchFormat, StartDate, TeamAName, TeamBName, TeamAScore, TeamBScore, Venue, MatchStatus, TossWinner, ChooseTossWinner, matchOnTop, eCategory, token, ID: matchId, bDisabled, MaxTeamLimit, sSponsoredText, FantasyPostID, StreamURL, StreamType, matchKey, info, winningText, scoreCardFlag
    }
    dispatch(updateMatch(updateMatchData))
  }

  return (
    <div>
      <Navbar {...props} />
      <AddMatch
        {...props}
        AddMatchFunc={AddMatchFunc}
        UpdateMatch={UpdateMatchFunc}
        teamName={teamName}
        getTeamName={getTeamNameFun}
        SportsType={eCategory}
        FormatsList={FormatsList}
        getMatchDetailsFunc={getMatchDetailsFunc}
        mergeMatchPage={`/${eCategory}/match-management/merge-match`}
        matchLeague={`/${eCategory}/match-management/match-league-management/${matchId}`}
        matchPlayer={`/${eCategory}/match-management/match-player-management/${matchId}`}
        matchReport={`/${eCategory}/match-management/match-report/${matchId}`}
      />
    </div>
  )
}

IndexAddMatch.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object
}

export default IndexAddMatch
