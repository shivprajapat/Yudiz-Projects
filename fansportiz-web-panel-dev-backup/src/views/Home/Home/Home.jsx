import React, { Fragment, useState, useEffect } from 'react'
import UpcomingMatchList from '../components/UpcomingList'
import PropTypes from 'prop-types'
import youtubeIcon from '../../../assests/images/ic_watch_match_home.png'
import Wallet from '../../../component/Wallet'
import { useNavigate } from 'react-router-dom'
import useGetUserProfile from '../../../api/user/queries/useGetUserProfile'
import useGetCurrency from '../../../api/settings/queries/useGetCurrency'
import useGetStreamButton from '../../../api/settings/queries/useGetStreamButton'
import Slider from '../../../component/Slider'

function Home (props) {
  const { homePage, paymentSlide, setPaymentSlide, mainIndex } = props
  const navigate = useNavigate()
  const [modalMessage, setModalMessage] = useState(false)

  useEffect(() => {
    if (modalMessage) {
      setTimeout(() => {
        setModalMessage(false)
      }, 2000)
    }
  }, [modalMessage])

  useEffect(() => {
    if (paymentSlide) refetchUserProfile()
  }, [paymentSlide])

  const { data: currencyLogo } = useGetCurrency()
  const { data: streamButtonData } = useGetStreamButton()
  const { data: userInfo, refetch: refetchUserProfile } = useGetUserProfile()

  return (
    <>
      <div className="home-container">
        <Slider screen='H' />
        <Fragment>
          <UpcomingMatchList {...props} homePage={homePage} mainIndex={mainIndex} />
        </Fragment>
      </div>
      {paymentSlide
        ? (
          <Wallet
            currencyLogo={currencyLogo}
            setPaymentSlide={setPaymentSlide}
            userInfo={userInfo}
          />
          )
        : ''}
      {streamButtonData?.bShowStreamButton && <button className='match-bottom-Right-btn' onClick={() => navigate('/live-stream/L')}><img src={youtubeIcon} /></button>}
    </>
  )
}

Home.propTypes = {
  mainIndex: PropTypes.number,
  paymentSlide: PropTypes.bool,
  setPaymentSlide: PropTypes.func,
  homePage: PropTypes.string
}

export default Home
