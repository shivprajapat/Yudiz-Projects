import React from 'react'
import useTranslation from 'next-translate/useTranslation'
import PropTypes from 'prop-types'

import ThemeTableAMP from '@shared-components/amp/themeTable'
import TitleAMP from '@shared/components/amp/playerAMP/titleAMP'
import { getMatchFormat } from '@shared/libs/match-format'

function PlayerBowlingStatsAMP({ playerDetails }) {
  const { t } = useTranslation()

  const bowlingLabels = [t('common:Format'), t('common:M'), t('common:Inns'), t('common:Ovs'), t('common:Runs'), t('common:Wkts'), t('common:BBI'), t('common:Avg'), t('common:ECN'), t('common:SR'), t('common:4W'), t('common:5W')]

  return (
    <>
      {playerDetails?.oStats.length > 0 && (
        <section className="common-box">
          <TitleAMP heading={'BowlingPerformance'}/>
          <ThemeTableAMP labels={bowlingLabels} isDark headClass={{ index: 0, className: 'text-start position-sticky start-0' }}>
            {playerDetails?.oStats?.map((element, index) => {
              const { oBowling } = element
              return (
                <tr key={index} className='t-center'>
                  <td className="t-uppercase text-start text-sm-center position-sticky start-0">{getMatchFormat(element?.sMatchStatsTypes)}</td>
                  <td>{oBowling?.nMatches || '--'}</td>
                  <td>{oBowling?.nInnings || '--'}</td>
                  <td>{oBowling?.sOvers || '--'}</td>
                  <td>{oBowling?.nRuns || '--'}</td>
                  <td>{oBowling?.nWickets || '--'}</td>
                  <td>{oBowling?.sBestBowlingInning || '--'}</td>
                  <td>{oBowling?.sAverage || '--'}</td>
                  <td>{oBowling?.sEconomy || '--'}</td>
                  <td>{oBowling?.sStrikeRate || '--'}</td>
                  <td>{oBowling?.nWkt4i || '--'}</td>
                  <td>{oBowling?.nWkt5i || '--'}</td>
                </tr>
              )
            })}
          </ThemeTableAMP>
        </section>
      )}
    </>
  )
}

PlayerBowlingStatsAMP.propTypes = {
  playerDetails: PropTypes.object
}
export default PlayerBowlingStatsAMP
