import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import useGetPopupAds from '../api/popupAds/queries/useGetPopupAds'
import useGetMatchDetails from '../api/match/queries/useGetMatchDetails'
import useGetMatchLeagueDetails from '../api/matchleague/queries/useGetMatchLeagueDetails'

function Ads (props) {
  const { url, showingImage, bannerImg, setShowingImage, setBannerImg } = props
  const navigate = useNavigate()
  const token = localStorage.getItem('Token')
  const [adsData, setAdsData] = useState({})
  const [redirect, setRedirect] = useState(false)
  const [matchId, setMatchId] = useState('')
  const [matchLeagueId, setMatchLeagueId] = useState('')

  const { data: AdsList } = useGetPopupAds({ token })
  const { data: matchDetails } = useGetMatchDetails({ dependencyData: { matchId, sportsType: adsData?.eCategory } })
  const { data: matchLeagueDetails } = useGetMatchLeagueDetails({ dependencyData: { matchLeagueId } })

  async function onAdClick () {
    if (adsData?.eType === 'E') {
      const newWindow = window.open(adsData.sLink, '_blank', 'noopener,noreferrer')
      if (newWindow) newWindow.opener = null
      setShowingImage(false)
    } else if (adsData?.eType === 'I' && token) {
      setMatchLeagueId(adsData?.iMatchLeagueId)
      setMatchId(adsData?.iMatchId)
    }
    setRedirect(true)
  }

  useEffect(() => {
    if (!redirect || !matchDetails?._id) {
      return
    }
    const { eStatus } = matchDetails
    const { iMatchId, iMatchLeagueId, eCategory, eTransactionType } = adsData
    if (eStatus === 'U' && iMatchId) {
      if (iMatchLeagueId && !matchLeagueDetails?.bCancelled) {
        navigate(`/upcoming-match/league-details/${eCategory.toLowerCase()}/${iMatchId}/${iMatchLeagueId}`)
      } else {
        navigate(`/upcoming-match/leagues/${eCategory.toLowerCase()}/${iMatchId}`)
      }
    } else if (eStatus === 'L' && iMatchId) {
      if (iMatchLeagueId && eTransactionType !== 'Play-Return' && !matchLeagueDetails?.bCancelled) {
        navigate(`/live-completed-match/league-details/${eCategory.toLowerCase()}/${iMatchId}/${iMatchLeagueId}`)
      } else {
        navigate(`/live-match/leagues/${eCategory.toLowerCase()}/${iMatchId}`)
      }
    } else if ((eStatus === 'CMP' || eStatus === 'I') && iMatchId) {
      if (iMatchLeagueId && eTransactionType !== 'Play-Return' && !matchLeagueDetails?.bCancelled) {
        navigate(`/live-completed-match/league-details/${eCategory.toLowerCase()}/${iMatchId}/${iMatchLeagueId}`)
      } else {
        navigate(`/completed-match/leagues/${eCategory.toLowerCase()}/${iMatchId}`)
      }
    }
    setRedirect(false)
  }, [matchDetails])

  useEffect(() => {
    if (AdsList) {
      if (AdsList.length > 0) {
        setShowingImage(true)
        const AdIndex = localStorage.getItem('AdIndex')
        const data = AdsList.filter(data => data.ePlatform === 'W' || data.ePlatform === 'ALL')
        if (AdIndex && parseInt(AdIndex) < data.length) {
          if ((parseInt(AdIndex) + 1) >= data.length) {
            localStorage.setItem('AdIndex', 0)
            setBannerImg(data[0].sImage)
            setAdsData(data[0])
          } else {
            localStorage.setItem('AdIndex', parseInt(AdIndex) + 1)
            setBannerImg(data[parseInt(AdIndex) + 1].sImage)
            setAdsData(data[parseInt(AdIndex) + 1])
          }
        } else {
          localStorage.setItem('AdIndex', 0)
          setBannerImg(data && data.length && data[0].sImage)
          setAdsData(data && data.length && data[0])
        }
      }
    }
  }, [AdsList])

  return (
    <>
      {showingImage && url && bannerImg
        ? (
          <div className='ads'>
            <div
              className="AdAlert alert-center"
              onClick={() => onAdClick()}
              style={{
                backgroundImage: `url(${url + bannerImg})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat'
              }}
            >
              <span className="tag"
                onClick={(e) => {
                  setShowingImage(false)
                  e.stopPropagation()
                }}
              />
            </div>
          </div>
          )
        : ''
      }
    </>
  )
}

Ads.propTypes = {
  url: PropTypes.string,
  showingImage: PropTypes.bool,
  bannerImg: PropTypes.string,
  setShowingImage: PropTypes.func,
  setBannerImg: PropTypes.func
}

export default Ads
