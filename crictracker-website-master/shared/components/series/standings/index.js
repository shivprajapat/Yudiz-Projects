import React, { useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import PropTypes from 'prop-types'
import useTranslation from 'next-translate/useTranslation'
import Trans from 'next-translate/Trans'
import { Button } from 'react-bootstrap'

import styles from './style.module.scss'
import { StandingMatchWinLoss, convertDt24hFormat, dateCheck } from '@shared/utils'
import { WPL_TEAM_NAME_WITH_ID } from '@shared/libs/daily-hunt'
import { tableLoader } from '@shared/libs/allLoader'
import MyImage from '@shared/components/myImage'
import dropdown from '@assets/images/icon/down-arrow.svg'

const ThemeTable = dynamic(() => import('@shared-components/themeTable'), { loading: () => tableLoader() })
const StandingMatchData = dynamic(() => import('@shared/components/series/standings/standingMatchData'))
const CustomLink = dynamic(() => import('@shared/components/customLink'))
const NoData = dynamic(() => import('@noData'), { ssr: false })

const Standings = ({ round, standing, hideSeriesTitle, id, category }) => {
  const roundData = useRef(round)
  const [collapsed, setCollapsed] = useState({})
  const toggleCollapse = (id) => {
    setCollapsed(prev => ({ ...prev, [id]: !prev[id] }))
  }
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

  function getTitle(data, key) {
    const isDailyHunt = id === '63ef1221cd0901d13d0996bc'
    const name = WPL_TEAM_NAME_WITH_ID[data?.oTeam?._id] || data?.oTeam[key]
    // const name = data?.oTeam[key]
    if (isDailyHunt) return name
    else return data?.oTeam[key]
  }

  return (
    <>
      {roundData.current?.length !== 0 && (
        <div className={`${styles.standings}`}>
          {!hideSeriesTitle && (
            <h4 className="text-uppercase">
              {category?._id === '623184adf5d229bacb00ff63' ? 'IPL Points Table 2023' : <Trans i18nKey="common:PointsTable" />}
            </h4>
          )}
          {roundData.current?.map((round) => {
            return (
              <React.Fragment key={round._id}>
                {(!hideSeriesTitle && category?._id !== '623184adf5d229bacb00ff63') && <h5>{round?.sName}</h5>}
                <ThemeTable labels={labels}>
                  {standingsData?.filter((s) => round._id === s?.oRound?._id).map((standing, index) => {
                    const matchForm = StandingMatchWinLoss(standing?.oTeam)
                    return (
                      <React.Fragment key={standing._id}>
                        <tr className={standing.bIsQualified ? 'highlight' : ''}>
                          <td>{(index + 1)}</td>
                          <td>
                            {standing?.oTeam?.eTagStatus === 'a' ? (
                              <>
                                <CustomLink href={standing?.oTeam?.oSeo?.sSlug}>
                                  <a className="d-none d-sm-block">{getTitle(standing, 'sTitle')}{standing.bIsQualified && ' (Q)'}</a>
                                </CustomLink>
                                <CustomLink href={standing?.oTeam?.oSeo?.sSlug}>
                                  <a className="d-block d-sm-none">{getTitle(standing, 'sAbbr')}{standing.bIsQualified && ' (Q)'}</a>
                                </CustomLink>
                              </>
                            ) : (
                              <>
                                <span
                                  className="d-none d-sm-block"
                                >
                                  {getTitle(standing, 'sTitle')}{standing.bIsQualified && ' (Q)'}
                                </span>
                                <span
                                  className="d-block d-sm-none"
                                >
                                  {getTitle(standing, 'sAbbr')}{standing.bIsQualified && ' (Q)'}
                                </span>
                              </>
                            )}
                          </td>
                          {Object.keys(table.current)?.map((value) => {
                            return <td key={value}>{standing[value]}</td>
                          })}
                          <td>
                            <div className="d-flex align-items-center">
                              {matchForm?.map((data, i) => (
                                <span
                                  key={`form${i}`}
                                  className={`${styles.winBadge} rounded-circle flex-shrink-0 ${!data?.isWinner ? styles.loss : ''} ${(data?.noResult || data.isDraw) ? styles.noResult : ''} ${data?.status === '-' ? styles.dash : ''}`}>
                                  {data?.status}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td>
                            {standing?.oTeam?.aMatch?.length ? (
                              <Button
                                variant="link"
                                className={`${styles.infoToggle} flex-srink-0 ${collapsed[standing._id] && styles.active}`}
                                onClick={() => toggleCollapse(standing._id)}
                                aria-controls="example-collapse-text"
                                aria-expanded={collapsed[standing._id]}
                              >
                                <MyImage src={dropdown} alt="dropdown" />
                              </Button>
                            ) : null}
                          </td>
                        </tr>
                        {standing?.oTeam?.aMatch?.length ? (
                          <tr className={collapsed[standing._id] ? styles.collapsedRow : 'd-none'} >
                            <td colSpan={11} className={`${styles.infoTable}`}>
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
                        ) : null}
                      </React.Fragment>
                    )
                  })}
                </ThemeTable>
              </React.Fragment>
            )
          })}
          <div className="table-footer-note xsmall-text mt-n1">
            <Trans i18nKey="common:LastUpdatedOn" /> {convertDt24hFormat(dateCheck(standingsData[0]?.dUpdated))}
          </div>
          <p>
            <b>M:</b> Matches, <b>W:</b> Won, <b>L:</b> Lost, <b>T:</b> Tie, <b>N/R:</b> No Result, <b>PTS:</b> Points, <b>Net RR:</b> Net run rate, <b>Q:</b> Qualified
          </p>
        </div>
      )}
      {(roundData.current?.length === 0) && <NoData title={t('common:NoStandingsData')} />}
    </>
  )
}

Standings.propTypes = {
  round: PropTypes.array,
  standing: PropTypes.array,
  hideSeriesTitle: PropTypes.bool,
  id: PropTypes.string,
  category: PropTypes.object
}

export default Standings
