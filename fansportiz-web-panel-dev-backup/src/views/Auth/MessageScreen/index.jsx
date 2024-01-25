import React, { useState } from 'react'
import HomeHeader from '../../Home/components/HomeHeader'
import HomeFooter from '../../Home/components/HomeFooter'
import MessageLogin from './LoginMessage'
import LeagueHeader from '../../Home/components/LeagueHeader'
import { matchPath, useLocation, useParams } from 'react-router-dom'

function MessageLoginIndex (props) {
  const [VideoStream, setVideoStream] = useState(false)
  const [paymentSlide, setPaymentSlide] = useState(false)

  const { sportsType } = useParams()
  const { pathname } = useLocation()

  return (
    <>
      {matchPath('/upcoming-match/leagues/:sportsType/:id/v1', pathname)
        ? (
          <LeagueHeader
            {...props}
            VideoStream={VideoStream}
            goToBack={`/home/${sportsType}/v1`}
            paymentSlide={paymentSlide}
            setPaymentSlide={setPaymentSlide}
            setVideoStream={setVideoStream}
            showBalance
          />
          )
        : (
          <HomeHeader
            {...props}
            active
            home
            showBalance
            sportsRequired
          />
          )}
      <MessageLogin />
      {matchPath('/upcoming-match/leagues/:sportsType/:id/v1', pathname)
        ? ''
        : (
          <HomeFooter
            isPublic={(matchPath('/matches/:sportsType/v1', pathname) || matchPath('/profile/v1', pathname) || matchPath('/upcoming-match/leagues/:sportsType/:id/v1', pathname))}
          />
          )}
    </>
  )
}

export default MessageLoginIndex
