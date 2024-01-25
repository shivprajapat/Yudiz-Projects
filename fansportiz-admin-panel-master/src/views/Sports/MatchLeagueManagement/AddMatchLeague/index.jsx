import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AddMatchLeague from './AddMatchLeague'
import NavbarComponent from '../../../../components/Navbar'
import PropTypes from 'prop-types'
import { getLeagueName } from '../../../../actions/league'
import { AddCricketMatchLeague } from '../../../../actions/matchleague'

function IndexAddMatchLeague (props) {
  const {
    match
  } = props
  const [matchId, setMatchId] = useState('')
  const dispatch = useDispatch()
  const token = useSelector(state => state.auth.token)
  const LeagueName = useSelector(state => state.league.LeagueNameList)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const sportsType = props.location.pathname.includes('cricket') ? 'cricket' : props.location.pathname.includes('football') ? 'football' : props.location.pathname.includes('basketball') ? 'basketball' : props.location.pathname.includes('kabaddi') ? 'kabaddi' : ''

  useEffect(() => {
    if (match.params.id1) {
      setMatchId(match.params.id1)
    }
    if ((Auth && Auth === 'SUPER') || (adminPermission?.LEAGUE !== 'N')) {
      dispatch(getLeagueName(sportsType, token))
    }
  }, [])

  function funcAddMatchLeague (ID, LeagueID) {
    dispatch(AddCricketMatchLeague(ID, LeagueID, token))
  }

  return (
    <div>
      <NavbarComponent {...props} />
      <AddMatchLeague
        {...props}
        LeagueNames={LeagueName}
        FuncAddMatchLeague={funcAddMatchLeague}
        cancelLink={`/${sportsType}/match-management/match-league-management/${matchId}`}
      ></AddMatchLeague>
    </div>
  )
}

IndexAddMatchLeague.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object
}

export default IndexAddMatchLeague
