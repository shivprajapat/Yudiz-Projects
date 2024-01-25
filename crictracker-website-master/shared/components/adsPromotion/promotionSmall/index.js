import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'

import styles from './style.module.scss'
import brandLogoShort from '@assets/images/dummy/11w_short.png'
import Timer from './Timer'
// import { ELEVEN_WICKETS } from '@shared/constants'
import MatchScore from './MatchScore'
// import CustomLink from '@shared/components/customLink'
import { useRouter } from 'next/router'
import { SERIES_MINI_SCORECARD } from '@graphql/home/home.query'
import { useQuery } from '@apollo/client'
import { promotionBannerSmallLoader } from '@shared/libs/allLoader'
import { IPL_TEAM_NAME_WITH_ID } from '@shared/libs/promotion-banner'

const MyImage = dynamic(() => import('@shared/components/myImage'))

const promotionSmall = () => {
  const router = useRouter()
  const [matchBanner, setMatchBanner] = useState()

  const { data: IPL_SCORECARD, loading } = useQuery(SERIES_MINI_SCORECARD, {
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
    router.push(`/${matchBanner?.oSeo?.sSlug}?ref=hp`)
  }

  if (matchBanner) {
    return (
      <div onClick={handleClick} className={`${styles.promotion} d-flex align-items-center text-center mb-3 mb-md-4 position-relative br-lg overflow-hidden`}>
        {
          loading ? (
            promotionBannerSmallLoader()
          ) : (
            <div className={`${styles.promoInfo}`}>
              <div className={`${styles.series} mb-2`}>
                {/* <CustomLink href={matchData?.oSeo?.sSlug || '/'}>
              <a className='> */}
                <p className="text-uppercase text-small mb-0">Indian T20 League</p>
                <p className="fw-bold text-uppercase mb-0">
                  {`${IPL_TEAM_NAME_WITH_ID[matchBanner?.oTeamScoreA?.oTeam?._id] || matchBanner?.oTeamScoreA?.oTeam?.sAbbr} vs ${IPL_TEAM_NAME_WITH_ID[matchBanner?.oTeamScoreB?.oTeam?._id] || matchBanner?.oTeamScoreB?.oTeam?.sAbbr}`}
                </p>
                {/* </a>
            </CustomLink> */}
              </div>
              <div className={`${styles.centerContent} flex-grow-1`}>
                {
                  matchBanner?.sStatusStr === 'scheduled' && <Timer date={matchBanner?.dStartDate} />
                }
                {
                  (matchBanner?.sStatusStr === 'live' || matchBanner?.sStatusStr === 'completed' || matchBanner?.sStatusStr === 'cancelled') && <MatchScore match={matchBanner} />
                }
              </div>
            </div>
          )
        }
        <div className={`${styles.branding} font-semi d-flex flex-column align-items-center justify-content-center`}>
          <p className="mb-2">Powered by</p>
          {/* <CustomLink href={ELEVEN_WICKETS} prefetch={false}>
          <a target="_blank"> */}
          <div className={styles.product}>
            <MyImage src={brandLogoShort} alt="product" layout="responsive" />
          </div>
          {/* </a>
        </CustomLink> */}
          <p className={`${styles.paragraph} text-uppercase text-small mt-1 mb-0 text-nowrap`}>11 Wickets</p>
        </div>
      </div>
    )
  } else {
    return null
  }
}

promotionSmall.propTypes = {
  match: PropTypes.object
}

export default promotionSmall
