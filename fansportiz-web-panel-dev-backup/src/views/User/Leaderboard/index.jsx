import React from 'react'
import UserHeader from '../components/UserHeader'
import LeaderboardPage from './Leaderboard'
import { FormattedMessage } from 'react-intl'
function Leaderboard (props) {
  return (
    <>
      <UserHeader {...props} backURL="/profile" title={<FormattedMessage id="Leaderboard" />}/>
      <LeaderboardPage />
    </>
  )
}

export default Leaderboard
