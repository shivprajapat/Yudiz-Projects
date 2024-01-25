import React from 'react'
import dynamic from 'next/dynamic'
import useTranslation from 'next-translate/useTranslation'
import PropTypes from 'prop-types'

import { tableLoader } from '@shared/libs/allLoader'
import { getMatchFormat } from '@shared/libs/match-format'

const ThemeTable = dynamic(() => import('@shared-components/themeTable'), { loading: () => tableLoader() })
const Title = dynamic(() => import('@shared/components/player/playerStats/title'))

function PlayerBattingStats({ playerDetails }) {
  const { t } = useTranslation()

  const battingLabels = [t('common:Format'), t('common:M'), t('common:Inns'), t('common:No'), t('common:Runs'), t('common:HS'), t('common:Avg'), t('common:BF'), t('common:SR'), t('common:100s'), t('common:50s')]

  return (
    <>
      {playerDetails?.oStats?.length > 0 && (
        <section className="common-box">
          <Title heading={'BattingPerformance'} />
          <ThemeTable labels={battingLabels} isDark headClass={{ index: 0, className: 'text-start text-sm-center position-sticky start-0' }}>
            {playerDetails?.oStats?.map((element, index) => {
              const { oBatting } = element
              return (
                <tr key={index}>
                  <td className="text-uppercase text-start text-sm-center position-sticky start-0">{getMatchFormat(element?.sMatchStatsTypes)}</td>
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
          </ThemeTable>
        </section>
      )}
    </>
  )
}
PlayerBattingStats.propTypes = {
  playerDetails: PropTypes.object
}
export default PlayerBattingStats
