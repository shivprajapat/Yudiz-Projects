import React from 'react'
import UserHeader from '../../User/components/UserHeader'
import ShareContestPage from './ShareContest'
import { useParams } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
function ShareContest (props) {
  const { sMatchId, sportsType } = useParams()

  return (
    <>
      <UserHeader {...props} backURL={`/upcoming-match/leagues/${sportsType}/${sMatchId}?activeTab=2`} title={<FormattedMessage id='Invite_A_Friend' />} />
      <ShareContestPage {...props} matchId={sMatchId}/>
    </>
  )
}

export default ShareContest
