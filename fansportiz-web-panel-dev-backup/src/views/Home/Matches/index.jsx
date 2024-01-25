import React, { useState } from 'react'
import HomeHeader from '../components/HomeHeader'
import HomeFooter from '../components/HomeFooter'
import PropTypes from 'prop-types'
import Matches from './Matches'

function MyMatches (props) {
  const [mainIndex, setMainIndex] = useState(0)
  const [paymentSlide, setPaymentSlide] = useState(0)

  return (
    <>
      <HomeHeader
        {...props}
        paymentSlide={paymentSlide}
        setMainIndex={setMainIndex}
        setPaymentSlide={setPaymentSlide}
        showBalance
        showNotificationIcon
        sportsRequired
      />
      <Matches
        {...props}
        mainIndex={mainIndex}
        paymentSlide={paymentSlide}
        setPaymentSlide={setPaymentSlide}
      />
      <HomeFooter {...props} isPublic={props.match?.path === '/matches/:sportsType/v1'} />
    </>
  )
}

MyMatches.propTypes = {
  location: PropTypes.object,
  match: PropTypes.object,
  pathName: PropTypes.string,
  mainIndex: PropTypes.string
}

export default MyMatches
