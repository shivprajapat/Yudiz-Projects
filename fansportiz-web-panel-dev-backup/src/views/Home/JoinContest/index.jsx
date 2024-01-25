import React from 'react'
import PropTypes from 'prop-types'
import UserHeader from '../../User/components/UserHeader'
import JoinContestPage from './JoinContest'
import { FormattedMessage } from 'react-intl'
import { useParams, useSearchParams } from 'react-router-dom'

function JoinContest (props) {
  const { sMatchId, sportsType } = useParams()
  const [searchParams] = useSearchParams()
  const homePage = searchParams.get('homePage')

  return (
    <>
      <UserHeader {...props} backURL={homePage ? `/upcoming-match/leagues/${sportsType}/${sMatchId}?homePage=yes` : `/upcoming-match/leagues/${sportsType}/${sMatchId}`} title={<FormattedMessage id='Join_contest' />}/>
      <JoinContestPage {...props}/>
    </>
  )
}

JoinContest.propTypes = {
  match: PropTypes.object,
  location: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string
  })
}

export default JoinContest
