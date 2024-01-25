import React from 'react'
import dynamic from 'next/dynamic'
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'

import styles from '../matchDetailFantasyTips/style.module.scss'
import { checkIsGlanceView } from '@shared/utils'

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
const GlanceAd = dynamic(() => import('@shared-components/ads/glanceAd'), { ssr: false })

const MatchDetailOverview = ({ data, matchDetail }) => {
  const router = useRouter()
  const isGlanceView = checkIsGlanceView(router?.query)

  return (
    <>
      <MatchInfo data={matchDetail} />
      {isGlanceView && (
        <GlanceAd
          id={`div-gpt-ad-5${new Date().getTime() * ((Math.random() + 1) * 1000)}`}
          adId="Crictracker_mrec_mid"
          dimension={[[300, 250], [336, 280], 'fluid']}
          adUnitName="Crictracker_Sportstab_InArticleMedium_Mid2"
          placementName="InArticleMedium"
          className="d-flex justify-content-center"
          pageName="Crictracker SportsTab"
          width={300}
          height={250}
        />
      )}
      <Ads
        id="div-ad-gpt-138639789-1660147282-2"
        adIdDesktop="Crictracker2022_Mobile_LiveScore_MID_300x250"
        // adIdMobile="Crictracker2022_Desktop_LiveScore_MID_728x90"
        dimensionDesktop={[300, 250]}
        // dimensionMobile={[300, 250]}
        mobile
        className={'text-center mb-3 d-md-none'}
      />
      {(data && (data?.oWinnerTeam !== null ||
        data?.sAvgScore !== null ||
        data?.sPitchCondition !== null ||
        data?.sWeatherReport)) &&
        <div className={`${styles.matchInfoBlock} common-box`}>
          <InfoList overViewData={data} />
        </div>
      }
      {data && data?.sMatchPreview !== null &&
        <>
          <MatchPreview data={data?.sMatchPreview} />
          {isGlanceView && (
            <GlanceAd
              id={`div-gpt-ad-6${new Date().getTime() * ((Math.random() + 1) * 1000)}`}
              adId="Crictracker_mrec_bottom"
              dimension={[[300, 250], [336, 280], 'fluid']}
              className="mt-2 d-flex justify-content-center"
              adUnitName="Crictracker_Sportstab_InArticleMedium_Mid3"
              placementName="InArticleMedium"
              pageName="Crictracker SportsTab"
              width={300}
              height={250}
            />
          )}
        </>
      }
      {data && (data?.oTeam1?.aPlayers.length !== 0 || data?.oTeam2?.aPlayers.length !== 0) &&
        <MatchXI data={data} status={matchDetail?.sStatusStr} isOutSideCountryPlane={matchDetail?.oSeries?._id === '63f052b9d5e097df610db62d'} />
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
