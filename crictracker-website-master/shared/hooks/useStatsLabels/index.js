import useTranslation from 'next-translate/useTranslation'
// import { useAmp } from 'next/amp'
import { useRef } from 'react'

const useStatsLabels = () => {
  const { t } = useTranslation()
  // const isAmp = useAmp()
  const tableData = useRef({
    oTeam: 'Team',
    nRuns: 'Runs',
    nMatches: 'Match',
    nInnings: 'Inns',
    nAverage: 'Avg',
    sStrike: 'SR',
    nRun4: '4s',
    nRun6: '6s'
  })
  const labels = useRef([`${t('common:No')}`, `${t('common:Player')}`, `${t('common:Team')}`, `${t('common:Runs')}`, `${t('common:Match')}`, `${t('common:Inns')}`, `${t('common:Avg')}`, `${t('common:SR')}`, `${t('common:4s')}`, `${t('common:6s')}`])

  function changeLabels(sType) {
    if (sType === 'batting_most_runs') {
      tableData.current = { oTeam: 'Team', nRuns: 'Runs', nMatches: 'Match', nBalls: 'Balls', nAverage: 'Avg', nHighest: 'HS', sStrike: 'SR', nRun4: '4s', nRun6: '6s', nRun100: '100s', nRun50: '50s' }
      labels.current = [`${t('common:No')}`, `${t('common:Player')}`, `${t('common:Team')}`, `${t('common:Runs')}`, `${t('common:Mat')}`, `${t('common:BF')}`, `${t('common:Avg')}`, `${t('common:HS')}`, `${t('common:SR')}`, `${t('common:4s')}`, `${t('common:6s')}`, t('common:100s'), t('common:50s')]
      // if (!isAmp) {
      //   tableData.current = TD
      //   labels.current = lb
      // }
      return { columnCount: 10, labels: labels.current, tableData: tableData.current }
    } else if (sType === 'batting_most_runs_innings') {
      tableData.current = { oTeam: 'Team', nRuns: 'Runs', nBalls: 'Balls', nAverage: 'Avg', sStrike: 'SR', nRun4: '4s', nRun6: '6s' }
      labels.current = [`${t('common:No')}`, `${t('common:Batsmen')}`, `${t('common:Team')}`, `${t('common:Runs')}`, `${t('common:Balls')}`, `${t('common:Avg')}`, `${t('common:SR')}`, `${t('common:4s')}`, `${t('common:6s')}`]
      // if (!isAmp) {
      //   tableData.current = TD
      //   labels.current = lb
      // }
      return { columnCount: 9, labels: labels.current, tableData: tableData.current }
    } else if (sType === 'batting_highest_strikerate') {
      tableData.current = { oTeam: 'Team', sStrike: 'SR', nMatches: 'Match', nInnings: 'Inns', nRuns: 'Runs', nAverage: 'Avg' }
      labels.current = [`${t('common:No')}`, `${t('common:Batsmen')}`, `${t('common:Team')}`, `${t('common:SR')}`, `${t('common:Matches')}`, `${t('common:Inns')}`, `${t('common:Runs')}`, `${t('common:Avg')}`]
      // if (!isAmp) {
      //   tableData.current = TD
      //   labels.current = lb
      // }
      return { columnCount: 8, labels: labels.current, tableData: tableData.current }
    } else if (sType === 'batting_highest_strikerate_innings') {
      tableData.current = { oTeam: 'Team', sStrike: 'SR', nMatches: 'Match', nInnings: 'Inns', nRuns: 'Runs', nAverage: 'Avg' }
      labels.current = [`${t('common:No')}`, `${t('common:Batsmen')}`, `${t('common:Team')}`, `${t('common:SR')}`, `${t('common:Matches')}`, `${t('common:Inns')}`, `${t('common:Runs')}`, `${t('common:Avg')}`]
      // if (!isAmp) {
      //   tableData.current = TD
      //   labels.current = lb
      // }
      return { columnCount: 8, labels: labels.current, tableData: tableData.current }
    } else if (sType === 'batting_highest_average') {
      tableData.current = { oTeam: 'Team', nAverage: 'Avg', nMatches: 'Match', nInnings: 'Inns', nRuns: 'Runs', nNotout: 'N.O' }
      labels.current = [`${t('common:No')}`, `${t('common:Batsmen')}`, `${t('common:Team')}`, `${t('common:Avg')}`, `${t('common:Matches')}`, `${t('common:Inns')}`, `${t('common:Runs')}`, `${t('common:No')}`]
      // if (!isAmp) {
      //   tableData.current = TD
      //   labels.current = lb
      // }
      return { columnCount: 8, labels: labels.current, tableData: tableData.current }
    } else if (sType === 'batting_most_run100') {
      tableData.current = { oTeam: 'Team', nRun100: '100s', nMatches: 'Match', nInnings: 'Inns', nRuns: 'Runs', nHighest: 'Hs' }
      labels.current = [`${t('common:No')}`, `${t('common:Batsmen')}`, `${t('common:Team')}`, `${t('common:100s')}`, `${t('common:Matches')}`, `${t('common:Inns')}`, `${t('common:Runs')}`, `${t('common:HS')}`]
      // if (!isAmp) {
      //   tableData.current = TD
      //   labels.current = lb
      // }
      return { columnCount: 8, labels: labels.current, tableData: tableData.current }
    } else if (sType === 'batting_most_run50') {
      tableData.current = { oTeam: 'Team', nRun50: '50s', nMatches: 'Match', nInnings: 'Inns', nRuns: 'Runs', nHighest: 'Hs' }
      labels.current = [`${t('common:No')}`, `${t('common:Batsmen')}`, `${t('common:Team')}`, `${t('common:50s')}`, `${t('common:Matches')}`, `${t('common:Inns')}`, `${t('common:Runs')}`, `${t('common:HS')}`]
      // if (!isAmp) {
      //   tableData.current = TD
      //   labels.current = lb
      // }
      return { columnCount: 8, labels: labels.current, tableData: tableData.current }
    } else if (sType === 'batting_most_run6') {
      tableData.current = { oTeam: 'Team', nRun6: '6s', nMatches: 'Match', nInnings: 'Inns', nRuns: 'Runs' }
      labels.current = [`${t('common:No')}`, `${t('common:Batsmen')}`, `${t('common:Team')}`, `${t('common:6s')}`, `${t('common:Matches')}`, `${t('common:Inns')}`, `${t('common:Runs')}`]
      // if (!isAmp) {
      //   tableData.current = TD
      //   labels.current = lb
      // }
      return { columnCount: 7, labels: labels.current, tableData: tableData.current }
    } else if (sType === 'batting_most_run6_innings') {
      tableData.current = { oTeam: 'Team', nRun6: '6s', nMatches: 'Match', nInnings: 'Inns', nRuns: 'Runs' }
      labels.current = [`${t('common:No')}`, `${t('common:Batsmen')}`, `${t('common:Team')}`, `${t('common:6s')}`, `${t('common:Matches')}`, `${t('common:Inns')}`, `${t('common:Runs')}`]
      // if (!isAmp) {
      //   tableData.current = TD
      //   labels.current = lb
      // }
      return { columnCount: 7, labels: labels.current, tableData: tableData.current }
    } else if (sType === 'batting_most_run4') {
      tableData.current = { oTeam: 'Team', nRun4: '4s', nMatches: 'Match', nInnings: 'Inns', nRuns: 'Runs' }
      labels.current = [`${t('common:No')}`, `${t('common:Batsmen')}`, `${t('common:Team')}`, `${t('common:4s')}`, `${t('common:Matches')}`, `${t('common:Inns')}`, `${t('common:Runs')}`]
      // if (!isAmp) {
      //   tableData.current = TD
      //   labels.current = lb
      // }
      return { columnCount: 7, labels: labels.current, tableData: tableData.current }
    } else if (sType === 'batting_most_run4_innings') {
      tableData.current = { oTeam: 'Team', nRun4: '4s', nMatches: 'Match', nInnings: 'Inns', nRuns: 'Runs' }
      labels.current = [`${t('common:No')}`, `${t('common:Batsmen')}`, `${t('common:Team')}`, `${t('common:4s')}`, `${t('common:Matches')}`, `${t('common:Inns')}`, `${t('common:Runs')}`]
      // if (!isAmp) {
      //   tableData.current = TD
      //   labels.current = lb
      // }
      return { columnCount: 7, labels: labels.current, tableData: tableData.current }
    } else if (sType === 'bowling_top_wicket_takers') {
      // Bowl
      tableData.current = { oTeam: 'Team', nWickets: 'Wkts', nMatches: 'Match', nOvers: 'Ovs', sBestInning: 'BBI', nBalls: 'Balls', nAverage: 'Avg', nEcon: 'Economy', nRuns: 'Runs', nWicket4i: '4-Fers', nWicket5i: '5-Fers' }
      labels.current = [`${t('common:No')}`, `${t('common:Bowler')}`, `${t('common:Team')}`, `${t('common:Wkts')}`, `${t('common:Mat')}`, `${t('common:Ovs')}`, t('common:BBI'), `${t('common:Balls')}`, `${t('common:Avg')}`, t('common:Ecn'), `${t('common:Runs')}`, `${t('common:4Fers')}`, `${t('common:5Fers')}`]
      // if (!isAmp) {
      //   tableData.current = TD
      //   labels.current = lb
      // }
      return { columnCount: 11, labels: labels.current, tableData: tableData.current }
    } else if (sType === 'bowling_best_economy_rates') {
      tableData.current = { oTeam: 'Team', nEcon: 'Economy', nMatches: 'Match', nOvers: 'Ovs', nInnings: 'Inns', nWickets: 'Wkts', nAverage: 'Avg', sStrike: 'SR' }
      labels.current = [`${t('common:No')}`, `${t('common:Bowler')}`, `${t('common:Team')}`, `${t('common:Economy')}`, `${t('common:Matches')}`, `${t('common:Ovs')}`, `${t('common:Inns')}`, `${t('common:Wkts')}`, `${t('common:Avg')}`, `${t('common:SR')}`]
      // if (!isAmp) {
      //   tableData.current = TD
      //   labels.current = lb
      // }
      return { columnCount: 10, labels: labels.current, tableData: tableData.current }
    } else if (sType === 'bowling_best_economy_rates_innings') {
      tableData.current = { oTeam: 'Team', nEcon: 'Economy', nMatches: 'Match', nOvers: 'Ovs', nInnings: 'Inns', nWickets: 'Wkts', nAverage: 'Avg', sStrike: 'SR' }
      labels.current = [`${t('common:No')}`, `${t('common:Bowler')}`, `${t('common:Team')}`, `${t('common:Economy')}`, `${t('common:Matches')}`, `${t('common:Ovs')}`, `${t('common:Inns')}`, `${t('common:Wkts')}`, `${t('common:Avg')}`, `${t('common:SR')}`]
      // if (!isAmp) {
      //   tableData.current = TD
      //   labels.current = lb
      // }
      return { columnCount: 10, labels: labels.current, tableData: tableData.current }
    } else if (sType === 'bowling_best_bowling_figures') {
      tableData.current = { oTeam: 'Team', sBestInning: 'BBI', nOvers: 'Ovs', nRuns: 'Runs', nWickets: 'Wkts', nMaidens: 'Maidens', nEcon: 'Economy' }
      labels.current = [`${t('common:No')}`, `${t('common:Bowler')}`, `${t('common:Team')}`, `${t('common:BBI')}`, `${t('common:Ovs')}`, `${t('common:Runs')}`, `${t('common:Wkts')}`, `${t('common:Maidens')}`, `${t('common:Economy')}`]
      // if (!isAmp) {
      //   tableData.current = TD
      //   labels.current = lb
      // }
      return { columnCount: 9, labels: labels.current, tableData: tableData.current }
    } else if (sType === 'bowling_best_strike_rates') {
      tableData.current = { oTeam: 'Team', sStrike: 'SR', nMatches: 'Match', nOvers: 'Ovs', nWickets: 'Wkts' }
      labels.current = [`${t('common:No')}`, `${t('common:Bowler')}`, `${t('common:Team')}`, `${t('common:SR')}`, `${t('common:Matches')}`, `${t('common:Ovs')}`, `${t('common:Wkts')}`]
      // if (!isAmp) {
      //   tableData.current = TD
      //   labels.current = lb
      // }
      return { columnCount: 7, labels: labels.current, tableData: tableData.current }
    } else if (sType === 'bowling_best_strike_rates_innings') {
      tableData.current = { oTeam: 'Team', sStrike: 'SR', nMatches: 'Match', nOvers: 'Ovs', nWickets: 'Wkts' }
      labels.current = [`${t('common:No')}`, `${t('common:Bowler')}`, `${t('common:Team')}`, `${t('common:SR')}`, `${t('common:Matches')}`, `${t('common:Ovs')}`, `${t('common:Wkts')}`]
      // if (!isAmp) {
      //   tableData.current = TD
      //   labels.current = lb
      // }
      return { columnCount: 7, labels: labels.current, tableData: tableData.current }
    } else if (sType === 'bowling_best_averages') {
      tableData.current = { oTeam: 'Team', nAverage: 'Avg', nMatches: 'Match', nOvers: 'Ovs', nWickets: 'Wkts' }
      labels.current = [`${t('common:No')}`, `${t('common:Bowler')}`, `${t('common:Team')}`, `${t('common:Avg')}`, `${t('common:Matches')}`, `${t('common:Ovs')}`, `${t('common:Wkts')}`]
      // if (!isAmp) {
      //   tableData.current = TD
      //   labels.current = lb
      // }
      return { columnCount: 7, labels: labels.current, tableData: tableData.current }
    } else if (sType === 'bowling_most_runs_conceded_innings') {
      tableData.current = { oTeam: 'Team', nRuns: 'RCI', nOvers: 'Ovs', nWickets: 'Wkts', sBestInning: 'BBI', nMaidens: 'Maidens', nEcon: 'Economy' }
      labels.current = [`${t('common:No')}`, `${t('common:Bowler')}`, `${t('common:Team')}`, `${t('common:RCI')}`, `${t('common:Ovs')}`, `${t('common:Wkts')}`, `${t('common:BBI')}`, `${t('common:Maidens')}`, `${t('common:Economy')}`]
      // if (!isAmp) {
      //   tableData.current = TD
      //   labels.current = lb
      // }
      return { columnCount: 9, labels: labels.current, tableData: tableData.current }
    } else if (sType === 'bowling_four_wickets') {
      tableData.current = { oTeam: 'Team', nWicket4i: '4-Fers', nMatches: 'Match', nOvers: 'Ovs', nRuns: 'Runs', nWickets: 'Wkts' }
      labels.current = [`${t('common:No')}`, `${t('common:Bowler')}`, `${t('common:Team')}`, `${t('common:4Fers')}`, `${t('common:Matches')}`, `${t('common:Ovs')}`, `${t('common:Runs')}`, `${t('common:Wkts')}`]
      // if (!isAmp) {
      //   tableData.current = TD
      //   labels.current = lb
      // }
      return { columnCount: 8, labels: labels.current, tableData: tableData.current }
    } else if (sType === 'bowling_five_wickets') {
      tableData.current = { oTeam: 'Team', nWicket5i: '5-Fers', nMatches: 'Match', nOvers: 'Ovs', nRuns: 'Runs', nWickets: 'Wkts' }
      labels.current = [`${t('common:No')}`, `${t('common:Bowler')}`, `${t('common:Team')}`, `${t('common:5Fers')}`, `${t('common:Matches')}`, `${t('common:Ovs')}`, `${t('common:Runs')}`, `${t('common:Wkts')}`]
      // if (!isAmp) {
      //   tableData.current = TD
      //   labels.current = lb
      // }
      return { columnCount: 8, labels: labels.current, tableData: tableData.current }
    } else if (sType === 'bowling_maidens') {
      tableData.current = { oTeam: 'Team', nMaidens: 'Maidens', nMatches: 'Match', nOvers: 'Ovs', nRuns: 'Runs', nWickets: 'Wkts', nWicket5i: '5-Fers' }
      labels.current = [`${t('common:No')}`, `${t('common:Bowler')}`, `${t('common:Team')}`, `${t('common:Maidens')}`, `${t('common:Matches')}`, `${t('common:Ovs')}`, `${t('common:Runs')}`, `${t('common:Wkts')}`, `${t('common:5Fers')}`]
      // if (!isAmp) {
      //   tableData.current = TD
      //   labels.current = lb
      // }
      return { columnCount: 9, labels: labels.current, tableData: tableData.current }
    } else if (sType === 'team_total_runs') {
      // Team
      tableData.current = { nRuns: 'Runs', nRun100: '100s', nRun50: '50s', nWickets: 'Wkts' }
      labels.current = [`${t('common:No')}`, `${t('common:Team')}`, `${t('common:Runs')}`, `${t('common:100s')}`, `${t('common:50s')}`, `${t('common:Wkts')}`]
      // if (!isAmp) {
      //   tableData.current = TD
      //   labels.current = lb
      // }
      return { columnCount: 6, labels: labels.current, tableData: tableData.current }
    } else if (sType === 'team_total_run100') {
      tableData.current = { nRun100: '100s', nRuns: 'Runs', nRun50: '50s', nWickets: 'Wkts' }
      labels.current = [`${t('common:No')}`, `${t('common:Team')}`, `${t('common:100s')}`, `${t('common:Runs')}`, `${t('common:50s')}`, `${t('common:Wkts')}`]
      // if (!isAmp) {
      //   tableData.current = TD
      //   labels.current = lb
      // }
      return { columnCount: 6, labels: labels.current, tableData: tableData.current }
    } else if (sType === 'team_total_run50') {
      tableData.current = { nRun50: '50s', nRuns: 'Runs', nRun100: '100s', nWickets: 'Wkts' }
      labels.current = [`${t('common:No')}`, `${t('common:Team')}`, `${t('common:50s')}`, `${t('common:Runs')}`, `${t('common:100s')}`, `${t('common:Wkts')}`]
      // if (!isAmp) {
      //   tableData.current = TD
      //   labels.current = lb
      // }
      return { columnCount: 6, labels: labels.current, tableData: tableData.current }
    } else if (sType === 'team_total_wickets') {
      tableData.current = { nWickets: 'Wkts', nRunsConceded: 'RUNS Cons', nWicket4i: '4-Fers', nWicket5i: '5-Fers' }
      labels.current = [`${t('common:No')}`, `${t('common:Team')}`, `${t('common:Wkts')}`, `${t('common:RunsCons')}`, `${t('common:4Fers')}`, `${t('common:5Fers')}`]
      // if (!isAmp) {
      //   tableData.current = TD
      //   labels.current = lb
      // }
      return { columnCount: 6, labels: labels.current, tableData: tableData.current }
    } else {
      return { columnCount: 6, labels: labels.current, tableData: tableData.current }
    }
  }

  return {
    tableData: tableData?.current,
    labels: labels?.current,
    changeLabels
  }
}

export default useStatsLabels
