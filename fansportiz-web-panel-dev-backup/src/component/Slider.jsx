import React, { Fragment, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Alert, Carousel, CarouselControl, CarouselIndicators, CarouselItem } from 'reactstrap'
import useGetUrl from '../api/url/queries/useGetUrl'
import useGetBanners from '../api/banner/queries/useGetBanners'
import useBannerStatistics from '../api/banner/queries/useBannerStatistics'
import useGetMatchDetails from '../api/match/queries/useGetMatchDetails'
import useGetMatchLeagueDetails from '../api/matchleague/queries/useGetMatchLeagueDetails'
import { useNavigate, useParams } from 'react-router-dom'
import Loading from './Loading'
import { FormattedMessage } from 'react-intl'

function Slider (props) {
  const { screen } = props
  const [bannerClicked, setBannerClicked] = useState('')
  const [matchId, setMatchId] = useState('')
  const [matchLeagueId, setMatchLeagueId] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [matchData, setMatchData] = useState({})
  const [message, setMessage] = useState('')
  const [modalMessage, setModalMessage] = useState(false)
  const { sportsType } = useParams()
  const navigate = useNavigate()

  const { data: bannerData, isLoading } = useGetBanners({ screen })
  const { sMediaUrl } = useGetUrl()
  useBannerStatistics({ bannerClicked })
  const { data: matchDetails } = useGetMatchDetails({ dependencyData: { matchId, sportsType }, setMessage, setModalMessage })
  const { data: matchLeagueDetails } = useGetMatchLeagueDetails({ dependencyData: { matchLeagueId }, setMessage, setModalMessage })

  useEffect(() => {
    if (!message) {
      if (matchDetails?._id && matchDetails?.eStatus === 'U') {
        if (matchData?.iMatchId && matchData?.iMatchLeagueId && !matchLeagueDetails?.bCancelled) {
          navigate(`/upcoming-match/league-details/${(matchData.eCategory).toLowerCase()}/${matchData?.iMatchId}/${matchData?.iMatchLeagueId}`)
        } else if (matchData?.iMatchId) {
          navigate(`/upcoming-match/leagues/${(matchData?.eCategory).toLowerCase()}/${matchData?.iMatchId}`)
        }
      } else if (matchDetails?._id && matchDetails?.eStatus === 'L') {
        if (matchData?.iMatchId && matchData?.iMatchLeagueId && matchData?.eTransactionType !== 'Play-Return' && !matchLeagueDetails?.bCancelled) {
          navigate(`/live-completed-match/league-details/${(matchData?.eCategory).toLowerCase()}/${matchData?.iMatchId}/${matchData?.iMatchLeagueId}`)
        } else if (matchData?.iMatchId) {
          navigate(`/live-match/leagues/${(matchData?.eCategory).toLowerCase()}/${matchData?.iMatchId}`)
        }
      } else if (matchDetails?._id && (matchDetails?.eStatus === 'CMP' || matchDetails?.eStatus === 'I')) {
        if (matchData?.iMatchId && matchData?.iMatchLeagueId && matchData?.eTransactionType !== 'Play-Return' && !matchLeagueDetails?.bCancelled) {
          navigate(`/live-completed-match/league-details/${(matchData?.eCategory).toLowerCase()}/${matchData?.iMatchId}/${matchData?.iMatchLeagueId}`)
        } else if (matchData?.iMatchId) {
          navigate(`/completed-match/leagues/${(matchData?.eCategory).toLowerCase()}/${matchData?.iMatchId}`)
        }
      }
    }
  }, [matchDetails, matchLeagueDetails])

  function bannerClick (data) {
    setMatchData(data)
    const { eType, eScreen, sLink, sDescription, src, iMatchId, iMatchLeagueId, key } = data
    if (eType === 'L') {
      const newWindow = window.open(sLink, '_blank', 'noopener,noreferrer')
      if (newWindow) newWindow.opener = null
    } else if (eType === 'S') {
      if (eScreen === 'D') {
        navigate('/deposit')
      } else if (eScreen === 'S') {
        const image = `${sMediaUrl}${src}`
        navigate('/page', { state: { contentDetails: sDescription, image } })
      } else if (eScreen === 'CR') {
        if (iMatchId) {
          setMatchId(iMatchId)
          if (iMatchLeagueId) setMatchLeagueId(iMatchLeagueId)
        }
      }
    } setBannerClicked(key)
  }

  const next = () => {
    if (animating) return
    const nextIndex = activeIndex === bannerData?.length - 1 ? 0 : activeIndex + 1
    setActiveIndex(nextIndex)
  }

  const previous = () => {
    if (animating) return
    const nextIndex = activeIndex === 0 ? bannerData?.length - 1 : activeIndex - 1
    setActiveIndex(nextIndex)
  }

  const slides = bannerData?.map((item) => {
    return (
      <CarouselItem
        key={item._id}
        onExited={() => setAnimating(false)}
        onExiting={() => setAnimating(true)}
      >
        <img key={`${item.key}`} alt={<FormattedMessage id='Banner_not_available' />} onClick={() => bannerClick(item)} src={item?.src ? `${sMediaUrl}${item?.src}` : ''} />
      </CarouselItem>
    )
  })

  const goToIndex = (newIndex) => {
    if (animating) return
    setActiveIndex(newIndex)
  }

  return (
    <div>
      {isLoading && <Loading />}
      {modalMessage
        ? <Alert color="primary" isOpen={modalMessage}>{message}</Alert>
        : ''}
      {bannerData?.length > 0 && (
        <div>
          <Carousel
            activeIndex={activeIndex}
            className='home-banner'
            next={next}
            previous={previous}
          >
            <CarouselIndicators activeIndex={activeIndex} items={bannerData?.sort((a, b) => a.nPosition - b.nPosition)} onClickHandler={goToIndex} />
            {slides}
            {bannerData?.length > 1 && (
            <Fragment>
              <CarouselControl direction="prev" directionText="Previous" onClickHandler={previous} />
              <CarouselControl direction="next" directionText="Next" onClickHandler={next} />
            </Fragment>
            )}
          </Carousel>
        </div>
      )}
    </div>
  )
}

Slider.propTypes = {
  screen: PropTypes.string
}

export default Slider
