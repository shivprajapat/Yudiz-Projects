import React, { useState } from 'react'
import LeagueHeader from '../components/LeagueHeader'
import LeaguesDetailPage from './LeaguesDetail'
import PropTypes from 'prop-types'
import { useParams, useSearchParams } from 'react-router-dom'

function LeaguesDetail (props) {
  const [paymentSlide, setPaymentSlide] = useState(false)
  const [VideoStream, setVideoStream] = useState(false)

  const { sMatchId, sportsType } = useParams()
  const [searchParams] = useSearchParams()
  const homePage = searchParams.get('homePage')

  return (
    <>
      <LeagueHeader {...props}
        VideoStream={VideoStream}
        goToBack={`/upcoming-match/leagues/${sportsType}/${sMatchId}`}
        insideLeagueDetails
        paymentSlide={paymentSlide}
        search={homePage ? 'homePage=yes' : ''}
        setPaymentSlide={setPaymentSlide}
        setVideoStream={setVideoStream}
        showBalance
      />
      <LeaguesDetailPage {...props}
        leagueDetailsPage
        paymentSlide={paymentSlide}
        setPaymentSlide={setPaymentSlide}
        switching
      />
    </>
  )
}

LeaguesDetail.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string
  }),
  match: PropTypes.object,
  homePage: PropTypes.string
}

export default LeaguesDetail
