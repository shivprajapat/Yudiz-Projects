import React, { useState, lazy, Suspense } from 'react'
// import PropTypes from 'prop-types'
import HomeHeader from '../components/HomeHeader'
import HomeFooter from '../components/HomeFooter'
import Loading from '../../../component/Loading'
import { matchPath, useLocation } from 'react-router-dom'
const HomePage = lazy(() => import('./Home'))

function Home (props) {
  const [mainIndex, setMainIndex] = useState(0)
  const [paymentSlide, setPaymentSlide] = useState(false)
  const { pathname } = useLocation()
  const isPathPublic = matchPath('/home/:sportsType/v1', pathname)

  return (
    <>
      <HomeHeader
        {...props}
        home
        isPublic={isPathPublic}
        paymentSlide={paymentSlide}
        setMainIndex={setMainIndex}
        setPaymentSlide={setPaymentSlide}
        showBalance
        showNotificationIcon
        sportsRequired
      />
      <Suspense fallback={<Loading />}>
        <HomePage
          {...props}
          homePage='yes'
          mainIndex={mainIndex}
          paymentSlide={paymentSlide}
          setPaymentSlide={setPaymentSlide}
        />
      </Suspense>
      <HomeFooter {...props} isPublic={isPathPublic} />
    </>
  )
}

Home.propTypes = {
}

export default Home
