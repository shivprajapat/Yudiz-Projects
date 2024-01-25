const axios = require('axios')

const { SEO_REST_URL } = require('../../../config')
const builder = {}

const seriesSeos = [
  's',
  'st',
  't',
  'sq',
  'ft',
  'stBhsi',
  'stBha',
  'stBhs',
  'stBmc',
  'stBmr6i',
  'stBm4',
  'stBmr4i',
  'stBmr',
  'stBmri',
  'stBmr50',
  'stBms',
  'stBtwt',
  'stBberi',
  'stBba',
  'stBber',
  'stBbsr',
  'stBbsri',
  'stBfiw',
  'stBbbf',
  'stBmrci',
  'stBfow',
  'stBm',
  'stTtr',
  'stTtr100',
  'stTtw',
  'stBmf'
]

const categorySeos = [
  'n',
  'v',
  'f',
  's',
  'st',
  't',
  'sq',
  'ar',
  'ft',
  'stBhsi',
  'stBha',
  'stBhs',
  'stBmc',
  'stBmr6i',
  'stBm4',
  'stBmr4i',
  'stBmr',
  'stBmri',
  'stBmr50',
  'stBms',
  'stBtwt',
  'stBberi',
  'stBba',
  'stBber',
  'stBbsr',
  'stBbsri',
  'stBfiw',
  'stBbbf',
  'stBmrci',
  'stBfow',
  'stBm',
  'stTtr',
  'stTtr100',
  'stTtw',
  'stBmf'
]

const matchSeos = [
  'n',
  'sc',
  'o',
  'u',
  'r',
  'far',
  's'
]

builder.matchSeoBuilder = async (newMatch, teamData1, teamData2, sMatchInfo, seriesDetail) => {
  const matchSeoArr = []

  const seoParams = {
    iId: newMatch._id.toString(),
    eType: 'ma',
    iSeriesId: seriesDetail?.iCategoryId ?? seriesDetail?._id
  }

  if (matchSeos.includes('sc')) {
    const intSeoParams = {
      ...seoParams,
      eSubType: 'sc',
      sTitle: `${teamData1.sTitle} vs ${teamData2.sTitle} ${sMatchInfo} ${new Date(newMatch.dStartDate).getFullYear()} Full Scorecard & Updates`,
      sDescription: `${teamData1.sAbbr} vs ${teamData2.sAbbr} ${sMatchInfo} ${new Date(newMatch.dStartDate).getFullYear()} Full Scorecard: Get the live & detailed ${teamData1.sAbbr} vs ${teamData2.sAbbr} ${sMatchInfo} ${new Date(newMatch.dStartDate).getFullYear()} scorecard, players score & fall of wickets information on CricTracker.`,
      sSlug: 'full-scorecard',
      sCUrl: 'full-scorecard'
    }

    // queuePush('addSeoData', seoParams)
    matchSeoArr.push(intSeoParams)
  }

  if (matchSeos.includes('o')) {
    const intSeoParams = {
      ...seoParams,
      eSubType: 'o',
      sTitle: `${teamData1.sAbbr} vs ${teamData2.sAbbr} Overs | ${teamData1.sTitle} vs ${teamData2.sTitle} Full over & Ball by Ball updates`,
      sDescription: `${teamData1.sAbbr} vs ${teamData2.sAbbr} Overs: Get the detailed ${teamData1.sAbbr} vs $${teamData2.sAbbr} ${sMatchInfo} Live Over updates, Ball  by Ball, & Match updates only on CricTracker.`,
      sSlug: 'overs',
      sCUrl: 'overs'
    }
    // queuePush('addSeoData', seoParams)
    matchSeoArr.push(intSeoParams)
  }

  if (matchSeos.includes('n')) {
    const intSeoParams = {
      ...seoParams,
      eSubType: 'n',
      sTitle: `${teamData1.sAbbr} vs ${teamData2.sAbbr} ${new Date(seriesDetail.dStartDate).getFullYear()} Latest news | Live Match Updates, Match previews, Predictions & Match results.`,
      sDescription: `${teamData1.sAbbr} vs ${teamData2.sAbbr} ${new Date(seriesDetail.dStartDate).getFullYear()}: Check out the ${teamData1.sAbbr} vs ${teamData2.sAbbr} Latest news, Injury updates, fantasy tips, Match predictions & More on CricTracker.`,
      sSlug: 'news',
      sCUrl: 'news',
      sRobots: 'follow, no index'
    }
    // queuePush('addSeoData', seoParams)
    matchSeoArr.push(intSeoParams)
  }

  if (matchSeos.includes('u')) {
    const intSeoParams = {
      ...seoParams,
      eSubType: 'u',
      sTitle: `${teamData1.sAbbr} vs ${teamData2.sAbbr} ${new Date(seriesDetail.dStartDate).getFullYear()} Schedule | Fixtures, Upcoming schedule & Match Details.`,
      sDescription: `${teamData1.sAbbr} vs ${teamData2.sAbbr} ${new Date(seriesDetail.dStartDate).getFullYear()}: Check out the ${teamData1.sAbbr} vs ${teamData2.sAbbr} Latest schedule, Fixtures, Teams, Date, Timings, Upcoming schedule & more on CricTracker.`,
      sSlug: 'fixtures-and-results',
      sCUrl: 'fixtures-and-results'
    }
    // queuePush('addSeoData', seoParams)
    matchSeoArr.push(intSeoParams)
  }

  if (matchSeos.includes('r')) {
    const intSeoParams = {
      ...seoParams,
      eSubType: 'r',
      sTitle: `${seriesDetail.sSrtTitle ?? seriesDetail.sTitle} ${new Date(seriesDetail.dStartDate).getFullYear()} Results After ${sMatchInfo} | ${seriesDetail.sSrtTitle ?? seriesDetail.sTitle} Match Results.`,
      sDescription: `${seriesDetail.sSrtTitle ?? seriesDetail.sTitle} ${new Date(seriesDetail.dStartDate).getFullYear()} Results: Check out the latest ${seriesDetail.sSrtTitle ?? seriesDetail.sTitle} ${new Date(seriesDetail.dStartDate).getFullYear()} match results After ${sMatchInfo} with scorecard, stats and other match details on CricTracker.`,
      sSlug: 'results',
      sCUrl: 'results'
    }

    // queuePush('addSeoData', seoParams)
    matchSeoArr.push(intSeoParams)
  }

  if (matchSeos.includes('far')) {
    const intSeoParams = {
      ...seoParams,
      eSubType: 'far',
      sTitle: `${teamData1.sAbbr} vs ${teamData2.sAbbr} ${new Date(seriesDetail.dStartDate).getFullYear()} ${sMatchInfo} Fantasy Tips Prediction.`,
      sDescription: `${teamData1.sAbbr} vs ${teamData2.sAbbr} ${new Date(seriesDetail.dStartDate).getFullYear()} Fantasy Tips: Find out the best XI for the major cricket matches daily as Fantasy Cricket Tips & Probable XI for Dream11 Prediction on CricTracker.`,
      sSlug: 'fantasy-tips',
      sCUrl: 'fantasy-tips',
      sRobots: 'follow, no index'
    }
    // queuePush('addSeoData', seoParams)
    matchSeoArr.push(intSeoParams)
  }
  if (matchSeoArr.length) axios.post(`${SEO_REST_URL}api/add-seos-data`, { seos: matchSeoArr }, { headers: { 'Content-Type': 'application/json' } })
}

builder.seriesSeoBuilder = async (seoParams, series) => {
  const seriesSeoArr = []
  if (seriesSeos.length) {
    if (seriesSeos.includes('n')) {
      const intSeoParams = {
        ...seoParams,
        eSubType: 'n',
        sTitle: `${series.sAbbr.toUpperCase()} News | ${series.sTitle} ${new Date(series.dStartDate).getFullYear()} Latest News & Updates.`,
        sDescription: `${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()}: Check out the ${series.sTitle} Latest news, Live updates, Match previews, Post match analysis & more on CricTracker.`,
        sSlug: 'news',
        sCUrl: 'news'
      }

      // queuePush('addSeoData', seoParams)
      seriesSeoArr.push(intSeoParams)
    }

    if (seriesSeos.includes('v')) {
      const intSeoParams = {
        ...seoParams,
        eSubType: 'v',
        sTitle: `${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} | Latest Videos, Match Highlights, Pre & Post match Analysis.`,
        sDescription: `${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()}: Get all the ${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} latest videos, Breaking news, Match Highlights, Analysis, Trending videos and more on CricTracker.`,
        sSlug: 'videos',
        sCUrl: 'videos'
      }

      // queuePush('addSeoData', seoParams)
      seriesSeoArr.push(intSeoParams)
    }

    if (seriesSeos.includes('p')) {
      const intSeoParams = {
        ...seoParams,
        sTitle: `${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} Photo Gallery, Images, News & Pictures.`,
        sDescription: `${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()}: Here's the latest pictures of ${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} Get the best photos of ${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} Cricket series during practice sessions, live matches, & more on CricTracker`,
        sSlug: 'photos',
        sCUrl: 'photos'
      }

      // queuePush('addSeoData', seoParams)
      seriesSeoArr.push(intSeoParams)
    }

    if (seriesSeos.includes('f')) {
      const intSeoParams = {
        ...seoParams,
        eSubType: 'f',
        sTitle: `${series.sAbbr.toUpperCase()} Schedule ${new Date(series.dStartDate).getFullYear()} | ${series.sAbbr.toUpperCase()} Fixtures, Time Table, Timings & Venue.`,
        sDescription: `${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()}: Fixtures: Check out the latest ${series.sAbbr.toUpperCase()} schedule  ${new Date(series.dStartDate).getFullYear()} with updated timings, Date, Time table, Teams, venue, & match details on CricTracker.`,
        sSlug: 'fixtures',
        sCUrl: 'fixtures'
      }

      // queuePush('addSeoData', seoParams)
      seriesSeoArr.push(intSeoParams)
    }

    if (seriesSeos.includes('r')) {
      const intSeoParams = {
        ...seoParams,
        eSubType: 'r',
        sTitle: `${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} Results | ${series.sAbbr.toUpperCase()} Match Results.`,
        sDescription: `${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} Results: Check out the latest ${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} match results with scorecard, stats and other match details on CricTracker.`,
        sSlug: 'results',
        sCUrl: 'results'
      }

      // queuePush('addSeoData', seoParams)
      seriesSeoArr.push(intSeoParams)
    }

    if (seriesSeos.includes('s') && series?.nTotalTeams > 2) {
      const intSeoParams = {
        ...seoParams,
        eSubType: 's',
        sTitle: `${series.sAbbr.toUpperCase()} Points Table ${new Date(series.dStartDate).getFullYear()} | ${series.sAbbr.toUpperCase()} Standings & Team Rankings.`,
        sDescription: `${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} Points Table - Check out the latest ${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} points table with team rankings, points, matches won, net run rate, wins, & updated team standings on CricTracker.`,
        sSlug: 'standings',
        sCUrl: 'standings'
      }

      // queuePush('addSeoData', seoParams)
      seriesSeoArr.push(intSeoParams)
    }

    if (seriesSeos.includes('st')) {
      const intSeoParams = {
        ...seoParams,
        eSubType: 'st',
        sTitle: `${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats',
        sCUrl: 'stats'
      }

      // queuePush('addSeoData', seoParams)
      seriesSeoArr.push(intSeoParams)
    }

    if (seriesSeos.includes('t')) {
      const intSeoParams = {
        ...seoParams,
        eSubType: 't',
        sTitle: `${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} | Teams, News, Squads, Playing XI`,
        sDescription: `Check out the ${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} Latest Teams, Squads, Playing XI. Get the latest updates and news of ${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} only on CricTracker.`,
        sSlug: 'teams',
        sCUrl: 'teams'
      }

      // queuePush('addSeoData', seoParams)
      seriesSeoArr.push(intSeoParams)
    }

    if (seriesSeos.includes('sq')) {
      const intSeoParams = {
        ...seoParams,
        eSubType: 'sq',
        sTitle: `${series.sTitle} ${new Date(series.dStartDate).getFullYear()} | Squads and Full Players List of all Team`,
        sDescription: `${series.sTitle} Teams List and Squads: Check out the list of all teams that will compete in the ${series.sTitle} ${new Date(series.dStartDate).getFullYear()}. Here's the full squad list of each team, including reserves and substitutes.`,
        sSlug: 'squads',
        sCUrl: 'squads'
      }

      // queuePush('addSeoData', seoParams)
      seriesSeoArr.push(intSeoParams)
    }

    if (seriesSeos.includes('ar')) {
      const intSeoParams = {
        ...seoParams,
        eSubType: 'ar',
        sTitle: `${series.sAbbr.toUpperCase()} Archives`,
        sDescription: `${series.sAbbr.toUpperCase()} Archives: Read about all the ${series.sTitle} Records, Results, Archives, Stats & more on CricTracker.`,
        sSlug: 'archives',
        sCUrl: 'archives'
      }

      // queuePush('addSeoData', seoParams)
      seriesSeoArr.push(intSeoParams)
    }

    if (seriesSeos.includes('ft')) {
      const intSeoParams = {
        ...seoParams,
        eSubType: 'ft',
        sTitle: `${series.sAbbr.toUpperCase()} Fantasy ${new Date(series.dStartDate).getFullYear()} | ${series.sAbbr.toUpperCase()} Fantasy League Tips.`,
        sDescription: 'How to win fantasy cricket games big? Find out the best XI for the major cricket matches daily as Fantasy Cricket Tips & Probable XI for Dream11 Prediction.',
        sSlug: 'fantasy-tips',
        sCUrl: 'fantasy-tips'
      }

      // queuePush('addSeoData', seoParams)
      seriesSeoArr.push(intSeoParams)
    }

    if (seriesSeos.includes('stBhsi')) {
      const intSeoParams = {
        ...seoParams,
        eSubType: 'stBhsi',
        sTitle: `${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/batting-highest-strikerate-innings',
        sCUrl: 'stats/batting-highest-strikerate-innings'
      }

      // queuePush('addSeoData', seoParams)
      seriesSeoArr.push(intSeoParams)
    }

    if (seriesSeos.includes('stBha')) {
      const intSeoParams = {
        ...seoParams,
        eSubType: 'stBha',
        sTitle: `${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/batting-highest-average',
        sCUrl: 'stats/batting-highest-average'
      }

      // queuePush('addSeoData', seoParams)
      seriesSeoArr.push(intSeoParams)
    }

    if (seriesSeos.includes('stBhs')) {
      const intSeoParams = {
        ...seoParams,
        eSubType: 'stBhs',
        sTitle: `${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/batting-highest-strikerate',
        sCUrl: 'stats/batting-highest-strikerate'
      }

      // queuePush('addSeoData', seoParams)
      seriesSeoArr.push(intSeoParams)
    }

    if (seriesSeos.includes('stBmc')) {
      const intSeoParams = {
        ...seoParams,
        eSubType: 'stBmc',
        sTitle: `${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/batting-most-centuries',
        sCUrl: 'stats/batting-most-centuries'
      }

      // queuePush('addSeoData', seoParams)
      seriesSeoArr.push(intSeoParams)
    }

    if (seriesSeos.includes('stBmr6i')) {
      const intSeoParams = {
        ...seoParams,
        eSubType: 'stBmr6i',
        sTitle: `${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/batting-most-run6-innings',
        sCUrl: 'stats/batting-most-run6-innings'
      }

      // queuePush('addSeoData', seoParams)
      seriesSeoArr.push(intSeoParams)
    }

    if (seriesSeos.includes('stBm4')) {
      const intSeoParams = {
        ...seoParams,
        eSubType: 'stBm4',
        sTitle: `${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/batting-most-fours',
        sCUrl: 'stats/batting-most-fours'
      }

      // queuePush('addSeoData', seoParams)
      seriesSeoArr.push(intSeoParams)
    }

    if (seriesSeos.includes('stBmr4i')) {
      const intSeoParams = {
        ...seoParams,
        eSubType: 'stBmr4i',
        sTitle: `${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/batting-most-run4-innings',
        sCUrl: 'stats/batting-most-run4-innings'
      }

      // queuePush('addSeoData', seoParams)
      seriesSeoArr.push(intSeoParams)
    }

    if (seriesSeos.includes('stBmr')) {
      const intSeoParams = {
        ...seoParams,
        eSubType: 'stBmr',
        sTitle: `${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/batting-most-runs',
        sCUrl: 'stats/batting-most-runs'
      }

      // queuePush('addSeoData', seoParams)
      seriesSeoArr.push(intSeoParams)
    }

    if (seriesSeos.includes('stBmri')) {
      const intSeoParams = {
        ...seoParams,
        eSubType: 'stBmri',
        sTitle: `${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/batting-most-runs-innings',
        sCUrl: 'stats/batting-most-runs-innings'
      }

      // queuePush('addSeoData', seoParams)
      seriesSeoArr.push(intSeoParams)
    }

    if (seriesSeos.includes('stBmr50')) {
      const intSeoParams = {
        ...seoParams,
        eSubType: 'stBmr50',
        sTitle: `${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/batting-most-run50',
        sCUrl: 'stats/batting-most-run50'
      }

      // queuePush('addSeoData', seoParams)
      seriesSeoArr.push(intSeoParams)
    }

    if (seriesSeos.includes('stBms')) {
      const intSeoParams = {
        ...seoParams,
        eSubType: 'stBms',
        sTitle: `${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/batting-most-sixes',
        sCUrl: 'stats/batting-most-sixes'
      }

      // queuePush('addSeoData', seoParams)
      seriesSeoArr.push(intSeoParams)
    }

    if (seriesSeos.includes('stBtwt')) {
      const intSeoParams = {
        ...seoParams,
        eSubType: 'stBtwt',
        sTitle: `${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/bowling-top-wicket-takers',
        sCUrl: 'stats/bowling-top-wicket-takers'
      }
      // queuePush('addSeoData', seoParams)
      seriesSeoArr.push(intSeoParams)
    }

    if (seriesSeos.includes('stBtwt')) {
      const intSeoParams = {
        ...seoParams,
        eSubType: 'stBtwt',
        sTitle: `${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/bowling-top-wicket-takers',
        sCUrl: 'stats/bowling-top-wicket-takers'
      }
      // queuePush('addSeoData', seoParams)
      seriesSeoArr.push(intSeoParams)
    }

    if (seriesSeos.includes('stBba')) {
      const intSeoParams = {
        ...seoParams,
        eSubType: 'stBba',
        sTitle: `${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/bowling-best-averages',
        sCUrl: 'stats/bowling-best-averages'
      }
      // queuePush('addSeoData', seoParams)
      seriesSeoArr.push(intSeoParams)
    }

    if (seriesSeos.includes('stBber')) {
      const intSeoParams = {
        ...seoParams,
        eSubType: 'stBber',
        sTitle: `${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/bowling-best-economy-rates',
        sCUrl: 'stats/bowling-best-economy-rates'
      }
      // queuePush('addSeoData', seoParams)
      seriesSeoArr.push(intSeoParams)
    }

    if (seriesSeos.includes('stBberi')) {
      const intSeoParams = {
        ...seoParams,
        eSubType: 'stBberi',
        sTitle: `${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/bowling-best-economy-rates-innings',
        sCUrl: 'stats/bowling-best-economy-rates-innings'
      }
      // queuePush('addSeoData', seoParams)
      seriesSeoArr.push(intSeoParams)
    }

    if (seriesSeos.includes('stBbsr')) {
      const intSeoParams = {
        ...seoParams,
        eSubType: 'stBbsr',
        sTitle: `${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/bowling-best-strike-rates',
        sCUrl: 'stats/bowling-best-strike-rates'
      }
      // queuePush('addSeoData', seoParams)
      seriesSeoArr.push(intSeoParams)
    }

    if (seriesSeos.includes('stBbsri')) {
      const intSeoParams = {
        ...seoParams,
        eSubType: 'stBbsri',
        sTitle: `${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/bowling-best-strike-rates-innings',
        sCUrl: 'stats/bowling-best-strike-rates-innings'
      }
      // queuePush('addSeoData', seoParams)
      seriesSeoArr.push(intSeoParams)
    }

    if (seriesSeos.includes('stBfiw')) {
      const intSeoParams = {
        ...seoParams,
        eSubType: 'stBfiw',
        sTitle: `${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/bowling-five-wickets',
        sCUrl: 'stats/bowling-five-wickets'
      }
      // queuePush('addSeoData', seoParams)
      seriesSeoArr.push(intSeoParams)
    }

    if (seriesSeos.includes('stBbbf')) {
      const intSeoParams = {
        ...seoParams,
        eSubType: 'stBbbf',
        sTitle: `${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/bowling-best-bowling-figures',
        sCUrl: 'stats/bowling-best-bowling-figures'
      }

      // queuePush('addSeoData', seoParams)
      seriesSeoArr.push(intSeoParams)
    }

    if (seriesSeos.includes('stBmrci')) {
      const intSeoParams = {
        ...seoParams,
        eSubType: 'stBmrci',
        sTitle: `${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/bowling-most-runs-conceded-innings',
        sCUrl: 'stats/bowling-most-runs-conceded-innings'
      }
      // queuePush('addSeoData', seoParams)
      seriesSeoArr.push(intSeoParams)
    }

    if (seriesSeos.includes('stBfow')) {
      const intSeoParams = {
        ...seoParams,
        eSubType: 'stBfow',
        sTitle: `${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/bowling-four-wickets',
        sCUrl: 'stats/bowling-four-wickets'
      }
      // queuePush('addSeoData', seoParams)
      seriesSeoArr.push(intSeoParams)
    }

    if (seriesSeos.includes('stBm')) {
      const intSeoParams = {
        ...seoParams,
        eSubType: 'stBm',
        sTitle: `${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/bowling-maidens',
        sCUrl: 'stats/bowling-maidens'
      }
      // queuePush('addSeoData', seoParams)
      seriesSeoArr.push(intSeoParams)
    }

    if (seriesSeos.includes('stTtr')) {
      const intSeoParams = {
        ...seoParams,
        eSubType: 'stTtr',
        sTitle: `${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/team-total-runs',
        sCUrl: 'stats/team-total-runs'
      }
      // queuePush('addSeoData', seoParams)
      seriesSeoArr.push(intSeoParams)
    }

    if (seriesSeos.includes('stTtr100')) {
      const intSeoParams = {
        ...seoParams,
        eSubType: 'stTtr100',
        sTitle: `${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/team-total-run100',
        sCUrl: 'stats/team-total-run100'
      }
      // queuePush('addSeoData', seoParams)
      seriesSeoArr.push(intSeoParams)
    }

    if (seriesSeos.includes('stTtw')) {
      const intSeoParams = {
        ...seoParams,
        eSubType: 'stTtw',
        sTitle: `${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/team-total-wickets',
        sCUrl: 'stats/team-total-wickets'
      }
      // queuePush('addSeoData', seoParams)
      seriesSeoArr.push(intSeoParams)
    }

    if (seriesSeos.includes('stBmf')) {
      const intSeoParams = {
        ...seoParams,
        eSubType: 'stBmf',
        sTitle: `${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} | All Stats`,
        sDescription: `${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} Stats: Get all the live stats of ${series.sAbbr.toUpperCase()} ${new Date(series.dStartDate).getFullYear()} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`,
        sSlug: 'stats/batting-most-fifties',
        sCUrl: 'stats/batting-most-fifties'
      }
      // queuePush('addSeoData', seoParams)
      seriesSeoArr.push(intSeoParams)
    }
    if (seriesSeoArr.length) axios.post(`${SEO_REST_URL}api/add-seos-data`, { seos: seriesSeoArr }, { headers: { 'Content-Type': 'application/json' } })
  }
}

const seriesYear = (prefix, year) => prefix.includes(year.toString()) ? '' : year

builder.categorySeoBuilder = async (series, category) => {
  try {
    const seoArr = []
    if (categorySeos.length) {
      if (categorySeos.includes('n')) {
        const seoParams = {
          iId: category._id,
          eType: 'ct'
        }
        // "News": "{{name}} News | {{fullName}} {{year}} Latest News & Updates",
        // "News": "{{name}} {{year}}: Check out the {{fullName}} Latest news, Live updates, Match previews, Post match analysis & more on CricTracker",
        Object.assign(seoParams, {
          eSubType: 'n',
          sTitle: `${series?.sSrtTitle ?? category?.sName} News | ${series?.sTitle} ${seriesYear(series?.sTitle, new Date(series.dStartDate).getFullYear())} Latest News & Updates`.replaceAll('  ', ' ').replaceAll(' :', ':'),
          sDescription: `${series?.sSrtTitle ?? category?.sName} ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())}: Check out the ${series?.sTitle} Latest news, Live updates, Match previews, Post match analysis & more on CricTracker.`.replaceAll('  ', ' ').replaceAll(' :', ':'),
          sSlug: 'news',
          sCUrl: 'news',
          sDTitle: `${category?.sName} News`
        })
        // queuePush('addSeoData', seoParams)
        seoArr.push(seoParams)
      }

      if (categorySeos.includes('v')) {
        const seoParams = {
          iId: category._id,
          eType: 'ct'
        }
        //   "Videos": "{{name}} Videos {{year}} Latest Videos, Match Highlights, Pre & Post match Analysis",
        //   "Videos": "{{name}} {{year}}: Get all the {{name}} {{year}} latest videos, Breaking news, Match Highlights, Analysis, Trending videos and more on CricTracker",
        Object.assign(seoParams, {
          eSubType: 'v',
          sTitle: `${series?.sSrtTitle ?? category?.sName} Videos | ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())} | Latest Videos, Match Highlights, Pre & Post match Analysis.`.replaceAll('  ', ' ').replaceAll(' :', ':'),
          sDescription: `${series?.sSrtTitle ?? category?.sName} ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())}: Get all the ${series?.sSrtTitle ?? category?.sName} ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())} latest videos, Breaking news, Match Highlights, Analysis, Trending videos and more on CricTracker.`.replaceAll('  ', ' ').replaceAll(' :', ':'),
          sSlug: 'videos',
          sCUrl: 'videos',
          sDTitle: `${category?.sName} Videos`
        })
        // queuePush('addSeoData', seoParams)
        seoArr.push(seoParams)
      }

      if (categorySeos.includes('p')) {
        const seoParams = {
          iId: category._id,
          eType: 'ct'
        }
        Object.assign(seoParams, {
          eSubType: 'p',
          sTitle: `${series?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} Photo Gallery, Images, News & Pictures.`.replaceAll('  ', ' ').replaceAll(' :', ':'),
          sDescription: `${series?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()}: Here's the latest pictures of ${series?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()}. Get the best photos of ${series?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} Cricket series during practice sessions, live matches, & more on CricTracker.`.replaceAll('  ', ' ').replaceAll(' :', ':'),
          sSlug: 'photos',
          sCUrl: 'photos',
          sDTitle: `${category?.sName} Photos`
        })
        // queuePush('addSeoData', seoParams)
        seoArr.push(seoParams)
      }

      if (categorySeos.includes('f')) {
        const seoParams = {
          iId: category._id,
          eType: 'ct'
        }
        //   "Fixtures": "{{name}} Schedule {{year}} | {{name}} Fixtures, Time Table, Timings & Venue ",
        //   "Fixtures": "{{name}} {{year}}  Fixtures: Check out the latest {{name}}  schedule {{year}} with updated timings, Date, Time table, Teams, venue, & match details on CricTracker"
        Object.assign(seoParams, {
          eSubType: 'f',
          sTitle: `${series?.sSrtTitle ?? category?.sName} Schedule ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())} | ${series?.sSrtTitle ?? category?.sName} Fixtures, Time Table, Timings & Venue.`.replaceAll('  ', ' ').replaceAll(' :', ':'),
          sDescription: `${series?.sSrtTitle ?? category?.sName} ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())} Fixtures: Check out the latest ${series?.sSrtTitle ?? category?.sName} schedule ${seriesYear(series?.sTitle, new Date(series.dStartDate).getFullYear())} with updated timings, Date, Time table, Teams, venue, & match details on CricTracker.`.replaceAll('  ', ' ').replaceAll(' :', ':'),
          sSlug: 'fixtures',
          sCUrl: 'fixtures',
          sDTitle: `${category?.sName} Schedule`
        })
        // queuePush('addSeoData', seoParams)
        seoArr.push(seoParams)
      }

      if (categorySeos.includes('r')) {
        const seoParams = {
          iId: category._id,
          eType: 'ct'
        }
        Object.assign(seoParams, {
          eSubType: 'r',
          sTitle: `${series?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} Results | ${series?.sSrtTitle ?? series.sAbbr} Match Results.`.replaceAll('  ', ' ').replaceAll(' :', ':'),
          sDescription: `${series?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} Results: Check out the latest ${series?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()} match results with scorecard, stats and other match details on CricTracker.`.replaceAll('  ', ' ').replaceAll(' :', ':'),
          sSlug: 'results',
          sCUrl: 'results',
          sDTitle: `${category?.sName} Results`
        })
        // queuePush('addSeoData', seoParams)
        seoArr.push(seoParams)
      }

      if (categorySeos.includes('s') && series?.nTotalTeams > 2) {
        const seoParams = {
          iId: category._id,
          eType: 'ct'
        }
        //   "Standings": "{{name}} Points Table {{year}} | {{name}} Standings & Team Rankings",
        //   "Standings": "{{name}} {{year}} Points Table - Check out the latest {{name}} {{year}} points table with team rankings, points, matches won, net run rate, wins, & updated team standings on CricTracker."
        Object.assign(seoParams, {
          eSubType: 's',
          sTitle: `${series?.sSrtTitle ?? category?.sName} Points Table ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())} | ${series?.sSrtTitle ?? category?.sName} Standings & Team Rankings.`.replaceAll('  ', ' ').replaceAll(' :', ':'),
          sDescription: `${series?.sSrtTitle ?? category?.sName} ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())} Points Table - Check out the latest ${series?.sSrtTitle ?? category?.sName} ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())} points table with team  rankings, points, matches won, net run rate, wins, & updated team standings on CricTracker.`.replaceAll('  ', ' ').replaceAll(' :', ':'),
          sSlug: 'standings',
          sCUrl: 'standings',
          sDTitle: `${category?.sName} Standings`
        })
        // queuePush('addSeoData', seoParams)
        seoArr.push(seoParams)
      }

      if (categorySeos.includes('st')) {
        const seoParams = {
          iId: category._id,
          eType: 'ct'
        }
        //   "Stats": "{{name}} {{year}} All Stats ",
        //   "Stats": "{{name}} {{year}}  Stats : Get all the live stats of {{name}} {{year}} including Most fifties, hundreds, catches, highest averages & more on CricTracker",
        Object.assign(seoParams, {
          eSubType: 'st',
          sTitle: `${series?.sSrtTitle ?? category?.sName} ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())} | All Stats`.replaceAll('  ', ' ').replaceAll(' :', ':'),
          sDescription: `${series?.sSrtTitle ?? category?.sName} ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())} Stats: Get all the live stats of ${series?.sSrtTitle ?? category?.sName} ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())} including Most fifties, hundreds, catches, highest averages & more on CricTracker.`.replaceAll('  ', ' ').replaceAll(' :', ':'),
          sSlug: 'stats',
          sCUrl: 'stats',
          sDTitle: `${category?.sName} Stats`
        })

        // queuePush('addSeoData', seoParams)
        seoArr.push(seoParams)
      }

      if (categorySeos.includes('t') && series?.nTotalTeams > 2) {
        const seoParams = {
          iId: category._id,
          eType: 'ct'
        }
        //   "Teams": "{{name}} {{year}} Teams, News, Squads, Playing XI",
        //   "Teams": "Check out the {{name}} {{year}} Latest Teams, Squads, Playing XI. Get the latest updates and news of {{name}} {{year}} only on CricTracker",
        Object.assign(seoParams, {
          eSubType: 't',
          sTitle: `${series?.sSrtTitle ?? category?.sName} ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())} | Teams, News, Squads, Playing XI`.replaceAll('  ', ' ').replaceAll(' :', ':'),
          sDescription: `Check out the ${series?.sSrtTitle ?? category?.sName} ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())} Latest Teams, Squads, Playing XI. Get the latest updates and news of ${series?.sSrtTitle ?? category?.sName} ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())} only on CricTracker.`.replaceAll('  ', ' ').replaceAll(' :', ':'),
          sSlug: 'teams',
          sCUrl: 'teams',
          sDTitle: `${category?.sName} Teams`
        })

        // queuePush('addSeoData', seoParams)
        seoArr.push(seoParams)
      }

      if (categorySeos.includes('sq')) {
        const seoParams = {
          iId: category._id,
          eType: 'ct'
        }
        //   "Squads": "{{name}} {{year}} Squads and Full Players List of  all Team",
        //   "Squads": "{{fullName}} Teams List and Squads: Check out the list of all teams that will compete in the {{fullName}} {{year}}. Here's the full squad list of each team, including reserves and substitutes.",
        Object.assign(seoParams, {
          eSubType: 'sq',
          sTitle: `${series?.sSrtTitle ?? category?.sName} ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())} | Squads and Full Players List of  all Team`.replaceAll('  ', ' ').replaceAll(' :', ':'),
          sDescription: `${series?.sTitle} Teams List and Squads: Check out the list of all teams that will compete in the ${series?.sTitle} ${seriesYear(series?.sTitle, new Date(series.dStartDate).getFullYear())}. Here's the full squad list of each team, including reserves and substitutes.`.replaceAll('  ', ' ').replaceAll(' :', ':'),
          sSlug: 'squads',
          sCUrl: 'squads',
          sDTitle: `${category?.sName} Squads`
        })
        // queuePush('addSeoData', seoParams)
        seoArr.push(seoParams)
      }

      if (categorySeos.includes('ar')) {
        const seoParams = {
          iId: category._id,
          eType: 'ct'
        }
        //   "Archives": "{{name}} Archives",
        //   "Archives": "{{name}} Archives :Read about all the {{fullName}} Records, Results, Archives , Stats & more on CricTracker",
        Object.assign(seoParams, {
          eSubType: 'ar',
          sTitle: `${series?.sSrtTitle ?? category?.sName} Archives`.replaceAll('  ', ' ').replaceAll(' :', ':'),
          sDescription: `${series?.sSrtTitle ?? category?.sName} Archives: Read about all the ${series?.sTitle} Records, Results, Archives, Stats & more on CricTracker.`.replaceAll('  ', ' ').replaceAll(' :', ':'),
          sSlug: 'archives',
          sCUrl: 'archives',
          sDTitle: `${category?.sName} Archives`
        })

        // queuePush('addSeoData', seoParams)
        seoArr.push(seoParams)
      }

      if (categorySeos.includes('ft')) {
        const seoParams = {
          iId: category._id,
          eType: 'ct'
        }
        //   "FantasyTips": "{{name}} Fantasy {{year}} | {{name}} Fantasy League Tips"
        //   "FantasyTips": "How to win fantasy cricket games big? Find out the best XI for the major cricket matches daily as Fantasy Cricket Tips & Probable XI for Dream11 Prediction"
        Object.assign(seoParams, {
          eSubType: 'ft',
          sTitle: `${series?.sSrtTitle ?? category?.sName} Fantasy ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())} | ${series?.sSrtTitle ?? category?.sName} Fantasy League Tips.`.replaceAll('  ', ' ').replaceAll(' :', ':'),
          sDescription: 'How to win fantasy cricket games big? Find out the best XI for the major cricket matches daily as Fantasy Cricket Tips & Probable XI for Dream11 Prediction.'.replaceAll('  ', ' ').replaceAll(' :', ':'),
          sSlug: 'fantasy-tips',
          sCUrl: 'fantasy-tips',
          sDTitle: `${category?.sName} Fantasy Tips`
        })
        // queuePush('addSeoData', seoParams)
        seoArr.push(seoParams)
      }

      if (categorySeos.includes('stBhsi')) {
        const seoParams = {
          iId: category._id,
          eType: 'ct'
        }
        //   "BattingHighestRatesInnings": "Highest Strike Rates (Innings) in {{name}} {{year}}",
        //   "BattingHighestRatesInnings": "Highest Strike Rates {{year}} - Check out the list of the highest strike rates (Innings) in {{name}} with matches played, strike rate & more stats on CricTracker.",
        Object.assign(seoParams, {
          eSubType: 'stBhsi',
          sTitle: `Highest Strike Rates (Innings) in ${series?.sSrtTitle ?? category?.sName} ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())}`.replaceAll('  ', ' ').replaceAll(' :', ':'),
          sDescription: `Highest Strike Rates ${seriesYear('', new Date(series.dStartDate).getFullYear())} - Check out the list of the highest strike rates (Innings) in ${series?.sSrtTitle ?? category?.sName} with matches played, strike rate & more stats on CricTracker.`.replaceAll('  ', ' ').replaceAll(' :', ':'),
          sSlug: 'stats/batting-highest-strikerate-innings',
          sCUrl: 'stats/batting-highest-strikerate-innings',
          sDTitle: `${category?.sName} Stats`
        })

        // queuePush('addSeoData', seoParams)
        seoArr.push(seoParams)
      }

      if (categorySeos.includes('stBha')) {
        const seoParams = {
          iId: category._id,
          eType: 'ct'
        }
        //   "BattingHighestAverage": "Highest Average in {{name}} {{year}}",
        //   "BattingHighestAverage": "Check out the list of players with highest batting average, highest average and more along with matches played on CricTracker.",
        Object.assign(seoParams, {
          eSubType: 'stBha',
          sTitle: `Highest Average in ${series?.sSrtTitle ?? category?.sName} ${seriesYear(series?.sTitle, new Date(series.dStartDate).getFullYear())}`.replaceAll('  ', ' ').replaceAll(' :', ':'),
          sDescription: 'Check out the list of players with highest batting average, highest average and more along with matches played on CricTracker.'.replaceAll('  ', ' ').replaceAll(' :', ':'),
          sSlug: 'stats/batting-highest-average',
          sCUrl: 'stats/batting-highest-average',
          sDTitle: `${category?.sName} Stats`
        })

        // queuePush('addSeoData', seoParams)
        seoArr.push(seoParams)
      }

      if (categorySeos.includes('stBhs')) {
        const seoParams = {
          iId: category._id,
          eType: 'ct'
        }
        //   "BattingHighestRates": "Highest Strike Rates in {{name}} {{year}}",
        //   "BattingHighestRates": "{{name}} {{year}} Highest Strike Rates - Check out the list of the highest strike rates in {{name}} with matches played, strike rate & more stats on CricTracker.",
        Object.assign(seoParams, {
          eSubType: 'stBhs',
          sTitle: `Highest Strike Rates in ${series?.sSrtTitle ?? category?.sName} ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())}`.replaceAll('  ', ' ').replaceAll(' :', ':'),
          sDescription: `${series?.sSrtTitle ?? category?.sName} ${seriesYear(series?.sTitle, new Date(series.dStartDate).getFullYear())} Highest Strike Rates - Check out the list of the highest strike rates in ${series?.sSrtTitle ?? category?.sName} with matches played, strike rate & more stats on CricTracker.`.replaceAll('  ', ' ').replaceAll(' :', ':'),
          sSlug: 'stats/batting-highest-strikerate',
          sCUrl: 'stats/batting-highest-strikerate',
          sDTitle: `${category?.sName} Stats`
        })

        // queuePush('addSeoData', seoParams)
        seoArr.push(seoParams)
      }

      if (categorySeos.includes('stBmc')) {
        const seoParams = {
          iId: category._id,
          eType: 'ct'
        }
        //   "BattingMostCenturies": "{{name}} {{year}} | Players With Most Centuries in {{name}}",
        //   "BattingMostCenturies": "{{name}} {{year}}: Players List of Most Centuries in {{name}} Cricket, Check Highest Run Hundreds scorer in {{name}}, {{name}} records, & more stats on CricTracker.",
        Object.assign(seoParams, {
          eSubType: 'stBmc',
          sTitle: `${series?.sSrtTitle ?? category?.sName} ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())} | Players With Most Centuries in ${series?.sSrtTitle ?? category?.sName}`.replaceAll('  ', ' ').replaceAll(' :', ':'),
          sDescription: `${series?.sSrtTitle ?? category?.sName} ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())}: Players List of Most Centuries in ${series?.sSrtTitle ?? category?.sName} Cricket, Check Highest Run Hundreds scorer in ${series?.sSrtTitle ?? category?.sName}, ${series?.sSrtTitle ?? category?.sName} records, & more stats on CricTracker.`.replaceAll('  ', ' ').replaceAll(' :', ':'),
          sSlug: 'stats/batting-most-centuries',
          sCUrl: 'stats/batting-most-centuries',
          sDTitle: `${category?.sName} Stats`
        })

        // queuePush('addSeoData', seoParams)
        seoArr.push(seoParams)
      }

      if (categorySeos.includes('stBmr6i')) {
        const seoParams = {
          iId: category._id,
          eType: 'ct'
        }
        //   "BattingMostSizesInnings": "{{name}} {{year}} Most Four (innings) | Most Four (innings)  in {{name}} Players List",
        //   "BattingMostSizesInnings": "Most Four (innings) in {{name}} {{year}}: Get updated list of Most Four (innings) in {{name}} {{year}} for every match along with the players standings and stats & more only on CricTracker",
        Object.assign(seoParams, {
          eSubType: 'stBmr6i',
          sTitle: `${series?.sSrtTitle ?? category?.sName} ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())} Most Six (innings) | Most Six (innings) in ${series?.sSrtTitle ?? category?.sName} Players List`.replaceAll('  ', ' ').replaceAll(' :', ':'),
          sDescription: `Most Six (innings) in ${series?.sSrtTitle ?? category?.sName} ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())}: Get updated list of Most Six (innings) in ${series?.sSrtTitle ?? category?.sName} ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())} for every match along with the players standings and stats & more only on CricTracker`.replaceAll('  ', ' ').replaceAll(' :', ':'),
          sSlug: 'stats/batting-most-run6-innings',
          sCUrl: 'stats/batting-most-run6-innings',
          sDTitle: `${category?.sName} Stats`
        })

        // queuePush('addSeoData', seoParams)
        seoArr.push(seoParams)
      }

      if (categorySeos.includes('stBm4')) {
        const seoParams = {
          iId: category._id,
          eType: 'ct'
        }
        //   "BattingMostFours": "{{name}} {{year}} Most Four  | Most Four  in {{name}} Players List",
        //   "BattingMostFours": "Most Four in {{name}} {{year}}: Get updated list of most four in {{name}} {{year}} for every match along with the players standings and stats & more only on CricTracker",
        Object.assign(seoParams, {
          eSubType: 'stBm4',
          sTitle: `${series?.sSrtTitle ?? category?.sName} ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())} Most Four | Most Four in ${series?.sSrtTitle ?? category?.sName} Players List`.replaceAll('  ', ' ').replaceAll(' :', ':'),
          sDescription: `Most Four in ${series?.sSrtTitle ?? category?.sName} ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())}: Get updated list of most four in ${series?.sSrtTitle ?? category?.sName} ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())} for every match along with the players standings and stats & more only on CricTracker`.replaceAll('  ', ' ').replaceAll(' :', ':'),
          sSlug: 'stats/batting-most-fours',
          sCUrl: 'stats/batting-most-fours',
          sDTitle: `${category?.sName} Stats`
        })

        // queuePush('addSeoData', seoParams)
        seoArr.push(seoParams)
      }

      if (categorySeos.includes('stBmr4i')) {
        const seoParams = {
          iId: category._id,
          eType: 'ct'
        }
        //   "BattingMostFoursInnings": "{{name}} {{year}} Most Four (innings) | Most Four (innings)  in {{name}} Players List",
        //   "BattingMostFoursInnings": "Most Four (innings) in {{name}} {{year}}: Get updated list of Most Four (innings) in {{name}} {{year}} for every match along with the players standings and stats & more only on CricTracker",
        Object.assign(seoParams, {
          eSubType: 'stBmr4i',
          sTitle: `${series?.sSrtTitle ?? category?.sName} ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())} Most Four (innings) | Most Four (innings) in ${series?.sSrtTitle ?? category?.sName} Players List`.replaceAll('  ', ' ').replaceAll(' :', ':'),
          sDescription: `Most Four (innings) in ${series?.sSrtTitle ?? category?.sName} ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())}: Get updated list of Most Four (innings) in ${series?.sSrtTitle ?? category?.sName} ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())} for every match along with the players standings and stats & more only on CricTracker`.replaceAll('  ', ' ').replaceAll(' :', ':'),
          sSlug: 'stats/batting-most-run4-innings',
          sCUrl: 'stats/batting-most-run4-innings',
          sDTitle: `${category?.sName} Stats`
        })

        // queuePush('addSeoData', seoParams)
        seoArr.push(seoParams)
      }

      if (categorySeos.includes('stBmr')) {
        const seoParams = {
          iId: category._id,
          eType: 'ct'
        }
        //   "MostRuns": "Most Runs in {{name}} {{year}} | List of {{name}} {{year}} Most Runs",
        //   "MostRuns": "{{name}} {{year}} Most Runs: Check out the list of most runs in {{name}} with matches played, strike rate, average, & more stats on CricTracker.",
        Object.assign(seoParams, {
          eSubType: 'stBmr',
          sTitle: `Most Runs in ${series?.sSrtTitle ?? category?.sName} ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())} | List of ${series?.sSrtTitle ?? category?.sName} ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())} Most Runs`.replaceAll('  ', ' ').replaceAll(' :', ':'),
          sDescription: `${series?.sSrtTitle ?? category?.sName} ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())} Most Runs: Check out the list of most runs in ${series?.sSrtTitle ?? category?.sName} with matches played, strike rate, average, & more stats on CricTracker.`.replaceAll('  ', ' ').replaceAll(' :', ':'),
          sSlug: 'stats/batting-most-runs',
          sCUrl: 'stats/batting-most-runs',
          sDTitle: `${category?.sName} Stats`
        })

        // queuePush('addSeoData', seoParams)
        seoArr.push(seoParams)
      }

      if (categorySeos.includes('stBmri')) {
        const seoParams = {
          iId: category._id,
          eType: 'ct'
        }
        //   "HighestIndividualScore": "Highest Individual Score by Batsmen in {{name}} {{year}}",
        //   "HighestIndividualScore": "Check out the list of highest individual runs scored by batsmen in {{name}}, {{year}} and who is the highest run scorer in {{name}}, {{year}} & more stats on CricTracker.",
        Object.assign(seoParams, {
          eSubType: 'stBmri',
          sTitle: `Highest Individual Score by Batsmen in ${series?.sSrtTitle ?? category?.sName} ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())}`.replaceAll('  ', ' ').replaceAll(' :', ':'),
          sDescription: `Check out the list of highest individual runs scored by batsmen in ${series?.sSrtTitle ?? category?.sName}, ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())} and who is the highest run scorer in ${series?.sSrtTitle ?? category?.sName}, ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())} & more stats on CricTracker.`.replaceAll('  ', ' ').replaceAll(' :', ':'),
          sSlug: 'stats/batting-most-runs-innings',
          sCUrl: 'stats/batting-most-runs-innings',
          sDTitle: `${category?.sName} Stats`
        })

        // queuePush('addSeoData', seoParams)
        seoArr.push(seoParams)
      }

      if (categorySeos.includes('stBmr50')) {
        const seoParams = {
          iId: category._id,
          eType: 'ct'
        }
        //   "BattingMostFifties": "{{name}} Most Fifties {{year}} | List of Most Fifties in {{name}}",
        //   "BattingMostFifties": "{{name}} {{year}} Most Fifties: Check out the most half-centuries, most fifties in T20 world cup with players list, batsman, records, stats & more on CricTracker",
        Object.assign(seoParams, {
          eSubType: 'stBmr50',
          sTitle: `${series?.sSrtTitle ?? category?.sName} Most Fifties ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())} | List of Most Fifties in ${series?.sSrtTitle ?? category?.sName}`.replaceAll('  ', ' ').replaceAll(' :', ':'),
          sDescription: `${series?.sSrtTitle ?? category?.sName} ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())} Most Fifties: Check out the most half-centuries, most fifties in T20 world cup with players list, batsman, records, stats & more on CricTracker`.replaceAll('  ', ' ').replaceAll(' :', ':'),
          sSlug: 'stats/batting-most-run50',
          sCUrl: 'stats/batting-most-run50',
          sDTitle: `${category?.sName} Stats`
        })

        // queuePush('addSeoData', seoParams)
        seoArr.push(seoParams)
      }

      if (categorySeos.includes('stBms')) {
        const seoParams = {
          iId: category._id,
          eType: 'ct'
        }
        //   "BattingMostSixes": "{{name}} {{year}} Most Sixes | Most Sixes in {{name}} Players List",
        //   "BattingMostSixes": "Most Sixes in {{name}} {{year}}: Get updated list of Most Sixes in {{name}} {{year}} for every Match along with the players standings and stats & more only on CricTracker",
        Object.assign(seoParams, {
          eSubType: 'stBms',
          sTitle: `${series?.sSrtTitle ?? category?.sName} ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())} Most Sixes | Most Sixes in ${series?.sSrtTitle ?? category?.sName} Players List`.replaceAll('  ', ' ').replaceAll(' :', ':'),
          sDescription: `Most Sixes in ${series?.sSrtTitle ?? category?.sName} ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())}: Get updated list of Most Sixes in ${series?.sSrtTitle ?? category?.sName} ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())} for every Match along with the players standings and stats & more only on CricTracker`.replaceAll('  ', ' ').replaceAll(' :', ':'),
          sSlug: 'stats/batting-most-sixes',
          sCUrl: 'stats/batting-most-sixes',
          sDTitle: `${category?.sName} Stats`
        })

        // queuePush('addSeoData', seoParams)
        seoArr.push(seoParams)
      }

      if (categorySeos.includes('stBtwt')) {
        const seoParams = {
          iId: category._id,
          eType: 'ct'
        }
        //   "BowlingTopWicketTakers": "Most Wickets {{name}} {{year}} | Leading Wicket takers in {{name}} {{year}} – CricTracker",
        //   "BowlingTopWicketTakers": "{{name}} {{year}} Most Wickets: Get updated list of {{name}} {{year}} leading wicket takers and also find out who has the title of taking most wickets? Find latest bowling stats of {{name}} {{year}}.",

        Object.assign(seoParams, {
          eSubType: 'stBtwt',
          sTitle: `Most Wickets ${series?.sSrtTitle ?? category?.sName} ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())} | Leading Wicket takers in ${series?.sSrtTitle ?? category?.sName} ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())} – CricTracker`.replaceAll('  ', ' ').replaceAll(' :', ':'),
          sDescription: `${series?.sSrtTitle ?? category?.sName} ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())} Most Wickets: Get updated list of ${series?.sSrtTitle ?? category?.sName} ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())} leading wicket takers and also find out who has the title of taking most wickets? Find latest bowling stats of ${series?.sSrtTitle ?? category?.sName} ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())}.`.replaceAll('  ', ' ').replaceAll(' :', ':'),
          sSlug: 'stats/bowling-top-wicket-takers',
          sCUrl: 'stats/bowling-top-wicket-takers',
          sDTitle: `${category?.sName} Stats`
        })

        // queuePush('addSeoData', seoParams)
        seoArr.push(seoParams)
      }

      if (categorySeos.includes('stBba')) {
        const seoParams = {
          iId: category._id,
          eType: 'ct'
        }
        //   "BowlingBestAverage": "{{name}} {{year}} Best Bowling Average | Best Bowling Average",
        //   "BowlingBestAverage": "Check out the list of players with the best bowling average, best average, and more along with matches played on CricTracker.",
        Object.assign(seoParams, {
          eSubType: 'stBba',
          sTitle: `${series?.sSrtTitle ?? category?.sName} ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())} Best Bowling Average | Best Bowling Average`.replaceAll('  ', ' ').replaceAll(' :', ':'),
          sDescription: 'Check out the list of players with the best bowling average, best average, and more along with matches played on CricTracker.'.replaceAll('  ', ' ').replaceAll(' :', ':'),
          sSlug: 'stats/bowling-best-averages',
          sCUrl: 'stats/bowling-best-averages',
          sDTitle: `${category?.sName} Stats`
        })

        // queuePush('addSeoData', seoParams)
        seoArr.push(seoParams)
      }

      if (categorySeos.includes('stBber')) {
        const seoParams = {
          iId: category._id,
          eType: 'ct'
        }
        //   "BowlingBestEconomyRates": "{{name}} {{year}} Best Economy Rates | Best Bowling Economy Rates",
        //   "BowlingBestEconomyRates": "{{name}} {{year}} Best Economy Rates: Get updated list of bowlers with best economy rates average bowlers in {{name}} 8th editions, {{name}} {{year}} Records, performance, and stats only on CricTracker",
        Object.assign(seoParams, {
          eSubType: 'stBber',
          sTitle: `${series?.sSrtTitle ?? category?.sName} ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())} Best Economy Rates | Best Bowling Economy Rates`.replaceAll('  ', ' ').replaceAll(' :', ':'),
          sDescription: `${series?.sSrtTitle ?? category?.sName} ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())} Best Economy Rates: Get updated list of bowlers with best economy rates average bowlers in ${series?.sSrtTitle ?? category?.sName} 8th editions, ${series?.sSrtTitle ?? category?.sName} ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())} Records, performance, and stats only on CricTracker`.replaceAll('  ', ' ').replaceAll(' :', ':'),
          sSlug: 'stats/bowling-best-economy-rates',
          sCUrl: 'stats/bowling-best-economy-rates',
          sDTitle: `${category?.sName} Stats`
        })

        // queuePush('addSeoData', seoParams)
        seoArr.push(seoParams)
      }

      if (categorySeos.includes('stBberi')) {
        const seoParams = {
          iId: category._id,
          eType: 'ct'
        }
        //   "BowlingBestEconomyRatesInnings": "{{name}} {{year}} Best Economy Rates (Innings) | Best Bowling Economy Rates",
        //   "BowlingBestEconomyRatesInnings": "{{name}} {{year}} Best Economy Rates (Innings): Get updated list of bowlers with best economy rates (Innings) average bowlers in {{name}} 8th editions, {{name}} {{year}} Records, performance, and stats only on CricTracker",
        Object.assign(seoParams, {
          eSubType: 'stBberi',
          sTitle: `${series?.sSrtTitle ?? category?.sName} ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())} Best Economy Rates (Innings) | Best Bowling Economy Rates`.replaceAll('  ', ' ').replaceAll(' :', ':'),
          sDescription: `${series?.sSrtTitle ?? category?.sName} ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())} Best Economy Rates (Innings): Get updated list of bowlers with best economy rates (Innings) average bowlers in ${series?.sSrtTitle ?? category?.sName} 8th editions, ${series?.sSrtTitle ?? category?.sName} ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())} Records, performance, and stats only on CricTracker`.replaceAll('  ', ' ').replaceAll(' :', ':'),
          sSlug: 'stats/bowling-best-economy-rates-innings',
          sCUrl: 'stats/bowling-best-economy-rates-innings',
          sDTitle: `${category?.sName} Stats`
        })

        // queuePush('addSeoData', seoParams)
        seoArr.push(seoParams)
      }

      if (categorySeos.includes('stBbsr')) {
        const seoParams = {
          iId: category._id,
          eType: 'ct'
        }
        //   "BowlingBestStrikeRates": "{{name}} {{year}} Best Strike Rates | Best Bowling Strike Rates",
        //   "BowlingBestStrikeRates": "{{name}} {{year}} Best Strike Rates: Get updated list of bowlers with best strike rates average bowlers in {{name}} 8th editions, {{name}} {{year}} Records, performance, and stats only on CricTracker",
        Object.assign(seoParams, {
          eSubType: 'stBbsr',
          sTitle: `${series?.sSrtTitle ?? category?.sName} ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())} Best Strike Rates | Best Bowling Strike Rates`.replaceAll('  ', ' ').replaceAll(' :', ':'),
          sDescription: `${series?.sSrtTitle ?? category?.sName} ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())} Best Strike Rates: Get updated list of bowlers with best strike rates average bowlers in ${series?.sSrtTitle ?? category?.sName} 8th editions, ${series?.sSrtTitle ?? category?.sName} ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())} Records, performance, and stats only on CricTracker`.replaceAll('  ', ' ').replaceAll(' :', ':'),
          sSlug: 'stats/bowling-best-strike-rates',
          sCUrl: 'stats/bowling-best-strike-rates',
          sDTitle: `${category?.sName} Stats`
        })

        // queuePush('addSeoData', seoParams)
        seoArr.push(seoParams)
      }

      if (categorySeos.includes('stBbsri')) {
        const seoParams = {
          iId: category._id,
          eType: 'ct'
        }
        //   "BowlingBestStrikeRatesInnings": "{{name}} {{year}} Best Strike Rates (Innings) | Best Bowling Strike Rates",
        //   "BowlingBestStrikeRatesInnings": "{{name}} {{year}} Best Strike Rates (Innings): Get updated list of bowlers with best strike rates (Innings) average bowlers in {{name}} 8th editions, {{name}} {{year}} Records, performance, and stats only on CricTracker",
        Object.assign(seoParams, {
          eSubType: 'stBbsri',
          sTitle: `${series?.sSrtTitle ?? category?.sName} ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())} Best Strike Rates (Innings) | Best Bowling Strike Rates`.replaceAll('  ', ' ').replaceAll(' :', ':'),
          sDescription: `${series?.sSrtTitle ?? category?.sName} ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())} Best Strike Rates (Innings): Get updated list of bowlers with best strike rates (Innings) average bowlers in ${series?.sSrtTitle ?? category?.sName} 8th editions, ${series?.sSrtTitle ?? category?.sName} ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())} Records, performance, and stats only on CricTracker`.replaceAll('  ', ' ').replaceAll(' :', ':'),
          sSlug: 'stats/bowling-best-strike-rates-innings',
          sCUrl: 'stats/bowling-best-strike-rates-innings',
          sDTitle: `${category?.sName} Stats`
        })

        // queuePush('addSeoData', seoParams)
        seoArr.push(seoParams)
      }

      if (categorySeos.includes('stBfiw')) {
        const seoParams = {
          iId: category._id,
          eType: 'ct'
        }
        //   "BowlingFiveWickets": "{{name}} {{year}} Five Wickets | Five Wickets in {{name}} Players List",
        //   "BowlingFiveWickets": "Five Wickets in {{name}} {{year}}: Get an updated list of five wickets takers in {{name}} {{year}} for every match along with the player's standings and stats & more only on CricTracker",
        Object.assign(seoParams, {
          eSubType: 'stBfiw',
          sTitle: `${series?.sSrtTitle ?? category?.sName} ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())} Five Wickets | Five Wickets in ${series?.sSrtTitle ?? category?.sName} Players List`.replaceAll('  ', ' ').replaceAll(' :', ':'),
          sDescription: `Five Wickets in ${series?.sSrtTitle ?? category?.sName} ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())}: Get an updated list of five wickets takers in ${series?.sSrtTitle ?? category?.sName} ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())} for every match along with the player's standings and stats & more only on CricTracker`.replaceAll('  ', ' ').replaceAll(' :', ':'),
          sSlug: 'stats/bowling-five-wickets',
          sCUrl: 'stats/bowling-five-wickets',
          sDTitle: `${category?.sName} Stats`
        })

        // queuePush('addSeoData', seoParams)
        seoArr.push(seoParams)
      }

      if (categorySeos.includes('stBbbf')) {
        const seoParams = {
          iId: category._id,
          eType: 'ct'
        }
        //   "BowlingBestBowlingFigures": "{{name}} {{year}} Stats - Best Bowling Figures | CricTracker",
        //   "BowlingBestBowlingFigures": "{{name}} {{year}} Best Bowling Figures: Get updated list of best bowling performance in {{name}} {{year}} & get to know who has the best bowling figures in {{name}} {{year}}",
        Object.assign(seoParams, {
          eSubType: 'stBbbf',
          sTitle: `${series?.sSrtTitle ?? category?.sName} ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())} Stats - Best Bowling Figures | CricTracker`.replaceAll('  ', ' ').replaceAll(' :', ':'),
          sDescription: `${series?.sSrtTitle ?? category?.sName} ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())} Best Bowling Figures: Get updated list of best bowling performance in ${series?.sSrtTitle ?? category?.sName} ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())} & get to know who has the best bowling figures in ${series?.sSrtTitle ?? category?.sName} ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())}`.replaceAll('  ', ' ').replaceAll(' :', ':'),
          sSlug: 'stats/bowling-best-bowling-figures',
          sCUrl: 'stats/bowling-best-bowling-figures',
          sDTitle: `${category?.sName} Stats`
        })

        // queuePush('addSeoData', seoParams)
        seoArr.push(seoParams)
      }

      if (categorySeos.includes('stBmrci')) {
        const seoParams = {
          iId: category._id,
          eType: 'ct'
        }
        //   "BowlingMostRunsConcededInnings": "Most Runs Conceded in an innings in {{name}} {{year}} | List of {{name}} {{year}} Most Runs Conceded in an innings",
        //   "BowlingMostRunsConcededInnings": "{{name}} {{year}} Most Runs Conceded in an innings: Check out the list of Most Runs Conceded in an innings in {{name}} with matches played, strike rate, average, & more stats on CricTracker.",
        Object.assign(seoParams, {
          eSubType: 'stBmrci',
          sTitle: `Most Runs Conceded in an innings in ${series?.sSrtTitle ?? category?.sName} ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())} | List of ${series?.sSrtTitle ?? category?.sName} ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())} Most Runs Conceded in an innings`.replaceAll('  ', ' ').replaceAll(' :', ':'),
          sDescription: `${series?.sSrtTitle ?? category?.sName} ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())} Most Runs Conceded in an innings: Check out the list of Most Runs Conceded in an innings in ${series?.sSrtTitle ?? category?.sName} with matches played, strike rate, average, & more stats on CricTracker.`.replaceAll('  ', ' ').replaceAll(' :', ':'),
          sSlug: 'stats/bowling-most-runs-conceded-innings',
          sCUrl: 'stats/bowling-most-runs-conceded-innings',
          sDTitle: `${category?.sName} Stats`
        })

        // queuePush('addSeoData', seoParams)
        seoArr.push(seoParams)
      }

      if (categorySeos.includes('stBfow')) {
        const seoParams = {
          iId: category._id,
          eType: 'ct'
        }
        //   "BowlingFourWickets": "{{name}} {{year}} Four Wickets | Four Wickets in {{name}} Players List",
        //   "BowlingFourWickets": "Four Wickets in {{name}} {{year}}: Get an updated list of four wickets takers in {{name}} {{year}} for every match along with the player's standings and stats & more only on CricTracker",
        Object.assign(seoParams, {
          eSubType: 'stBfow',
          sTitle: `${series?.sSrtTitle ?? category?.sName} ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())} Four Wickets | Four Wickets in ${series?.sSrtTitle ?? category?.sName} Players List`.replaceAll('  ', ' ').replaceAll(' :', ':'),
          sDescription: `Four Wickets in ${series?.sSrtTitle ?? category?.sName} ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())}: Get an updated list of four wickets takers in ${series?.sSrtTitle ?? category?.sName} ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())} for every match along with the player's standings and stats & more only on CricTracker`.replaceAll('  ', ' ').replaceAll(' :', ':'),
          sSlug: 'stats/bowling-four-wickets',
          sCUrl: 'stats/bowling-four-wickets',
          sDTitle: `${category?.sName} Stats`
        })

        // queuePush('addSeoData', seoParams)
        seoArr.push(seoParams)
      }

      if (categorySeos.includes('stBm')) {
        const seoParams = {
          iId: category._id,
          eType: 'ct'
        }
        //   "BowlingMaidens": "{{name}} Maiden Over | Players List of Maiden Over in {{name}}",
        //   "BowlingMaidens": "{{name}} {{year}} Maiden Over: Get updated list of bowlers with maiden over in {{name}} 8th editions, {{name}} {{year}} Records, performance, and stats only on CricTracker",

        Object.assign(seoParams, {
          eSubType: 'stBm',
          sTitle: `${series?.sSrtTitle ?? category?.sName} Maiden Over | Players List of Maiden Over in ${series?.sSrtTitle ?? category?.sName}`.replaceAll('  ', ' ').replaceAll(' :', ':'),
          sDescription: `${series?.sSrtTitle ?? category?.sName} ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())} Maiden Over: Get updated list of bowlers with maiden over in ${series?.sSrtTitle ?? category?.sName} 8th editions, ${series?.sSrtTitle ?? category?.sName} ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())} Records, performance, and stats only on CricTracker`.replaceAll('  ', ' ').replaceAll(' :', ':'),
          sSlug: 'stats/bowling-maidens',
          sCUrl: 'stats/bowling-maidens',
          sDTitle: `${category?.sName} Stats`
        })

        // queuePush('addSeoData', seoParams)
        seoArr.push(seoParams)
      }

      if (categorySeos.includes('stTtr')) {
        const seoParams = {
          iId: category._id,
          eType: 'ct'
        }
        //   "TeamTotalRuns": "Highest Total Runs in {{name}} {{year}} | Highest Team Total Runs",
        //   "TeamTotalRuns": "{{name}} {{year}} Team Total Runs: Get updated Team batsmen list of most runs in {{name}} with matches played, strike rate, average, & more stats on CricTracker.",

        Object.assign(seoParams, {
          eSubType: 'stTtr',
          sTitle: `Highest Total Runs in ${series?.sSrtTitle ?? category?.sName} ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())} | Highest Team Total Runs`.replaceAll('  ', ' ').replaceAll(' :', ':'),
          sDescription: `${series?.sSrtTitle ?? category?.sName} ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())} Team Total Runs: Get updated Team batsmen list of most runs in ${series?.sSrtTitle ?? category?.sName} with matches played, strike rate, average, & more stats on CricTracker.`.replaceAll('  ', ' ').replaceAll(' :', ':'),
          sSlug: 'stats/team-total-runs',
          sCUrl: 'stats/team-total-runs',
          sDTitle: `${category?.sName} Stats`
        })

        // queuePush('addSeoData', seoParams)
        seoArr.push(seoParams)
      }

      if (categorySeos.includes('stTtr100')) {
        const seoParams = {
          iId: category._id,
          eType: 'ct'
        }
        //   "TeamMostCenturies": "Highest Most Centuries in {{name}} {{year}} | Highest Most Centuries in Team",
        //   "TeamMostCenturies": "{{name}} {{year}} Most Centuries: Team Players List of Most Centuries in {{name}} Cricket, Check Highest Run Hundreds scorer in {{name}}, {{name}} records, & more stats on CricTracker.",
        Object.assign(seoParams, {
          eSubType: 'stTtr100',
          sTitle: `Highest Most Centuries in ${series?.sSrtTitle ?? category?.sName} ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())} | Highest Most Centuries in Team`.replaceAll('  ', ' ').replaceAll(' :', ':'),
          sDescription: `${series?.sSrtTitle ?? category?.sName} ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())} Most Centuries: Team Players List of Most Centuries in ${series?.sSrtTitle ?? category?.sName} Cricket, Check Highest Run Hundreds scorer in ${series?.sSrtTitle ?? category?.sName}, ${series?.sSrtTitle ?? category?.sName} records, & more stats on CricTracker.`.replaceAll('  ', ' ').replaceAll(' :', ':'),
          sSlug: 'stats/team-total-run100',
          sCUrl: 'stats/team-total-run100',
          sDTitle: `${category?.sName} Stats`
        })

        // queuePush('addSeoData', seoParams)
        seoArr.push(seoParams)
      }

      if (categorySeos.includes('stTtw')) {
        const seoParams = {
          iId: category._id,
          eType: 'ct'
        }
        //   "TeamMostFifties": "Highest Most Fifties in {{name}} {{year}} | Highest Most Fifties in Team",
        //   "TeamMostFifties": "{{name}} {{year}} Most Fifties: Get updated Team batsmen most half-centuries, most fifties in T20 world cup with players list, batsman, records, stats & more on CricTracker",

        Object.assign(seoParams, {
          eSubType: 'stTtw',
          sTitle: `Highest Most Fifties in ${series?.sSrtTitle ?? category?.sName} ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())} | Highest Most Fifties in Team`.replaceAll('  ', ' ').replaceAll(' :', ':'),
          sDescription: `${series?.sSrtTitle ?? category?.sName} ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())} Most Fifties: Get updated Team batsmen most half-centuries, most fifties in T20 world cup with players list, batsman, records, stats & more on CricTracker`.replaceAll('  ', ' ').replaceAll(' :', ':'),
          sSlug: 'stats/team-total-wickets',
          sCUrl: 'stats/team-total-wickets',
          sDTitle: `${category?.sName} Stats`
        })

        // queuePush('addSeoData', seoParams)
        seoArr.push(seoParams)
      }

      if (categorySeos.includes('stBmf')) {
        const seoParams = {
          iId: category._id,
          eType: 'ct'
        }
        //   "TeamTotalWickets": "Highest Total Wickets in {{name}} {{year}} | Highest Team Total Wickets"
        //   "TeamTotalWickets": "Highest Total Wickets in {{name}} {{year}} | Highest Team Total Wickets""
        Object.assign(seoParams, {
          eSubType: 'stBmf',
          sTitle: `Highest Total Wickets in ${series?.sSrtTitle ?? category?.sName} ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())} | Highest Team Total Wickets"`.replaceAll('  ', ' ').replaceAll(' :', ':'),
          sDescription: `Highest Total Wickets in ${series?.sSrtTitle ?? category?.sName} ${seriesYear(series?.sSrtTitle ?? category?.sName, new Date(series.dStartDate).getFullYear())} | Highest Team Total Wickets`.replaceAll('  ', ' ').replaceAll(' :', ':'),
          sSlug: 'stats/batting-most-fifties',
          sCUrl: 'stats/batting-most-fifties',
          sDTitle: `${category?.sName} Stats`
        })

        // queuePush('addSeoData', seoParams)
        seoArr.push(seoParams)
      }
      if (seoArr.length) axios.post(`${SEO_REST_URL}api/add-seos-data`, { seos: seoArr }, { headers: { 'Content-Type': 'application/json' } })
    }
  } catch (err) {
    console.log(err)
  }
}

module.exports = builder
