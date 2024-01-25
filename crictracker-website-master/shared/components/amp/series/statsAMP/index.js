import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import Trans from 'next-translate/Trans'

// import styles from './style.module.scss'
import useTranslation from 'next-translate/useTranslation'
import { tableLoader } from '@shared/libs/allLoader'
import { checkPageNumberInSlug, convertDt24hFormat, dateCheck, objectArraySortByOrder } from '@shared/utils'
import { useRouter } from 'next/router'
import useStatsLabels from '@shared/hooks/useStatsLabels'
import { Col, Row } from 'react-bootstrap'
import { SERIES_STATS_ORDER } from '@shared/constants/seriesStatsOrder'

const NoDataAMP = dynamic(() => import('@shared-components/amp/noDataAMP'))
const ThemeTableAMP = dynamic(() => import('@shared-components/amp/themeTable'), { loading: () => tableLoader() })

const StatsAMP = ({ data, typeData, id, matchTypeData, category, seoData }) => {
  const { t } = useTranslation()
  const { changeLabels } = useStatsLabels()
  const router = useRouter()
  const { slug } = checkPageNumberInSlug(router?.asPath?.split('/').filter(e => e))
  const pageUrl = slug.join('/')
  const type = typeData?.fetchSeriesStatsTypes?.map((e) => {
    const stats = category?.subPages?.filter((p) => p?.eSubType === (e?.eSubType || ''))
    const sType = e.sSeoType || e.sType
    return {
      ...e,
      sSlug: stats?.length ? `/${stats[0]?.sSlug}` : `/${pageUrl}/${sType.split('_').join('-')}`
    }
  })
  const stateData = data?.fetchSeriesStats
  const allStats = objectArraySortByOrder({ data: type, order: SERIES_STATS_ORDER })
  const optionType = getOptionsType()
  const selectedStatsObj = getSelectedStats()
  const { labels, tableData } = changeLabels(selectedStatsObj?.sType)

  function getSelectedStats() {
    const currentItem = type?.filter((item) => {
      return item?.eSubType === seoData?.eSubType
    }) || []
    return currentItem?.length > 0 ? currentItem[0] : optionType[0]?.options[0]
  }

  const statsLabels = [`${t('common:BattingStats')}`, `${t('common:BowlingStats')}`, `${t('common:TeamStats')}`]

  function getOptionsType() {
    return (
      [
        {
          sDescription: `${t('common:Bat')}`,
          options: allStats?.filter((e) => e?.eGroupTitle === 'Bat')
        },
        {
          sDescription: `${t('common:Bowl')}`,
          options: allStats?.filter((e) => e?.eGroupTitle === 'Bwl')
        },
        {
          sDescription: `${t('common:Team')}`,
          options: allStats?.filter((e) => e?.eGroupTitle === 'Team')
        }
      ]
    )
  }

  // function getStatsPageURL(url, type) {
  //   if (id === '63f052b9d5e097df610db62d' && type === 'batting_most_runs') {
  //     return '/ipl-orange-cap/'
  //   } else if (id === '63f052b9d5e097df610db62d' && type === 'bowling_top_wicket_takers') {
  //     return '/ipl-purple-cap/'
  //   }
  //   return url
  // }

  return (
    <>
      <style jsx amp-custom global>{`
     .form-select{width:200px}.form-select select{width:100%;background-repeat:no-repeat;background-image:url(/static/down-arrow.svg);background-position:right 8px center;background-size:auto 60%;border-radius:8px;height:100%;background-color:var(--light-mode-bg);border:1px solid var(--border-color);color:var(--font-color);padding:10px 32px 10px 12px;font-size:16px;font-weight:500;overflow:hidden;appearance:none;-webkit-appearance:none}@media(prefers-color-scheme: dark){.form-select select{background-image:url(/static/down-caret.svg)}}.stats th,.stats td{width:5.6%;text-align:center}.stats th:nth-child(2),.stats td:nth-child(2){text-align:left;width:inherit;position:sticky;left:0}.align-top{vertical-align:top}button.active{color:#045de9}.filters{width:160px}.filterStats{width:200px}.highLight{background-color:var(--theme-light)}@media(max-width: 991px){.form-select{padding-right:12px;width:180px}.form-select select{padding:10px 12px;font-size:14px}}@media(max-width: 575px){.d-sm-none{display:block}.d-sm-block{display:none}.filters{width:120px}.filterStats{width:180px}.form-select{padding-right:10px;width:180px}.form-select select{padding:6px 10px;font-size:12px}}/*# sourceMappingURL=style.css.map */

     .highLight { background-color: var(--theme-light); }
      `}
      </style>
      {type?.length !== 0 && (
        <>
          {seoData?.eSubType !== 'st' && (<>
            <div className="filterTitle d-flex justify-content-between align-items-center mb-2">
              <h4 className="text-uppercase mb-0">
                {category?.data?.oSeries?.sSrtTitle || ''}
                &nbsp;
                {selectedStatsObj?.sDescription}
              </h4>
              <div className='form-select'>
                <select on="change:AMP.navigateTo(url=event.value)">
                  {
                    optionType?.map((data) =>
                      <optgroup key={`stats${data?.sDescription}`} label={data?.sDescription}>
                        {data?.options.map((option, index) => {
                          return (
                            <option
                              key={index}
                              selected={option?.sSlug === selectedStatsObj?.sSlug}
                              value={`${option?.sSlug}/?amp=1`}
                            >
                              {option?.sDescription}
                            </option>
                          )
                        })}
                      </optgroup>
                    )
                  }
                </select>
              </div>
            </div>
            <div className="stats">
              <ThemeTableAMP labels={labels} isNumbered={true}>
                {stateData?.map((state, index) => {
                  return (
                    <tr key={state.key || index}>
                      <td>{index + 1}</td>
                      <td>
                        {selectedStatsObj?.eGroupTitle === 'Team' ? (
                          state?.oTeam?.eTagStatus === 'a' ? (
                            <a href={`/${state?.oTeam?.oSeo?.sSlug}/?amp=1`}>
                              {state?.oTeam?.sTitle}
                            </a>
                          ) : (
                            state?.oTeam?.sTitle
                          )
                        ) : (
                          state?.oPlayer?.eTagStatus === 'a' ? (
                            <a href={`/${state?.oPlayer?.oSeo?.sSlug}/?amp=1`}>
                              {state?.oPlayer?.sFirstName || state?.oPlayer?.sFullName}
                            </a>
                          ) : (
                            state?.oPlayer?.sFirstName || state?.oPlayer?.sFullName
                          )
                        )}
                      </td>
                      {Object.keys(tableData)?.map((value, i) => {
                        return (
                          <td
                            key={value}
                            className={(selectedStatsObj?.eGroupTitle === 'Team' && i === 0) ? 'highLight' : (selectedStatsObj?.eGroupTitle !== 'Team' && i === 1) ? 'highLight' : ''}
                          >
                            {(value === 'oTeam' ? (
                              state[value]?.eTagStatus === 'a' ? (
                                <a href={`/${state[value].oSeo?.sSlug}/?amp=1`}>
                                  {state[value]?.sAbbr}
                                </a>
                              ) : (
                                state[value]?.sAbbr
                              )
                            ) : state[value]) || '--'}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </ThemeTableAMP>
              {stateData?.length === 0 && <NoDataAMP />}
              {stateData[0]?.dUpdated && <div>
                <Trans i18nKey="common:LastUpdatedOn" /> {convertDt24hFormat(dateCheck(stateData[0].dUpdated))}
              </div>}
              <p className='mt-1'><b>Inns:</b> Innings, <b>Avg:</b> Average, <b>SR:</b> Strike Rate, <b>H.S:</b> Highest Score, <b>Wkts:</b> Wickets, <b>Ovs:</b> Overs, <b>4-Fers:</b> Four Wicket Haul, <b>5-Fers:</b> Five Wicket Haul, <b>BBI:</b> Best Bowling in Innings, <b>RCI:</b> Runs Conceded Innings, <b>ECN:</b> Economy, <b>Mdns:</b> Maidens, <b>Mat:</b> Matches, <b>BF:</b> Balls Faced</p>
            </div>
          </>)}
          {seoData?.eSubType === 'st' && (
            <Row className="mt-4 row-8">
              {
                optionType?.map((state, index) => {
                  return (
                    <Col key={index} md={6} lg={4}>
                      <ThemeTableAMP labels={[statsLabels[index]]}>
                        <tr>
                          <td key={state.key || index} className={`${state.highlight && 'highlight'} align-top`}>
                            <div className="d-flex flex-column">
                              {state?.options?.map((option, index) => {
                                return (
                                  <a href={`${option?.sSlug}/?amp=1`} key={index} className="theme-btn outline-btn small-btn outline-light mb-2">{option?.sDescription}</a>
                                )
                              })}
                            </div>
                          </td>
                        </tr>
                      </ThemeTableAMP>
                    </Col>
                  )
                })
              }
            </Row>
          )}
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
  matchTypeData: PropTypes.array,
  category: PropTypes.object,
  seoData: PropTypes.object
}

export default StatsAMP
