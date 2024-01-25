import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'

import styles from './style.module.scss'
import brandLogo from '@assets/images/dummy/11w_logo.png'
import brandLogoShort from '@assets/images/dummy/11w_short.png'
import Timer from './Timer'
import MatchScore from './MatchScore'
// import { ELEVEN_WICKETS } from '@shared/constants'
import useWindowSize from '@shared/hooks/windowSize'
// import CustomLink from '@shared/components/customLink'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import { SERIES_MINI_SCORECARD } from '@graphql/home/home.query'
import { IPL_TEAM_NAME_WITH_ID } from '@shared/libs/promotion-banner'

const MyImage = dynamic(() => import('@shared/components/myImage'))

const PromotionFull = ({ isHomePagePromotion }) => {
  const router = useRouter()
  const [width] = useWindowSize()
  const [matchBanner, setMatchBanner] = useState()

  const { data: IPL_SCORECARD } = useQuery(SERIES_MINI_SCORECARD, {
    variables: { input: { _id: '63f052b9d5e097df610db62d' } }
  })

  useEffect(() => {
    const bannerSeriesScoreCard = IPL_SCORECARD?.listSeriesScorecard
    const liveMatches = bannerSeriesScoreCard?.length > 0 && bannerSeriesScoreCard?.filter((data) => data?.sStatusStr === 'live')
    const upcomingMatches = bannerSeriesScoreCard?.length > 0 && bannerSeriesScoreCard?.filter((data) => data?.sStatusStr === 'scheduled')
    bannerSeriesScoreCard?.length > 0 && setMatchBanner(upcomingMatches?.length > 0 ? upcomingMatches[0] : bannerSeriesScoreCard[bannerSeriesScoreCard?.length - 1])
    bannerSeriesScoreCard?.length > 0 && setMatchBanner(liveMatches?.length > 0 ? liveMatches[0] : upcomingMatches?.length > 0 ? upcomingMatches[0] : bannerSeriesScoreCard[bannerSeriesScoreCard?.length - 1])
  }, [IPL_SCORECARD])

  function handleClick() {
    router.push(`/${matchBanner?.oSeo?.sSlug}/?ref=csp`)
  }
  if (matchBanner) {
    return (
      <>
        <div onClick={handleClick} className={`${styles.promotion} d-flex align-items-center text-center mb-2 mb-md-4 position-relative br-lg overflow-hidden`}>
          <div className={isHomePagePromotion ? `${styles.promoInfo} d-flex flex-column flex-md-row flex-lg-column flex-xl-row align-items-center` : `${styles.promoInfo}  d-flex flex-column flex-md-row align-items-center`}>
            <div className={`${styles.series} mb-2 mb-md-0`}>
              {/* <CustomLink href={match?.oSeo?.sSlug || '/'}> */}
              {/* <a className=''> */}
              <p className="text-uppercase text-small mb-0 ">Indian T20 League</p>
              <p className="text-uppercase text-small mb-0 ">{isHomePagePromotion ? `${IPL_TEAM_NAME_WITH_ID[matchBanner?.oTeamScoreA?.oTeam?._id] || matchBanner?.oTeamScoreA?.oTeam?.sAbbr} vs ${IPL_TEAM_NAME_WITH_ID[matchBanner?.oTeamScoreB?.oTeam?._id] || matchBanner?.oTeamScoreB?.oTeam?.sAbbr}` : matchBanner?.sSubtitle || 'Ind VS Pak'}</p>
              {/* </a> */}
              {/* </CustomLink> */}
            </div>
            <div className={`${styles.centerContent} flex-grow-1`}>
              {
                matchBanner?.sStatusStr === 'scheduled' && <Timer isHomePagePromotion={isHomePagePromotion} date={matchBanner?.dStartDate} />
              }
              {
                (matchBanner?.sStatusStr === 'live' || matchBanner?.sStatusStr === 'completed' || matchBanner?.sStatusStr === 'cancelled') && <MatchScore match={matchBanner} />
              }
            </div>
          </div>
          <div className={isHomePagePromotion ? `${styles.branding} fw-bold d-flex flex-column flex-md-row flex-lg-column flex-xl-row align-items-center justify-content-center` : `${styles.branding} fw-bold d-flex flex-column flex-md-row align-items-center justify-content-center`}>
            <p className={`${(isHomePagePromotion && width < 768) && styles.paragraph} mb-2 mb-md-0 `}>Powered by</p>
            {/* <CustomLink href={ELEVEN_WICKETS} prefetch={false}> */}
            {
              isHomePagePromotion ? <a target='_blank' className={`${styles.logoSmall} brand-link d-block`}>
                {
                  width < 768 || (isHomePagePromotion && width > 991 && width < 1190) ? <MyImage src={brandLogoShort} alt="11 Wickets" layout="responsive" /> : <MyImage src={brandLogo} alt="11 Wickets" layout="responsive" />
                }
              </a> : <a target='_blank' className={`${styles.logo} brand-link d-block`}>
                {
                  width < 768 ? <MyImage src={brandLogoShort} alt="11 Wickets" layout="responsive" /> : <MyImage src={brandLogo} alt="11 Wickets" layout="responsive" />
                }
              </a>
            }
            {/* </CustomLink> */}
            {(width < 768 || (isHomePagePromotion && width > 991 && width < 1190)) && (
              <p className={`${(isHomePagePromotion && width < 768) && styles.paragraph} text-uppercase text-small mb-0  text-nowrap`}>11 Wickets</p>
            )}
          </div>
        </div>
        {/* <div className={`${styles?.promotionPlaceholder} mb-2 mb-md-4`} /> */}
      </>
    )
  } else {
    return (
      <div className={`${styles?.promotionPlaceholder} mb-2 mb-md-4`} />
    )
  }
}

PromotionFull.propTypes = {
  match: PropTypes.object,
  isHomePagePromotion: PropTypes.bool
}

export default PromotionFull
