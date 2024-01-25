import { dateCheck } from '@shared/utils'

const statSlugs = ['batting-most-runs',
  'batting-most-runs-innings',
  'batting-highest-strikerate',
  'batting-highest-strikerate-innings',
  'batting-highest-average',
  'batting-most-centuries',
  'batting-most-run50',
  'batting-most-sixes',
  'batting-most-fours',
  'batting-most-run4-innings',
  'bowling-top-wicket-takers',
  'bowling-best-economy-rates',
  'bowling-best-economy-rates-innings',
  'bowling-best-bowling-figures',
  'bowling-best-strike-rates',
  'bowling-best-strike-rates-innings',
  'bowling-best-averages',
  'bowling-most-runs-conceded-innings',
  'bowling-four-wickets',
  'bowling-five-wickets',
  'bowling-maidens',
  'team-total-runs',
  'team-total-run100',
  'team-total-wickets',
  'batting-most-fifties'
]

const getCategoryMeta = ({ oSeo, oCategory, tab, t, router }) => {
  const statsUrl = router.asPath.split('/')
  const statSlug = statsUrl[statsUrl?.length - 2]
  const isIpl = (oCategory?._id === '623184adf5d229bacb00ff63' || oCategory?._id === '623184adf5d229bacb00ff40')
  if (oCategory?.eType === 'as') {
    if (statSlugs.includes(statSlug)) {
      return {
        ...oSeo,
        sTitle: makeStatTitle(oCategory, tab, t, statSlug, isIpl),
        sDescription: makeStatDescription(oCategory, tab, t, statSlug, isIpl),
        sRobots: getRobots(oSeo, oCategory, tab),
        sCUrl: oSeo?.sCUrl,
        oFB: {
          sTitle: makeStatTitle(oCategory, tab, t, statSlug, isIpl),
          sDescription: makeStatDescription(oCategory, tab, t, statSlug, isIpl)
        },
        oTwitter: {
          sTitle: makeStatTitle(oCategory, tab, t, statSlug, isIpl),
          sDescription: makeStatDescription(oCategory, tab, t, statSlug, isIpl)
        }
      }
    } else if (oCategory?._id === '62ea94cf8059cc6a8f70bd39') { // https://www.crictracker.com/t20/bbl-big-bash-league/
      return {
        ...oSeo,
        sTitle: makeBBLTitle(tab, oSeo),
        sDescription: makeBBLDescription(tab, oSeo),
        sRobots: getRobots(oSeo, oCategory, tab),
        sCUrl: oSeo?.sCUrl,
        oFB: {
          sTitle: makeBBLTitle(tab, oSeo),
          sDescription: makeBBLDescription(tab, oSeo)
        },
        oTwitter: {
          sTitle: makeBBLTitle(tab, oSeo),
          sDescription: makeBBLDescription(tab, oSeo)
        }
      }
    } else {
      return {
        ...oSeo,
        sTitle: makeTitle(oSeo, oCategory, tab, t, isIpl),
        sDescription: makeDescription(oSeo, oCategory, tab, t, isIpl),
        sRobots: getRobots(oSeo, oCategory, tab),
        sCUrl: oSeo?.sCUrl,
        oFB: {
          sTitle: makeTitle(oSeo, oCategory, tab, t, isIpl),
          sDescription: makeDescription(oSeo, oCategory, tab, t, isIpl)
        },
        oTwitter: {
          sTitle: makeTitle(oSeo, oCategory, tab, t, isIpl),
          sDescription: makeDescription(oSeo, oCategory, tab, t, isIpl)
        }
      }
    }
  }
  return oSeo
}
export default getCategoryMeta

const makeBBLTitle = (tab, oSeo) => {
  if (tab === 'news') return 'BBL News | Big Bash League 2022-23 Latest News & Updates'
  if (tab === 'videos') return 'BBL 2022-23 Latest Videos, Match Highlights, Pre & Post match Analysis'
  if (tab === 'fixtures') return 'BBL Schedule 2022-23 | BBL Fixtures, Time Table, Timings & Venue'
  if (tab === 'standings') return 'BBL Points Table 2022-23 | BBL Standings & Team Rankings'
  if (tab === 'stats') return 'BBL 2022-23 All Stats'
  if (tab === 'teams') return 'BBL 2022-23 Teams, News, Squads, Playing XI'
  if (tab === 'squads') return 'BBL 2022-23 Squads and Full Players List of all Team'
  else return oSeo?.sTitle || 'BBL Live Score | BBL 2022-23 News, Updates & Scores'
}
const makeBBLDescription = (tab, oSeo) => {
  if (tab === 'news') return 'BBL 2022-23: Check out the Big Bash League 2022-23 Latest news, Live updates, Match previews, Post match analysis & more on CricTracker'
  if (tab === 'videos') return 'BBL 2022-23: Get all the Big Bash League 2022-23 latest videos, Breaking news, Match Highlights, Analysis, Trending videos and more on CricTracker'
  if (tab === 'fixtures') return 'BBL 2022-23  Fixtures: Check out the latest Big Bash league schedule 2022-23 with updated timings, Date, Time table, Teams, venue, & match details on CricTracker'
  if (tab === 'standings') return 'BBL 2022-23 Points Table - Check out the latest Big Bash league 2022-23 points table with team rankings, points, matches won, net run rate, wins, & updated team standings on CricTracker'
  if (tab === 'stats') return 'BBL 2022-23  Stats : Get all the live stats of Big Bash League 2022-23 including Most fifties, hundreds, catches, highest averages & more on CricTracker'
  if (tab === 'teams') return 'Check out the BBL 2022-23 Latest Teams, Squads, Playing XI. Get the latest updates and news of Big Bash League 2022-23 only on CricTracker'
  if (tab === 'squads') return "Big Bash League Teams List and Squads: Check out the list of all teams that will compete in the Big Bash League 2022-23. Here's the full squad list of each team, including reserves and substitutes"
  else return oSeo?.sDescription || 'BBL Live Score: Get all the latest Big Bash league 2022-23 news, BBL scores, squads, fixtures, injury updates, match results, & fantasy tips only on CricTracker'
}

const makeTitle = (oSeo, oCategory, tab, t, isIpl) => {
  const fullName = oCategory?.oSeries?.sTitle
  const name = oCategory?.oSeries?.sSrtTitle || oCategory?.oSeries?.sTitle
  const year = dateCheck(oCategory?.oSeries?.dStartDate)?.getFullYear()
  if (tab === 'news') return t('SeriesTitle.News', { name, year: isIpl ? 2023 : year, fullName })
  if (tab === 'videos') return t('SeriesTitle.Videos', { name, year: isIpl ? 2023 : year })
  if (tab === 'fixtures') return t('SeriesTitle.Fixtures', { name, year: isIpl ? 2023 : year })
  if (tab === 'standings') return t('SeriesTitle.Standings', { name, year: isIpl ? 2023 : year })
  if (tab === 'stats') return t('SeriesTitle.Stats', { name, year: isIpl ? 2023 : year })
  if (tab === 'teams') return t('SeriesTitle.Teams', { name, year: isIpl ? 2023 : year })
  if (tab === 'squads') return t('SeriesTitle.Squads', { name, year })
  if (tab === 'archives') return t('SeriesTitle.Archives', { name, year })
  if (tab === 'fantasy-tips') return t('SeriesTitle.FantasyTips', { name, year: isIpl ? 2023 : year })
  else return oSeo?.sTitle || t('SeriesTitle.Home', { name, year })
}

const makeStatTitle = (oCategory, tab, t, statSlug, isIpl) => {
  const name = oCategory?.oSeries?.sSrtTitle || oCategory?.oSeries?.sTitle
  const year = isIpl ? 2023 : dateCheck(oCategory?.oSeries?.dStartDate)?.getFullYear()
  if (statSlug === 'batting-most-runs') return t('StatTitle.MostRuns', { name, year })
  if (statSlug === 'batting-most-runs-innings') return t('StatTitle.HighestIndividualScore', { name, year })
  if (statSlug === 'batting-highest-strikerate') return t('StatTitle.BattingHighestRates', { name, year })
  if (statSlug === 'batting-highest-strikerate-innings') return t('StatTitle.BattingHighestRatesInnings', { name, year })
  if (statSlug === 'batting-highest-average') return t('StatTitle.BattingHighestAverage', { name, year })
  if (statSlug === 'batting-most-centuries') return t('StatTitle.BattingMostCenturies', { name, year })
  if (statSlug === 'batting-most-run50') return t('StatTitle.BattingMostFifties', { name, year })
  if (statSlug === 'batting-most-sixes') return t('StatTitle.BattingMostSixes', { name, year })
  if (statSlug === 'batting-most-fours') return t('StatTitle.BattingMostFours', { name, year })
  if (statSlug === 'batting-most-run4-innings') return t('StatTitle.BattingMostFoursInnings', { name, year })
  if (statSlug === 'bowling-top-wicket-takers') return t('StatTitle.BowlingTopWicketTakers', { name, year })
  if (statSlug === 'bowling-best-economy-rates') return t('StatTitle.BowlingBestEconomyRates', { name, year })
  if (statSlug === 'bowling-best-economy-rates-innings') return t('StatTitle.BowlingBestEconomyRatesInnings', { name, year })
  if (statSlug === 'bowling-best-bowling-figures') return t('StatTitle.BowlingBestBowlingFigures', { name, year })
  if (statSlug === 'bowling-best-strike-rates') return t('StatTitle.BowlingBestStrikeRates', { name, year })
  if (statSlug === 'bowling-best-strike-rates-innings') return t('StatTitle.BowlingBestStrikeRatesInnings', { name, year })
  if (statSlug === 'bowling-best-averages') return t('StatTitle.BowlingBestAverage', { name, year })
  if (statSlug === 'bowling-most-runs-conceded-innings') return t('StatTitle.BowlingMostRunsConcededInnings', { name, year })
  if (statSlug === 'bowling-four-wickets') return t('StatTitle.BowlingFourWickets', { name, year })
  if (statSlug === 'bowling-five-wickets') return t('StatTitle.BowlingFiveWickets', { name, year })
  if (statSlug === 'bowling-maidens') return t('StatTitle.BowlingMaidens', { name, year })
  if (statSlug === 'team-total-runs') return t('StatTitle.TeamTotalRuns', { name, year })
  if (statSlug === 'team-total-run100') return t('StatTitle.TeamMostCenturies', { name, year })
  if (statSlug === 'team-total-wickets') return t('StatTitle.TeamTotalWickets', { name, year })
  if (statSlug === 'batting-most-fifties') return t('StatTitle.TeamMostFifties', { name, year })
}

const makeDescription = (oSeo, oCategory, tab, t, isIpl) => {
  const fullName = oCategory?.oSeries?.sTitle
  const name = oCategory?.oSeries?.sSrtTitle
  const year = dateCheck(oCategory?.oSeries?.dStartDate)?.getFullYear()
  if (tab === 'news') return t('SeriesDescription.News', { name, year: isIpl ? 2023 : year, fullName })
  if (tab === 'videos') return t('SeriesDescription.Videos', { name, year: isIpl ? 2023 : year })
  if (tab === 'fixtures') return t('SeriesDescription.Fixtures', { name, year: isIpl ? 2023 : year })
  if (tab === 'standings') return t('SeriesDescription.Standings', { name, year: isIpl ? 2023 : year })
  if (tab === 'stats') return t('SeriesDescription.Stats', { name, year: isIpl ? 2023 : year })
  if (tab === 'teams') return t('SeriesDescription.Teams', { name, year: isIpl ? 2023 : year })
  if (tab === 'squads') return t('SeriesDescription.Squads', { name, year, fullName })
  if (tab === 'archives') return t('SeriesDescription.Archives', { name, year, fullName })
  if (tab === 'fantasy-tips') return t('SeriesDescription.FantasyTips', { name, year: isIpl ? 2023 : year })
  else return oSeo?.sDescription || t('SeriesDescription.Home', { name, year })
}

const makeStatDescription = (oCategory, tab, t, statSlug, isIpl) => {
  const name = oCategory?.oSeries?.sSrtTitle
  const year = isIpl ? 2023 : dateCheck(oCategory?.oSeries?.dStartDate)?.getFullYear()
  if (statSlug === 'batting-most-runs') return t('StatDescription.MostRuns', { name, year })
  if (statSlug === 'batting-most-runs-innings') return t('StatDescription.HighestIndividualScore', { name, year })
  if (statSlug === 'batting-highest-strikerate') return t('StatDescription.BattingHighestRates', { name, year })
  if (statSlug === 'batting-highest-strikerate-innings') return t('StatDescription.BattingHighestRatesInnings', { name, year })
  if (statSlug === 'batting-highest-average') return t('StatDescription.BattingHighestAverage', { name, year })
  if (statSlug === 'batting-most-centuries') return t('StatDescription.BattingMostCenturies', { name, year })
  if (statSlug === 'batting-most-run50') return t('StatDescription.BattingMostFifties', { name, year })
  if (statSlug === 'batting-most-sixes') return t('StatDescription.BattingMostSixes', { name, year })
  if (statSlug === 'batting-most-fours') return t('StatDescription.BattingMostFours', { name, year })
  if (statSlug === 'batting-most-run4-innings') return t('StatDescription.BattingMostFoursInnings', { name, year })
  if (statSlug === 'bowling-top-wicket-takers') return t('StatDescription.BowlingTopWicketTakers', { name, year })
  if (statSlug === 'bowling-best-economy-rates') return t('StatDescription.BowlingBestEconomyRates', { name, year })
  if (statSlug === 'bowling-best-economy-rates-innings') return t('StatDescription.BowlingBestEconomyRatesInnings', { name, year })
  if (statSlug === 'bowling-best-bowling-figures') return t('StatDescription.BowlingBestBowlingFigures', { name, year })
  if (statSlug === 'bowling-best-strike-rates') return t('StatDescription.BowlingBestStrikeRates', { name, year })
  if (statSlug === 'bowling-best-strike-rates-innings') return t('StatDescription.BowlingBestStrikeRatesInnings', { name, year })
  if (statSlug === 'bowling-best-averages') return t('StatDescription.BowlingBestAverage', { name, year })
  if (statSlug === 'bowling-most-runs-conceded-innings') return t('StatDescription.BowlingMostRunsConcededInnings', { name, year })
  if (statSlug === 'bowling-four-wickets') return t('StatDescription.BowlingFourWickets', { name, year })
  if (statSlug === 'bowling-five-wickets') return t('StatDescription.BowlingFiveWickets', { name, year })
  if (statSlug === 'bowling-maidens') return t('StatDescription.BowlingMaidens', { name, year })
  if (statSlug === 'team-total-runs') return t('StatDescription.TeamTotalRuns', { name, year })
  if (statSlug === 'team-total-run100') return t('StatDescription.TeamMostCenturies', { name, year })
  if (statSlug === 'team-total-wickets') return t('StatDescription.TeamTotalWickets', { name, year })
  if (statSlug === 'batting-most-fifties') return t('StatDescription.TeamMostFifties', { name, year })
}

const getRobots = (oSeo, oCategory, tab) => {
  // if (tab === 'news') return 'Noindex, Follow'
  // else return oSeo?.sRobots
  return oSeo?.sRobots
}
