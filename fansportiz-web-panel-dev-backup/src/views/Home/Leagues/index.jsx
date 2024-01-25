import React, { useState } from 'react'
import LeagueHeader from '../components/LeagueHeader'
import LeaguesPage from './Leagues'
import PropTypes from 'prop-types'
import { useParams, useSearchParams } from 'react-router-dom'

function Leagues (props) {
  const [VideoStream, setVideoStream] = useState(false)
  const [paymentSlide, setPaymentSlide] = useState(false)

  const { sportsType } = useParams()
  const [searchParams] = useSearchParams()
  const homePage = searchParams.get('homePage')

  return (
    <>
      <LeagueHeader
        {...props}
        VideoStream={VideoStream}
        goToBack={homePage === 'yes' ? `/home/${sportsType}` : `/matches/${sportsType}`}
        paymentSlide={paymentSlide}
        setPaymentSlide={setPaymentSlide}
        setVideoStream={setVideoStream}
        showBalance
      />
      <LeaguesPage {...props}
        VideoStream={VideoStream}
        paymentSlide={paymentSlide}
        setPaymentSlide={setPaymentSlide}
      />
    </>
  )
}

Leagues.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string
  }),
  match: PropTypes.object
}

export default Leagues
