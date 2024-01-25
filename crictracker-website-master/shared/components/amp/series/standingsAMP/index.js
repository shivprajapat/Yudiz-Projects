import React, { useRef } from 'react'
import dynamic from 'next/dynamic'
import PropTypes from 'prop-types'
import Trans from 'next-translate/Trans'
import useTranslation from 'next-translate/useTranslation'

import { tableLoader } from '@shared/libs/allLoader'
import { StandingMatchWinLoss, convertDt24hFormat, dateCheck } from '@shared/utils'
const StandingMatchData = dynamic(() => import('@shared/components/series/standings/standingMatchData'))
const ThemeTableAMP = dynamic(() => import('@shared-components/amp/themeTable'), { loading: () => tableLoader() })
const NoDataAMP = dynamic(() => import('@shared-components/amp/noDataAMP'))

const StandingsAMP = ({ round, standing, category }) => {
  const roundData = useRef(round)
  const { t } = useTranslation()
  const table = useRef({ nPlayed: 'M', nWin: 'W', nLoss: 'L', nDraw: 'T', nNR: 'N/R', nPoints: 'PTS', nNetrr: 'Net RR' })
  const labels = ['No', 'Team', 'M', 'W', 'L', 'T', 'N/R', 'PTS', 'Net RR', 'Form', '']
  const standingsData = standing
  // const objMap = {}
  // standingsData.reduce((acc, d) => {
  //   const id = d.iRoundId._id
  //   if (acc[id]) {
  //     acc[id].push(d)
  //   } else {
  //     acc[id] = []
  //     acc[id].push(d)
  //   }
  //   return acc
  // }, objMap)

  return (
    <>
      <style jsx amp-custom global>{`
      .standings{font-size:14px;line-height:20px}.standings th,.standings td{width:5.6%}.standings th:nth-child(1),.standings td:nth-child(1){position:sticky;left:0;text-align:center}.standings th:nth-child(2),.standings td:nth-child(2){position:sticky;left:33px}.standings .highLight td{background:var(--theme-light)}.standings th:nth-child(2),.standings td:nth-child(2){text-align:left;width:inherit}.standings .infoTable{padding:2px 8px 8px;text-align:left;background:var(--border-medium)}.standings .infoTable table{border-spacing:0 2px}.standings .infoTable thead td{font-weight:700;color:var(--font-color-light)}.standings .infoTable td{padding:2px 8px;width:auto;background:rgba(0,0,0,0);font-weight:400}.standings .infoTable td:first-child{width:60%}.standings .infoTable tbody td{font-size:12px;line-height:16px;height:32px;border-bottom:1px solid var(--border-light);border-radius:0;position:static}.standings .infoTable tbody td:first-child a{padding-bottom:2px}.standings .infoTable tbody td:first-child :nth-last-child(2){padding-top:2px}.standings .infoTable td:nth-child(1),.standings .infoTable td:nth-child(2),.standings .infoTable th:nth-child(1),.standings .infoTable th:nth-child(2){position:static;text-align:left}.winBadge{margin:0px 2px;text-align:center;width:16px;height:16px;background:#14b305;color:#fff;font-size:10px;line-height:16px;border-radius:50%}.winBadge.loss{background:var(--danger);line-height:14px}.winBadge.dash{background:rgba(0,0,0,0);color:var(--font-color);font-size:16px}.winBadge.noResult{background:var(--font-dark);color:#fff;font-size:9px;line-height:16px}.infoToggle{width:20px;height:20px;cursor:pointer}@media(prefers-color-scheme: dark){.infoToggle{filter:brightness(0) invert(1) opacity(0.5)}}.infoToggle.active{-webkit-transform:rotate(180deg);-ms-transform:rotate(180deg);transform:rotate(180deg)}/*# sourceMappingURL=style.css.map */


      `}
      </style>
      {roundData.current?.length !== 0 && standingsData[0]?.oSeries?.sSeriesType === 'tournament' && (
        <div className="standings">
          <h4 className="text-uppercase">
            {category?._id === '623184adf5d229bacb00ff63' ? 'IPL Points Table 2023' : <Trans i18nKey="common:PointsTable" />}
          </h4>
          {roundData.current?.map((round) => {
            return (
              <React.Fragment key={round._id}>
                {category?._id !== '623184adf5d229bacb00ff63' && <h5>{round?.sName}</h5>}
                <ThemeTableAMP labels={labels} isNumbered={true}>
                  {standingsData
                    ?.filter((s) => round._id === s?.oRound?._id)
                    .map((standing, index) => {
                      return (
                        <React.Fragment key={standing._id}>
                          <tr className={standing?.bIsQualified ? 'highLight' : ''}>
                            <td>{(index + 1)}</td>
                            <td>
                              {standing?.oTeam?.eTagStatus === 'a' ? (
                                <a href={`/${standing?.oTeam?.oSeo?.sSlug}/?amp=1`}>{standing?.oTeam?.sAbbr}{standing?.bIsQualified && ' (Q)'}</a>
                              ) : (
                                <span>{standing?.oTeam?.sAbbr}{standing?.bIsQualified && ' (Q)'}</span>
                              )}
                            </td>
                            {Object.keys(table.current)?.map((value, i) => {
                              return <td key={value + i}>{standing[value]}</td>
                            })}
                            <td>
                              <div className="d-flex align-items-center">
                                {StandingMatchWinLoss(standing?.oTeam)?.map((data, j) =>
                                  <span
                                    key={data?._id + j}
                                    className={`winBadge rounded-circle flex-shrink-0 ${!data?.isWinner ? 'loss' : ''} ${(data?.noResult || data.isDraw) ? 'noResult' : ''} ${data?.status === '-' ? 'dash' : ''}`}
                                  >
                                    {data?.status}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td>
                              {standing?.oTeam?.aMatch?.length ? <>
                                <div
                                  role='button'
                                  tabIndex={standing.oTeam._id}
                                  id={standing.oTeam._id}
                                  on={`tap:${standing.oTeam._id + '-C'}.show,${standing.oTeam._id}.hide,${standing.oTeam._id + '-active'}.show`}
                                  className='infoToggle'
                                >
                                  <amp-img src="/static/down-arrow.svg" alt="dropdown" width="60" height="60" layout="responsive" />
                                </div>
                                <div
                                  role='button'
                                  hidden
                                  tabIndex={standing.oTeam._id + '-active'}
                                  id={standing.oTeam._id + '-active'}
                                  on={`tap:${standing.oTeam._id + '-C'}.hide,${standing.oTeam._id + '-active'}.hide,${standing.oTeam._id}.show`}
                                  className='infoToggle active'
                                >
                                  <amp-img src="/static/down-arrow.svg" alt="dropdown" width="60" height="60" layout="responsive" />
                                </div>
                              </> : null}

                            </td>
                          </tr >
                          {standing?.oTeam?.aMatch?.length ? (
                            <tr id={standing.oTeam._id + '-C'} hidden>
                              <td colSpan={11} className={'infoTable'}>
                                <table>
                                  <thead>
                                    <tr>
                                      <td>Opponent</td>
                                      <td>Description</td>
                                      <td>Date</td>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {standing?.oTeam?.aMatch?.map(match => <StandingMatchData key={`match${standing?.oTeam._id}${match?.dStartDate}`} match={match} teamId={standing?.oTeam._id} />)}
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          ) : null
                          }
                        </React.Fragment>
                      )
                    })}
                </ThemeTableAMP>
              </React.Fragment>
            )
          })}
          <div>
            <Trans i18nKey="common:LastUpdatedOn" /> {convertDt24hFormat(dateCheck(standingsData[0]?.dUpdated))}
          </div>
          <p>
            <b>M:</b> Matches, <b>W:</b> Won, <b>L:</b> Lost, <b>T:</b> Tie, <b>N/R:</b> No Result, <b>PTS:</b> Points, <b>Net RR:</b> Net run rate, <b>Q:</b> Qualified
          </p>
        </div>
      )}
      {(roundData.current?.length === 0 || standingsData[0]?.oSeries?.sSeriesType !== 'tournament') && <NoDataAMP title={t('common:NoStandingsData')} />}
    </>
  )
}

StandingsAMP.propTypes = {
  round: PropTypes.array,
  standing: PropTypes.array,
  category: PropTypes.object
}

export default StandingsAMP
