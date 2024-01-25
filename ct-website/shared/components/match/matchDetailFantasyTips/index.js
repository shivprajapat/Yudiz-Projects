import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import useTranslation from 'next-translate/useTranslation'

import styles from './style.module.scss'
import fantasyStyles from '@shared-components/articleDetail/fantasyArticleContent/style.module.scss'
const CricPrediction = dynamic(() => import('../cricPrediction'))
const MatchSquads = dynamic(() => import('../matchSquads'))
// const MatchProbability = dynamic(() => import('../matchProbability'))
// const LatestMatches = dynamic(() => import('../../fantasyTips/latestMatches'))
const InfoList = dynamic(() => import('../../fantasyTips/infoList'))
const InfoBlock = dynamic(() => import('../../fantasyTips/infoBlock'))
const NoData = dynamic(() => import('@noData'), { ssr: false })

const MatchDetailFantasyTips = ({ style, data }) => {
  const { t } = useTranslation()
  return (
    <>
      {data?.aCricPrediction?.length === 0 &&
        data?.oTeam1 === null &&
        data?.oTeam2 === null &&
        data?.sPitchReport === null &&
        data?.sWeatherReport === null &&
        data?.sAvgScore === null &&
        data?.sPitchCondition === null && <NoData />}
      {/* <LatestMatches/> */}
      {/* <MatchProbability/> */}
      {data?.aCricPrediction.length !== 0 && <CricPrediction data={data?.aCricPrediction} />}
      {(data?.oTeam1 !== null || data?.oTeam2 !== null) && <MatchSquads data={data} />}
      {data?.sNews &&
        <div className={`${styles.matchInfoBlock} common-box`}>
          <InfoBlock fantasystyles={fantasyStyles} title={t('common:InjuryNews')} info={data?.sNews} />
        </div>
      }
      {(data?.sWeatherReport !== null || data?.sAvgScore !== null || data?.sPitchCondition !== null) &&
        <div className={`${styles.matchInfoBlock} common-box`}>
          <InfoList fantasystyles={fantasyStyles} overViewData={data} />
        </div>
      }
      {data?.sPitchReport &&
        <div className={`${styles.matchInfoBlock} common-box`}>
          <InfoBlock fantasystyles={fantasyStyles} title={t('common:PitchReport')} info={data?.sPitchReport} />
        </div>
      }
    </>
  )
}

MatchDetailFantasyTips.propTypes = {
  style: PropTypes.any,
  data: PropTypes.object
}

export default MatchDetailFantasyTips
