import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import { useLazyQuery } from '@apollo/client'
import Trans from 'next-translate/Trans'

import styles from './style.module.scss'
import useTranslation from 'next-translate/useTranslation'
import { STATS } from '@graphql/series/stats.query'
import { tableLoader } from '@shared/libs/allLoader'
import { checkPageNumberInSlug, convertDt24hFormat, dateCheck } from '@shared/utils'
import tableItemStyles from '@assets/scss/components/table-item.module.scss'
import CustomSelect from '@shared/components/customSelect'
import { useRouter } from 'next/router'

const NoData = dynamic(() => import('@noData'), { ssr: false })
const Skeleton = dynamic(() => import('@shared-components/skeleton'), { ssr: false })
const ThemeTable = dynamic(() => import('@shared-components/themeTable'), { loading: () => tableLoader() })

const Stats = ({ data, typeData, id, matchTypeData }) => {
  const router = useRouter()
  const { slug } = checkPageNumberInSlug(router?.asPath?.split('/').filter(e => e))
  const pageUrl = slug.join('/')
  const { t } = useTranslation()
  const initCallRef = useRef(false)
  const grpTitleRef = useRef()
  const [selectedItem, setSelectedItem] = useState({ sDescription: null, _id: null })
  const firstTimeLoaderCheck = useRef(false)
  const type = typeData?.fetchSeriesStatsTypes
  const optionMatchType = matchTypeData?.map((type) => ({
    value: type,
    label: type.toUpperCase()
  }))
  const [labels, setLabels] = useState([`${t('common:No')}`, `${t('common:Player')}`, `${t('common:Runs')}`, `${t('common:Match')}`, `${t('common:Inns')}`, `${t('common:Avg')}`, `${t('common:SR')}`, `${t('common:4s')}`, `${t('common:6s')}`])

  const changeStats = useRef({
    stats: typeData?.fetchSeriesStatsTypes[0]?._id,
    matchType: matchTypeData && matchTypeData[0]
  })

  const optionType = [
    {
      sDescription: `${t('common:Bat')}`,
      options: typeData?.fetchSeriesStatsTypes?.filter((e) => e?.eGroupTitle === 'Bat')
    },
    {
      sDescription: `${t('common:Bowl')}`,
      options: typeData?.fetchSeriesStatsTypes?.filter((e) => e?.eGroupTitle === 'Bwl')
    },
    {
      sDescription: `${t('common:Team')}`,
      options: typeData?.fetchSeriesStatsTypes?.filter((e) => e?.eGroupTitle === 'Team')
    }
  ]

  const loaderRangeRef = useRef(9)
  const [getStats, { data: onChangeStats, loading }] = useLazyQuery(STATS)
  const [stateData, setStateData] = useState(data?.fetchSeriesStats)
  const [tableData, setTableData] = useState({
    nRuns: 'Runs',
    nMatches: 'Match',
    nInnings: 'Inns',
    nAverage: 'Avg',
    sStrike: 'SR',
    nRun4: '4s',
    nRun6: '6s'
  })
  const ChangeLabels = (description) => {
    if (description === 'batting_most_runs') {
      setTableData({ nRuns: 'Runs', nMatches: 'Match', nInnings: 'Inns', nAverage: 'Avg', sStrike: 'SR', nRun4: '4s', nRun6: '6s' })
      setLabels([`${t('common:No')}`, `${t('common:Player')}`, `${t('common:Runs')}`, `${t('common:Match')}`, `${t('common:Inns')}`, `${t('common:Avg')}`, `${t('common:SR')}`, `${t('common:4s')}`, `${t('common:6s')}`])
      loaderRangeRef.current = 9
    } else if (description === 'batting_most_runs_innings') {
      setTableData({ nRuns: 'Runs', nBalls: 'Balls', nAverage: 'Avg', sStrike: 'SR', nRun4: '4s', nRun6: '6s' })
      setLabels([`${t('common:No')}`, `${t('common:Batsmen')}`, `${t('common:Runs')}`, `${t('common:Balls')}`, `${t('common:Avg')}`, `${t('common:SR')}`, `${t('common:4s')}`, `${t('common:6s')}`])
      loaderRangeRef.current = 8
    } else if (description === 'batting_highest_strikerate') {
      setTableData({ sStrike: 'SR', nMatches: 'Match', nInnings: 'Inns', nRuns: 'Runs', nAverage: 'Avg' })
      setLabels([`${t('common:No')}`, `${t('common:Batsmen')}`, `${t('common:SR')}`, `${t('common:Matches')}`, `${t('common:Inns')}`, `${t('common:Runs')}`, `${t('common:Avg')}`])
      loaderRangeRef.current = 7
    } else if (description === 'batting_highest_strikerate_innings') {
      setTableData({ sStrike: 'SR', nMatches: 'Match', nInnings: 'Inns', nRuns: 'Runs', nAverage: 'Avg' })
      setLabels([`${t('common:No')}`, `${t('common:Batsmen')}`, `${t('common:SR')}`, `${t('common:Matches')}`, `${t('common:Inns')}`, `${t('common:Runs')}`, `${t('common:Avg')}`])
      loaderRangeRef.current = 7
    } else if (description === 'batting_highest_average') {
      setTableData({ nAverage: 'Avg', nMatches: 'Match', nInnings: 'Inns', nRuns: 'Runs', nNotout: 'N.O' })
      setLabels([`${t('common:No')}`, `${t('common:Batsmen')}`, `${t('common:Avg')}`, `${t('common:Matches')}`, `${t('common:Inns')}`, `${t('common:Runs')}`, `${t('common:No')}`])
      loaderRangeRef.current = 7
    } else if (description === 'batting_most_run100') {
      setTableData({ nRun100: '100s', nMatches: 'Match', nInnings: 'Inns', nRuns: 'Runs', nHighest: 'Hs' })
      setLabels([`${t('common:No')}`, `${t('common:Batsmen')}`, `${t('common:100s')}`, `${t('common:Matches')}`, `${t('common:Inns')}`, `${t('common:Runs')}`, `${t('common:HS')}`])
      loaderRangeRef.current = 7
    } else if (description === 'batting_most_run50') {
      setTableData({ nRun50: '50s', nMatches: 'Match', nInnings: 'Inns', nRuns: 'Runs', nHighest: 'Hs' })
      setLabels([`${t('common:No')}`, `${t('common:Batsmen')}`, `${t('common:50s')}`, `${t('common:Matches')}`, `${t('common:Inns')}`, `${t('common:Runs')}`, `${t('common:HS')}`])
      loaderRangeRef.current = 7
    } else if (description === 'batting_most_run6') {
      setTableData({ nRun6: '6s', nMatches: 'Match', nInnings: 'Inns', nRuns: 'Runs' })
      setLabels([`${t('common:No')}`, `${t('common:Batsmen')}`, `${t('common:6s')}`, `${t('common:Matches')}`, `${t('common:Inns')}`, `${t('common:Runs')}`])
      loaderRangeRef.current = 6
    } else if (description === 'batting_most_run6_innings') {
      setTableData({ nRun6: '6s', nMatches: 'Match', nInnings: 'Inns', nRuns: 'Runs' })
      setLabels([`${t('common:No')}`, `${t('common:Batsmen')}`, `${t('common:6s')}`, `${t('common:Matches')}`, `${t('common:Inns')}`, `${t('common:Runs')}`])
      loaderRangeRef.current = 6
    } else if (description === 'batting_most_run4') {
      setTableData({ nRun4: '4s', nMatches: 'Match', nInnings: 'Inns', nRuns: 'Runs' })
      setLabels([`${t('common:No')}`, `${t('common:Batsmen')}`, `${t('common:4s')}`, `${t('common:Matches')}`, `${t('common:Inns')}`, `${t('common:Runs')}`])
      loaderRangeRef.current = 6
    } else if (description === 'batting_most_run4_innings') {
      setTableData({ nRun4: '4s', nMatches: 'Match', nInnings: 'Inns', nRuns: 'Runs' })
      setLabels([`${t('common:No')}`, `${t('common:Batsmen')}`, `${t('common:4s')}`, `${t('common:Matches')}`, `${t('common:Inns')}`, `${t('common:Runs')}`])
      loaderRangeRef.current = 6
    } else if (description === 'bowling_top_wicket_takers') {
      // Bowl
      setTableData({
        nWickets: 'Wkts',
        nMatches: 'Match',
        nOvers: 'Ovs',
        nBalls: 'Balls',
        nAverage: 'Avg',
        nRuns: 'Runs',
        nWicket4i: '4-Fers',
        nWicket5i: '5-Fers'
      })
      setLabels([`${t('common:No')}`, `${t('common:Bowler')}`, `${t('common:Wkts')}`, `${t('common:Matches')}`, `${t('common:Ovs')}`, `${t('common:Balls')}`, `${t('common:Avg')}`, `${t('common:Runs')}`, `${t('common:4Fers')}`, `${t('common:5Fers')}`])
      loaderRangeRef.current = 10
    } else if (description === 'bowling_best_economy_rates') {
      setTableData({
        nEcon: 'Economy',
        nMatches: 'Match',
        nOvers: 'Ovs',
        nInnings: 'Inns',
        nWickets: 'Wkts',
        nAverage: 'Avg',
        sStrike: 'SR'
      })
      setLabels([`${t('common:No')}`, `${t('common:Bowler')}`, `${t('common:Economy')}`, `${t('common:Matches')}`, `${t('common:Ovs')}`, `${t('common:Inns')}`, `${t('common:Wkts')}`, `${t('common:Avg')}`, `${t('common:SR')}`])
      loaderRangeRef.current = 9
    } else if (description === 'bowling_best_economy_rates_innings') {
      setTableData({
        nEcon: 'Economy',
        nMatches: 'Match',
        nOvers: 'Ovs',
        nInnings: 'Inns',
        nWickets: 'Wkts',
        nAverage: 'Avg',
        sStrike: 'SR'
      })
      setLabels([`${t('common:No')}`, `${t('common:Bowler')}`, `${t('common:Economy')}`, `${t('common:Matches')}`, `${t('common:Ovs')}`, `${t('common:Inns')}`, `${t('common:Wkts')}`, `${t('common:Avg')}`, `${t('common:SR')}`])
      loaderRangeRef.current = 9
    } else if (description === 'bowling_best_bowling_figures') {
      setTableData({ sBestInning: 'BBI', nOvers: 'Ovs', nRuns: 'Runs', nWickets: 'Wkts', nMaidens: 'Maidens', nEcon: 'Economy' })
      setLabels([`${t('common:No')}`, `${t('common:Bowler')}`, `${t('common:BBI')}`, `${t('common:Ovs')}`, `${t('common:Runs')}`, `${t('common:Wkts')}`, `${t('common:Maidens')}`, `${t('common:Economy')}`])
      loaderRangeRef.current = 8
    } else if (description === 'bowling_best_strike_rates') {
      setTableData({ sStrike: 'SR', nMatches: 'Match', nOvers: 'Ovs', nWickets: 'Wkts' })
      setLabels([`${t('common:No')}`, `${t('common:Bowler')}`, `${t('common:SR')}`, `${t('common:Matches')}`, `${t('common:Ovs')}`, `${t('common:Wkts')}`])
      loaderRangeRef.current = 6
    } else if (description === 'bowling_best_strike_rates_innings') {
      setTableData({ sStrike: 'SR', nMatches: 'Match', nOvers: 'Ovs', nWickets: 'Wkts' })
      setLabels([`${t('common:No')}`, `${t('common:Bowler')}`, `${t('common:SR')}`, `${t('common:Matches')}`, `${t('common:Ovs')}`, `${t('common:Wkts')}`])
      loaderRangeRef.current = 6
    } else if (description === 'bowling_best_averages') {
      setTableData({ nAverage: 'Avg', nMatches: 'Match', nOvers: 'Ovs', nWickets: 'Wkts' })
      setLabels([`${t('common:No')}`, `${t('common:Bowler')}`, `${t('common:Avg')}`, `${t('common:Matches')}`, `${t('common:Ovs')}`, `${t('common:Wkts')}`])
      loaderRangeRef.current = 6
    } else if (description === 'bowling_most_runs_conceded_innings') {
      setTableData({ nRunsConceded: 'RCI', nOvers: 'Ovs', nWickets: 'Wkts', sBestInning: 'BBI', nMaidens: 'Maidens', nEcon: 'Economy' })
      setLabels([`${t('common:No')}`, `${t('common:Bowler')}`, `${t('common:RCI')}`, `${t('common:Ovs')}`, `${t('common:Wkts')}`, `${t('common:BBI')}`, `${t('common:Maidens')}`, `${t('common:Economy')}`])
      loaderRangeRef.current = 8
    } else if (description === 'bowling_four_wickets') {
      setTableData({ nWicket4i: '4-Fers', nMatches: 'Match', nOvers: 'Ovs', nRuns: 'Runs', nWickets: 'Wkts' })
      setLabels([`${t('common:No')}`, `${t('common:Bowler')}`, `${t('common:4Fers')}`, `${t('common:Matches')}`, `${t('common:Ovs')}`, `${t('common:Runs')}`, `${t('common:Wkts')}`])
      loaderRangeRef.current = 7
    } else if (description === 'bowling_five_wickets') {
      setTableData({ nWicket5i: '5-Fers', nMatches: 'Match', nOvers: 'Ovs', nRuns: 'Runs', nWickets: 'Wkts' })
      setLabels([`${t('common:No')}`, `${t('common:Bowler')}`, `${t('common:5Fers')}`, `${t('common:Matches')}`, `${t('common:Ovs')}`, `${t('common:Runs')}`, `${t('common:Wkts')}`])
      loaderRangeRef.current = 7
    } else if (description === 'bowling_maidens') {
      setTableData({ nMaidens: 'Maidens', nMatches: 'Match', nOvers: 'Ovs', nRuns: 'Runs', nWickets: 'Wkts', nWicket5i: '5-Fers' })
      setLabels([`${t('common:No')}`, `${t('common:Bowler')}`, `${t('common:Maidens')}`, `${t('common:Matches')}`, `${t('common:Ovs')}`, `${t('common:Runs')}`, `${t('common:Wkts')}`, `${t('common:5Fers')}`])
      loaderRangeRef.current = 8
    } else if (description === 'team_total_runs') {
      // Team
      setTableData({ nRuns: 'Runs', nRun100: '100s', nRun50: '50s', nWickets: 'Wkts' })
      setLabels([`${t('common:No')}`, `${t('common:Team')}`, `${t('common:Runs')}`, `${t('common:100s')}`, `${t('common:50s')}`, `${t('common:Wkts')}`])
      loaderRangeRef.current = 6
    } else if (description === 'team_total_run100') {
      setTableData({ nRun100: '100s', nRuns: 'Runs', nRun50: '50s', nWickets: 'Wkts' })
      setLabels([`${t('common:No')}`, `${t('common:Team')}`, `${t('common:100s')}`, `${t('common:Runs')}`, `${t('common:50s')}`, `${t('common:Wkts')}`])
      loaderRangeRef.current = 6
    } else if (description === 'team_total_run50') {
      setTableData({ nRun50: '50s', nRuns: 'Runs', nRun100: '100s', nWickets: 'Wkts' })
      setLabels([`${t('common:No')}`, `${t('common:Team')}`, `${t('common:50s')}`, `${t('common:Runs')}`, `${t('common:100s')}`, `${t('common:Wkts')}`])
      loaderRangeRef.current = 6
    } else if (description === 'team_total_wickets') {
      setTableData({ nWickets: 'Wkts', nRunsConceded: 'RUNS Cons', nWicket4i: '4-Fers', nWicket5i: '5-Fers' })
      setLabels([`${t('common:No')}`, `${t('common:Team')}`, `${t('common:Wkts')}`, `${t('common:RunsCons')}`, `${t('common:4Fers')}`, `${t('common:5Fers')}`])
      loaderRangeRef.current = 6
    }
  }

  const handleChangeStats = (e) => {
    const slugType = e.sSeoType || e.sType
    const url = `/${slug?.join('/')}/${slugType.split('_').join('-')}`
    router.push({ pathname: url }, undefined, { shallow: true })
    if (!firstTimeLoaderCheck.current && slugType === 'batting_most_runs') {
      firstTimeLoaderCheck.current = true
      setStateData([])
    }
    e._id !== changeStats.current.stats && setStateData([])
    grpTitleRef.current = e.eGroupTitle
    changeStats.current = ({ ...changeStats.current, stats: e._id })
    ChangeLabels(slugType)
  }

  const handleMatchType = (e) => {
    e.value !== changeStats.current.matchType && setStateData([])
    changeStats.current = ({ ...changeStats.current, matchType: e.value })
    ChangeLabels(changeStats.current.stats)
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

  useLayoutEffect(() => {
    const currentRoute = router.asPath.split('/').slice(-2)[0]
    const currentItem = typeData?.fetchSeriesStatsTypes?.filter((item) => {
      const slugType = item.sSeoType || item.sType
      return slugType === currentRoute.split('-').join('_')
    })
    setSelectedItem({ sDescription: currentItem[0]?.sDescription, _id: currentItem[0]?._id })
  }, [router])

  return (
    <>
      {type?.length !== 0 && (
        <>
          <div className={`${styles.filterTitle} d-flex justify-content-between align-items-center mb-2`}>
            <h4 className="text-uppercase mb-0">
              <Trans i18nKey="common:Stats" />
            </h4>
            {matchTypeData && <div className={`${styles.filters} ms-auto me-1`}>
              <CustomSelect
                value={optionMatchType[0]}
                options={optionMatchType}
                placeholder="Select Match"
                onChange={(e) => handleMatchType(e)}
              />
            </div>}
            <div className={`${styles.filterStats}`}>
              <ul className="d-none">
                {
                  optionType?.map((item, index) =>
                    item?.options.map((item, index) => {
                      const urlStat = `/${pageUrl}/${item?.sType.split('_').join('-')}`
                      return <li key={item?._id}>
                        <a href={urlStat}>
                          {item?.sDescription}
                        </a>
                      </li>
                    }
                    ))
              }
              </ul>
              <CustomSelect
                value={(selectedItem._id && selectedItem) || optionType[0].options[0]}
                options={optionType}
                placeholder="Select Type"
                labelKey="sDescription"
                valueKey="_id"
                onChange={(e) => handleChangeStats(e)}
              />
            </div>
          </div>
          <div className={`${styles.stats}`}>
            <ThemeTable labels={labels} isNumbered={true}>
              {loading && [0, 1, 2, 3, 4, 5, 6, 7, 8].map((s) => {
                return (
                  <tr key={s}>
                    <td><Skeleton /></td>
                    <td><Skeleton className={`${tableItemStyles.itemDesc} d-flex align-items-center flex-grow-1 p-0 mx-2`} /></td>
                    {[...Array(loaderRangeRef.current)]?.slice(2)?.map((index) => {
                      return (<td key={index}><Skeleton /></td>)
                    })}
                  </tr>
                )
              })}
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
            </ThemeTable>
            {!loading && stateData?.length === 0 && <NoData />}
            {stateData[0]?.dUpdated && <div className="table-footer-note">
              <Trans i18nKey="common:LastUpdatedOn" /> {convertDt24hFormat(dateCheck(stateData[0].dUpdated))}
            </div>}
          </div>
        </>
      )}
      {type?.length === 0 && <NoData />}
    </>
  )
}

Stats.propTypes = {
  data: PropTypes.object,
  typeData: PropTypes.object,
  id: PropTypes.string,
  matchTypeData: PropTypes.array
}

export default Stats
