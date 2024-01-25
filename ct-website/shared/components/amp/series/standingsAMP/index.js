import React, { useRef } from 'react'
import dynamic from 'next/dynamic'
import PropTypes from 'prop-types'
import Trans from 'next-translate/Trans'

import { tableLoader } from '@shared/libs/allLoader'
import { convertDt24hFormat, dateCheck } from '@shared/utils'

const ThemeTableAMP = dynamic(() => import('@shared-components/amp/themeTable'), { loading: () => tableLoader() })
const NoData = dynamic(() => import('@noData'), { ssr: false })

const StandingsAMP = ({ round, standing }) => {
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
      <style jsx amp-custom>{`
    *{box-sizing:border-box}h4{margin:0 0 16px;font-size:21px;line-height:32px;font-weight:700}h5{margin:0 0 16px;font-size:18px;line-height:27px;font-weight:700}th,td{padding:4px 14px;height:44px;text-align:center}th:first-child,td:first-child{border-radius:8px 0 0 8px}th:last-child,td:last-child{border-radius:0 8px 8px 0}th{background:#045de9;color:#fff;text-transform:capitalize}td{background:#fff}.highlight td{background:#e7f0ff}.icon-img{margin-right:10px;display:inline-block;width:36px;height:36px;background:#fff;border-radius:10px;overflow:hidden;vertical-align:middle}.standings{font-size:14px;line-height:20px}.standings th,.standings td{width:5.6%}.standings th:nth-child(2),.standings td:nth-child(2){text-align:left;width:inherit}.d-sm-none{display:none}@media(min-width: 992px)and (max-width: 1199px){h4{margin:0 0 12px;font-size:19px;line-height:28px}h5{margin:0 0 12px;font-size:17px;line-height:26px}}@media(max-width: 991px){h4{margin:0 0 10px;font-size:18px;line-height:27px}h5{margin:0 0 10px;font-size:16px;line-height:24px}th,td{padding:4px 10px;height:40px}th:first-child,td:first-child{border-radius:4px 0 0 4px}th:last-child,td:last-child{border-radius:0 4px 4px 0}.icon-img{width:24px;height:24px;border-radius:4px}}@media(max-width: 575px){h4{margin:0 0 12px;font-size:16px;line-height:26px}h5{margin:0 0 12px;font-size:15px;line-height:22px}th,td{padding:2px 5px;height:30px}th:first-child,td:first-child{border-radius:3px 0 0 3px;padding-left:10px}th:last-child,td:last-child{border-radius:0 3px 3px 0;padding-right:10px}.icon-img{width:23px;height:23px;border-radius:3px}.d-sm-none{display:block}.d-sm-block{display:none}}/*# sourceMappingURL=style.css.map */

      `}
      </style>
      {roundData.current?.length !== 0 && standingsData[0]?.oSeries?.sSeriesType === 'tournament' && (
        <div className="standings">
          <h4 className="text-uppercase">
            <Trans i18nKey="common:Standings" />
          </h4>
          {roundData.current?.map((round) => {
            return (
              <React.Fragment key={round._id}>
                <h5>{round?.sName}</h5>
                <ThemeTableAMP labels={labels} isNumbered={true}>
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
                </ThemeTableAMP>
              </React.Fragment>
            )
          })}
          <div>
            <Trans i18nKey="common:LastUpdatedOn" /> {convertDt24hFormat(dateCheck(standingsData[0]?.dUpdated))}
          </div>
        </div>
      )}
      {(roundData.current?.length === 0 || standingsData[0]?.oSeries?.sSeriesType !== 'tournament') && <NoData />}
    </>
  )
}

StandingsAMP.propTypes = {
  round: PropTypes.array,
  standing: PropTypes.array
}

export default StandingsAMP
