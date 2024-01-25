import React from 'react'
import dynamic from 'next/dynamic'
import PropTypes from 'prop-types'

import styles from '../matchDetailFantasyTips/style.module.scss'

const Skeleton = dynamic(() => import('@shared-components/skeleton'), { ssr: false })
const MatchInfo = dynamic(() => import('../matchInfo'), {
  loading: () => (
    <div className="bg-white rounded p-3">
      {Array.from(Array(5)).map((e, i) => {
        return (
          <React.Fragment key={i}>
            <div className="d-flex">
              <Skeleton width={'10%'} className={'me-3'} />
              <Skeleton width={'25%'} />
            </div>
            <hr />
          </React.Fragment>
        )
      })}
    </div>
  )
})
const InfoList = dynamic(() => import('../../fantasyTips/infoList'))
const MatchXI = dynamic(() => import('../matchXI'))
const MatchPreview = dynamic(() => import('@shared-components/match/matchPreview'))
const Ads = dynamic(() => import('@shared/components/ads'), { ssr: false })

const MatchDetailOverview = ({ data, matchDetail }) => {
  return (
    <>
      <MatchInfo data={matchDetail} />
      <Ads
        id="div-ad-gpt-138639789-1660147282-2"
        adIdDesktop="Crictracker2022_Desktop_LiveScore_MID_728x90"
        adIdMobile="Crictracker2022_Mobile_LiveScore_MID_300x250"
        dimensionDesktop={[728, 90]}
        dimensionMobile={[300, 250]}
        mobile
        className={'text-center mb-3'}
      />
      {(data?.oWinnerTeam !== null ||
        data?.sAvgScore !== null ||
        data?.sPitchCondition !== null ||
        data?.sWeatherReport) &&
        <div className={`${styles.matchInfoBlock} common-box`}>
          <InfoList overViewData={data} />
        </div>
      }
      {data?.sMatchPreview !== null &&
        <MatchPreview data={data?.sMatchPreview} />
      }
      {(data?.oTeam1?.aPlayers.length !== 0 || data?.oTeam2?.aPlayers.length !== 0) &&
        <MatchXI data={data} status={matchDetail?.sStatusStr} />
      }
    </>
  )
}

MatchDetailOverview.propTypes = {
  data: PropTypes.object,
  infoData: PropTypes.object,
  matchDetail: PropTypes.object
}

export default MatchDetailOverview
