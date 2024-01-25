import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import Trans from 'next-translate/Trans'

// import styles from './style.module.scss'
import useTranslation from 'next-translate/useTranslation'
import { tableLoader } from '@shared/libs/allLoader'
import { convertDt24hFormat, dateCheck } from '@shared/utils'

const NoDataAMP = dynamic(() => import('@shared-components/amp/noDataAMP'), { ssr: false })
const ThemeTableAMP = dynamic(() => import('@shared-components/amp/themeTable'), { loading: () => tableLoader() })

const StatsAMP = ({ data, typeData, id, matchTypeData }) => {
  const { t } = useTranslation()
  const grpTitleRef = useRef()
  const type = typeData?.fetchSeriesStatsTypes
  const labels = [`${t('common:No')}`, `${t('common:Player')}`, `${t('common:Runs')}`, `${t('common:Match')}`, `${t('common:Inns')}`, `${t('common:Avg')}`, `${t('common:SR')}`, `${t('common:4s')}`, `${t('common:6s')}`]

  const stateData = data?.fetchSeriesStats
  const tableData = {
    nRuns: 'Runs',
    nMatches: 'Match',
    nInnings: 'Inns',
    nAverage: 'Avg',
    sStrike: 'SR',
    nRun4: '4s',
    nRun6: '6s'
  }

  return (
    <>
      <style jsx amp-custom>{`
      *{box-sizing:border-box}h4{margin:0 0 8px;font-size:21px;line-height:32px;font-weight:700;text-transform:uppercase}h5{margin:0 0 16px;font-size:18px;line-height:27px;font-weight:700}th,td{padding:4px 14px;height:44px;text-align:center}th:first-child,td:first-child{border-radius:8px 0 0 8px}th:last-child,td:last-child{border-radius:0 8px 8px 0}th{background:#045de9;color:#fff;text-transform:capitalize}td{background:#fff}.highlight td{background:#e7f0ff}.icon-img{margin-right:10px;display:inline-block;width:36px;height:36px;background:#fff;border-radius:10px;overflow:hidden;vertical-align:middle}.stats th,.stats td{width:5.6%}.stats th:nth-child(2),.stats td:nth-child(2){text-align:left;width:inherit}button.active{color:#045de9}.filters{width:160px}.filterStats{width:200px}@media(min-width: 992px)and (max-width: 1199px){h4{margin:0 0 12px;font-size:19px;line-height:28px}h5{margin:0 0 12px;font-size:17px;line-height:26px}}@media(max-width: 991px){h4{margin:0 0 10px;font-size:18px;line-height:27px}h5{margin:0 0 10px;font-size:16px;line-height:24px}th,td{padding:4px 10px;height:40px}th:first-child,td:first-child{border-radius:4px 0 0 4px}th:last-child,td:last-child{border-radius:0 4px 4px 0}.icon-img{width:24px;height:24px;border-radius:4px}}@media(max-width: 575px){h4{margin:0 0 12px;font-size:16px;line-height:26px}h5{margin:0 0 12px;font-size:15px;line-height:22px}th,td{padding:2px 5px;height:30px}th:first-child,td:first-child{border-radius:3px 0 0 3px;padding-left:10px}th:last-child,td:last-child{border-radius:0 3px 3px 0;padding-right:10px}.icon-img{width:23px;height:23px;border-radius:3px}.d-sm-none{display:block}.d-sm-block{display:none}.filters{width:120px}.filterStats{width:180px}}/*# sourceMappingURL=style.css.map */

      `}
      </style>
      {type?.length !== 0 && (
        <>
          <div className="filterTitle d-flex justify-content-between align-items-center mb-2">
            <h4 className="text-uppercase mb-0">
              <Trans i18nKey="common:Stats" />
            </h4>
          </div>
          <div className="stats">
            <ThemeTableAMP labels={labels} isNumbered={true}>
              {stateData?.map((state, index) => {
                return (
                  <tr key={state.key || index} className={`${state.highlight && 'highlight'}`}>
                    <td>{index + 1}</td>
                    {grpTitleRef.current === 'Team' ? <td>{state?.oTeam?.sTitle}</td> : <td>{state?.oPlayer?.sFirstName || state?.oPlayer?.sFullName}</td>}
                    {Object.keys(tableData)?.map((value) => {
                      return <td key={value}>{state[value]}</td>
                    })}
                  </tr>
                )
              })}
            </ThemeTableAMP>
            {stateData?.length === 0 && <NoDataAMP />}
            {stateData[0]?.dUpdated && <div>
              <Trans i18nKey="common:LastUpdatedOn" /> {convertDt24hFormat(dateCheck(stateData[0].dUpdated))}
            </div>}
          </div>
        </>
      )}
      {type?.length === 0 && <NoDataAMP />}
    </>
  )
}

StatsAMP.propTypes = {
  data: PropTypes.object,
  typeData: PropTypes.object,
  id: PropTypes.string,
  matchTypeData: PropTypes.array
}

export default StatsAMP
