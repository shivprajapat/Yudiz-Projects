import React from 'react'
import PropTypes from 'prop-types'
import UserHeader from '../../User/components/UserHeader'
import TeamComparePage from './TeamCompare'
import { FormattedMessage } from 'react-intl'

function TeamCompare (props) {
  return (
    <>
      <UserHeader {...props} title={<FormattedMessage id="Team_Compare" />} />
      <TeamComparePage {...props} />
    </>
  )
}
TeamCompare.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object,
  userTeam: PropTypes.object,
  userCompareTeamData: PropTypes.object,
  token: PropTypes.string,
  getMatchPlayerList: PropTypes.func
}
export default TeamCompare
