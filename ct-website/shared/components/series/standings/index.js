import React, { useRef } from 'react'
import dynamic from 'next/dynamic'
import PropTypes from 'prop-types'
import Trans from 'next-translate/Trans'

import styles from './style.module.scss'
import { tableLoader } from '@shared/libs/allLoader'
import { convertDt24hFormat, dateCheck } from '@shared/utils'

const ThemeTable = dynamic(() => import('@shared-components/themeTable'), { loading: () => tableLoader() })
const NoData = dynamic(() => import('@noData'), { ssr: false })

const Standings = ({ round, standing }) => {
  const roundData = useRef(round)
  const table = useRef({ nPlayed: 'M', nWin: 'W', nLoss: 'L', nDraw: 'T', nNR: 'N/R', nPoints: 'PTS', nNetrr: 'Net RR' })
  const labels = ['No', 'Team', 'M', 'W', 'L', 'T', 'N/R', 'PTS', 'Net RR']
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
      {roundData.current?.length !== 0 && (
        <div className={`${styles.standings}`}>
          <h4 className="text-uppercase">
            <Trans i18nKey="common:Standings" />
          </h4>
          {roundData.current?.map((round) => {
            return (
              <React.Fragment key={round._id}>
                <h5>{round?.sName}</h5>
                <ThemeTable labels={labels}>
                  {standingsData
                    ?.filter((s) => round._id === s?.oRound?._id)
                    .map((standing, index) => {
                      return (
                        <tr key={standing._id} className={`${standing.highlight && 'highlight'}`}>
                          <td>{index + 1}</td>
                          <td><span className="d-none d-sm-block">{standing?.oTeam?.sTitle}</span><span className="d-block d-sm-none">{standing?.oTeam?.sAbbr}</span></td>
                          {Object.keys(table.current)?.map((value) => {
                            return <td key={value}>{standing[value]}</td>
                          })}
                        </tr>
                      )
                    })}
                </ThemeTable>
              </React.Fragment>
            )
          })}
          <div className="table-footer-note">
            <Trans i18nKey="common:LastUpdatedOn" /> {convertDt24hFormat(dateCheck(standingsData[0]?.dUpdated))}
          </div>
        </div>
      )}
      {(roundData.current?.length === 0) && <NoData />}
    </>
  )
}

Standings.propTypes = {
  round: PropTypes.array,
  standing: PropTypes.array
}

export default Standings
