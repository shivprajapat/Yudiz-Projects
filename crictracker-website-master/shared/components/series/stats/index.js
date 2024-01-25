import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import { useLazyQuery } from '@apollo/client'
import Trans from 'next-translate/Trans'

import styles from './style.module.scss'
import useTranslation from 'next-translate/useTranslation'
import { STATS } from '@graphql/series/stats.query'
import { tableLoader } from '@shared/libs/allLoader'
import { checkPageNumberInSlug, convertDt24hFormat, dateCheck, objectArraySortByOrder } from '@shared/utils'
import tableItemStyles from '@assets/scss/components/table-item.module.scss'
import CustomSelect from '@shared/components/customSelect'
import { useRouter } from 'next/router'
import CustomLink from '@shared/components/customLink'
import { Col, Row } from 'react-bootstrap'
import { SERIES_STATS_ORDER } from '@shared/constants/seriesStatsOrder'
import useStatsLabels from '@shared/hooks/useStatsLabels'

const CtToolTip = dynamic(() => import('@shared/components/ctToolTip'))
const NoData = dynamic(() => import('@noData'), { ssr: false })
const Skeleton = dynamic(() => import('@shared-components/skeleton'), { ssr: false })
const ThemeTable = dynamic(() => import('@shared-components/themeTable'), { loading: () => tableLoader() })

const Stats = ({ data, typeData, id, matchTypeData, category, seoData }) => {
  const router = useRouter()
  const { changeLabels } = useStatsLabels()
  const { slug } = checkPageNumberInSlug(router?.asPath?.split('/').filter((e) => e))
  const pageUrl = slug.join('/')
  const { t } = useTranslation()
  const initCallRef = useRef(false)

  const type = typeData?.fetchSeriesStatsTypes?.map((e) => {
    const stats = category?.subPages?.filter((p) => p?.eSubType === (e?.eSubType || ''))
    const sType = e.sSeoType || e.sType
    return {
      ...e,
      sSlug: stats?.length ? `/${stats[0]?.sSlug}` : `/${pageUrl}/${sType.split('_').join('-')}`
    }
  })
  const allStats = objectArraySortByOrder({ data: type, order: SERIES_STATS_ORDER })

  const optionType = [
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
  const optionMatchType = matchTypeData?.map((type) => ({
    value: type,
    label: type?.toUpperCase()
  }))

  const statsLabels = [`${t('common:BattingStats')}`, `${t('common:BowlingStats')}`, `${t('common:TeamStats')}`]
  const loaderRangeRef = useRef(9)
  const [getStats, { data: onChangeStats, loading }] = useLazyQuery(STATS)
  const [stateData, setStateData] = useState(data?.fetchSeriesStats)

  const selectedItem = getSelectedStats()
  const { labels: stLabels, tableData: stTableData } = changeLabels(selectedItem?.sType)

  const changeStats = useRef({
    stats: selectedItem?._id,
    matchType: matchTypeData && matchTypeData[0]
  })

  const [tableData, setTableData] = useState(stTableData)
  const [labels, setLabels] = useState(stLabels)

  const handleChangeStats = (e) => {
    router.push({ pathname: e?.sSlug }, undefined)
    // router.push({ pathname: url }, undefined, { shallow: true })
  }

  const handleMatchType = (e) => {
    e.value !== changeStats.current.matchType && setStateData([])
    changeStats.current = { ...changeStats.current, matchType: e.value }
    const { labels: stLabels, tableData: stTableData } = changeLabels(changeStats.current.stats)
    setTableData(stTableData)
    setLabels(stLabels)
  }

  useEffect(() => {
    if (changeStats.current && initCallRef.current) {
      getStats({ variables: { input: { iSeriesId: id, _id: changeStats.current.stats, eFormat: changeStats.current.matchType } } })
    }
  }, [changeStats.current])

  useEffect(() => {
    onChangeStats && setStateData(onChangeStats?.fetchSeriesStats)
  }, [onChangeStats])

  useEffect(() => {
    initCallRef.current = true
  }, [])

  useEffect(() => {
    setStateData(data?.fetchSeriesStats)
    setTableData(stTableData)
    setLabels(stLabels)
  }, [data?.fetchSeriesStats])

  function getSelectedStats() {
    const currentItem = type?.filter((item) => {
      return item?.eSubType === seoData?.eSubType
    })
    return currentItem?.length > 0 ? currentItem[0] : optionType[0]?.options[0]
  }

  return (
    <>
      {type?.length !== 0 && (
        <>
          {seoData?.eSubType !== 'st' && (<>
            <div className={`${styles.filterTitle} d-md-flex justify-content-between align-items-center mb-2`}>
              <h4 className="text-uppercase mb-1 mb-md-0">
                {category?.data?.oSeries?.sSrtTitle || ''}
                &nbsp;
                {selectedItem?.sDescription}
                {/* <Trans i18nKey="common:Stats" /> */}
              </h4>
              {matchTypeData?.length > 0 && (
                <div className={`${styles.filters} ms-auto me-1`}>
                  <CustomSelect
                    // value={optionMatchType[0]}
                    options={optionMatchType}
                    defaultSelected
                    placeholder="Select Match"
                    onChange={(e) => handleMatchType(e)}
                  />
                </div>
              )}
              <div className={`${styles.filterStats}`}>
                <ul className='d-none'>
                  {optionType?.map((item, index) =>
                    item?.options.map((item, index) => {
                      return (
                        <li key={item?._id}>
                          <a href={`${item?.sSlug}/`}>{item?.sDescription}</a>
                        </li>
                      )
                    })
                  )}
                </ul>
                <CustomSelect
                  value={(selectedItem?._id && selectedItem) || optionType[0].options[0]}
                  options={optionType}
                  placeholder="Select Type"
                  labelKey="sDescription"
                  valueKey="_id"
                  onChange={(e) => handleChangeStats(e)}
                  isNative
                />
              </div>
            </div>
            <div className={`${styles.stats}`}>
              <ThemeTable labels={labels} isNumbered={true}>
                {loading &&
                  [0, 1, 2, 3, 4, 5, 6, 7, 8].map((s) => {
                    return (
                      <tr key={s}>
                        <td>
                          <Skeleton />
                        </td>
                        <td>
                          <Skeleton className={`${tableItemStyles.itemDesc} d-flex align-items-center flex-grow-1 p-0 mx-2`} />
                        </td>
                        {[...Array(loaderRangeRef.current)]?.slice(2)?.map((index) => {
                          return (
                            <td key={index}>
                              <Skeleton />
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })}
                {stateData?.map((state, index) => {
                  return (
                    <tr key={state.key || index} className={state.highlight ? 'highlight' : ''}>
                      <td>{index + 1}</td>
                      <td>
                        {selectedItem?.eGroupTitle === 'Team' ? (
                          state?.oTeam?.eTagStatus === 'a' ? (
                            <CustomLink href={`/${state?.oTeam?.oSeo?.sSlug}/`}>
                              <a className='theme-text'>{state?.oTeam?.sTitle}</a>
                            </CustomLink>
                          ) : (
                            state?.oTeam?.sTitle
                          )
                        ) : (
                          state?.oPlayer?.eTagStatus === 'a' ? (
                            <CustomLink href={`/${state?.oPlayer?.oSeo?.sSlug}/`}>
                              <a className='theme-text'>{state?.oPlayer?.sFirstName || state?.oPlayer?.sFullName}</a>
                            </CustomLink>
                          ) : (
                            state?.oPlayer?.sFirstName || state?.oPlayer?.sFullName || '-'
                          )
                        )}
                      </td>
                      {Object.keys(tableData)?.map((value, i) => {
                        return (
                          <td
                            key={value}
                            className={(selectedItem?.eGroupTitle === 'Team' && i === 0) ? styles.highLight : (selectedItem?.eGroupTitle !== 'Team' && i === 1) ? styles.highLight : ''}
                          >
                            {(value === 'oTeam' ? (
                              state[value]?.eTagStatus === 'a' ? (
                                <CustomLink href={`/${state[value].oSeo?.sSlug}/`}>
                                  <a className='theme-text'>
                                    <CtToolTip tooltip={state[value]?.sTitle}>
                                      <span>{state[value]?.sAbbr}</span>
                                    </CtToolTip>
                                  </a>
                                </CustomLink>
                              ) : (
                                <CtToolTip tooltip={state[value]?.sTitle}>
                                  <span>{state[value]?.sAbbr}</span>
                                </CtToolTip>
                              )
                            ) : (
                              state[value]
                            )) || '--'}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </ThemeTable>
              {!loading && stateData?.length === 0 && <NoData />}
              {stateData[0]?.dUpdated && (
                <div className="table-footer-note xsmall-text mt-n1">
                  <Trans i18nKey="common:LastUpdatedOn" /> {convertDt24hFormat(dateCheck(stateData[0].dUpdated))}
                </div>
              )}
              <p className='mt-1'><b>Inns:</b> Innings, <b>Avg:</b> Average, <b>SR:</b> Strike Rate, <b>H.S:</b> Highest Score, <b>Wkts:</b> Wickets, <b>Ovs:</b> Overs, <b>4-Fers:</b> Four Wicket Haul, <b>5-Fers:</b> Five Wicket Haul, <b>BBI:</b> Best Bowling in Innings, <b>RCI:</b> Runs Conceded Innings, <b>ECN:</b> Economy, <b>Mdns:</b> Maidens, <b>Mat:</b> Matches, <b>BF:</b> Balls Faced</p>
            </div>
          </>)}
          {seoData?.eSubType === 'st' && (
            <Row className="mt-4 gx-2 gx-md-3">
              {
                optionType?.map((state, index) => {
                  return (
                    <Col key={index} md={6} lg={6} xl={4} className=''>
                      <ThemeTable labels={[statsLabels[index]]}>
                        <tr>
                          <td key={state.key || index} className={`${state.highlight ? 'highlight' : ''} align-top`}>
                            <div className="d-flex flex-column">
                              {state?.options?.map((option, index) => {
                                return (
                                  // <CustomLink href={getStatsPageURL(urlStat, sType)} key={index}>
                                  <CustomLink href={`${option?.sSlug}/`} key={index}>
                                    <a className="theme-btn outline-btn small-btn outline-light mb-2">{option?.sDescription}</a>
                                  </CustomLink>
                                )
                              })}
                            </div>
                          </td>
                        </tr>
                      </ThemeTable>
                    </Col>
                  )
                })
              }
            </Row>
          )}
        </>
      )}
      {type?.length === 0 && <NoData />}
    </>
  )
}

Stats.propTypes = {
  data: PropTypes.object,
  typeData: PropTypes.object,
  category: PropTypes.object,
  id: PropTypes.string,
  matchTypeData: PropTypes.array,
  seoData: PropTypes.object
}

export default Stats
