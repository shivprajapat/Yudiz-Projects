import React from 'react'
import useTranslation from 'next-translate/useTranslation'
import PropTypes from 'prop-types'

import ThemeTableAMP from '@shared-components/amp/themeTable'
import TitleAMP from '@shared/components/amp/playerAMP/titleAMP'
import { getMatchFormat } from '@shared/libs/match-format'

function PlayerBattingStatsAMP({ playerDetails }) {
  const { t } = useTranslation()

  const battingLabels = [t('common:Format'), t('common:M'), t('common:Inns'), t('common:No'), t('common:Runs'), t('common:HS'), t('common:Avg'), t('common:BF'), t('common:SR'), t('common:100s'), t('common:50s')]

  return (
    <>
      {playerDetails?.oStats?.length > 0 && (
        <section className="common-box">
          <TitleAMP heading={'BattingPerformance'}/>
          <ThemeTableAMP labels={battingLabels} isDark headClass={{ index: 0, className: 'text-start position-sticky start-0' }}>
            {playerDetails?.oStats?.map((element, index) => {
              const { oBatting } = element
              return (
                <tr key={index} className='t-center'>
                  <td className="t-uppercase text-start position-sticky start-0">{getMatchFormat(element?.sMatchStatsTypes)}</td>
                  <td>{oBatting?.nMatches || '--'}</td>
                  <td>{oBatting?.nInnings || '--'}</td>
                  <td>{oBatting?.nNotOut || '--'}</td>
                  <td>{oBatting?.nRuns || '--'}</td>
                  <td>{oBatting?.nHighest || '--'}</td>
                  <td>{oBatting?.sAverage || '--'}</td>
                  <td>{oBatting?.nPlayedBalls || '--'}</td>
                  <td>{oBatting?.sStrikeRate || '--'}</td>
                  <td>{oBatting?.nRun100 || '--'}</td>
                  <td>{oBatting?.nRun50 || '--'}</td>
                </tr>
              )
            })}
          </ThemeTableAMP>
        </section>
      )}
    </>
  )
}

PlayerBattingStatsAMP.propTypes = {
  playerDetails: PropTypes.object
}
export default PlayerBattingStatsAMP
