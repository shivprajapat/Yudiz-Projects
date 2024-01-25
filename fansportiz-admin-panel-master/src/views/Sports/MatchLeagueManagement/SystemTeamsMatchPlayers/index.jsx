import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Navbar from '../../../../components/Navbar'
import SportsHeader from '../../SportsHeader'
import SystemTeamMatchPlayers from './SystemTeamMatchPlayers'

function SystemTeamIndex (props) {
  const { match } = props
  const sportsType = props.location.pathname.includes('cricket') ? 'cricket' : props.location.pathname.includes('football') ? 'football' : props.location.pathname.includes('basketball') ? 'basketball' : props.location.pathname.includes('kabaddi') ? 'kabaddi' : ''

  return (
    <Fragment>
      <Navbar {...props} />
      <main className="main-content">
        <section className="management-section common-box">
          <SportsHeader
            heading='Match Players For Bot'
            matchLeaguePage={`/${sportsType}/match-management/match-league-management/${match.params.id1}`}
            hidden
          />
          <SystemTeamMatchPlayers
            {...props}
            matchLeaguePage={`/${sportsType}/match-management/match-league-management/${match.params.id1}`}
          />
        </section>
      </main>
    </Fragment>
  )
}

SystemTeamIndex.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object
}

export default SystemTeamIndex
