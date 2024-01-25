import React from 'react'
import ThemeTableAMP from '@shared-components/amp/themeTable'
import NoDataAMP from '@shared/components/amp/noDataAMP'
import PropTypes from 'prop-types'
import { convertDt24h } from '@shared/utils'
import usePlayerMatchStatsLabels from '@shared/hooks/usePlayerMatchStatsLabels'

function RecentMatchStats({ playerDetails, playerRecentMatchData, isAll }) {
  const options = {
    isBattingData: playerRecentMatchData?.some(data => data?.aBattingData?.length),
    isBowlingData: playerRecentMatchData?.some(data => data?.aBowlingData?.length)
  }
  const labels = usePlayerMatchStatsLabels(playerDetails?.sPlayingRole, options)
  return (
    <>
      {playerRecentMatchData?.length > 0 ? (
        <ThemeTableAMP labels={labels[isAll ? 0 : 1]} isDark headClass={{ index: 0, className: 'text-start position-sticky start-0' }}>
          {playerRecentMatchData?.map((element, index) => {
            const { aBattingData, aBowlingData } = element
            const oMatch = element.aMatch?.[0]
            const battingLength = aBattingData?.length
            const bowlingLength = aBowlingData?.length
            return (
              <tr key={element?._id} className="t-center">
                <td className="text-start text-sm-center position-sticky start-0">{oMatch?.sShortTitle || oMatch?.sTitle || '-'}</td>
                {options?.isBattingData ? (
                  <td>
                    {battingLength ? aBattingData?.map((bat, i) =>
                      <React.Fragment key={`bat${i}`}>
                        {bat?.nRuns ?? '--'}{bat?.bIsBatting ? '*' : ''}{(battingLength - 1) !== i ? ' & ' : ''}
                      </React.Fragment>
                    ) : '-'}
                  </td>
                ) : null}
                {options?.isBowlingData ? <td>
                  {bowlingLength ? aBowlingData?.map((bowl, i) =>
                    <React.Fragment key={`bowl${i}`}>
                      {bowl?.nWickets || 0}/{bowl?.nRunsConceded || 0}{(bowlingLength - 1) !== i ? ' & ' : ''}
                    </React.Fragment>
                  ) : '-'}
                </td> : null}
                <td>{convertDt24h(oMatch?.dStartDate)}</td>
                <td>{element?.oVenue?.sLocation}</td>
                {isAll && <td className="t-uppercase">{oMatch?.sFormatStr}</td>}
              </tr>
            )
          })}
        </ThemeTableAMP >
      ) : (
        <NoDataAMP />
      )
      }
    </>
  )
}
RecentMatchStats.propTypes = {
  isAll: PropTypes.bool,
  labels: PropTypes.array,
  playerDetails: PropTypes.object,
  playerRecentMatchData: PropTypes.array
}
export default RecentMatchStats
