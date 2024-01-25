const mongoose = require('mongoose')
const { handleCatchError } = require('../helper/utilities.services')

const config = require('../config/config')

const GamesDBConnect = connection(config.GAME_DB_URL, parseInt(config.GAME_DB_POOLSIZE), 'Game')
const MatchDBConnect = connection(config.MATCH_DB_URL, parseInt(config.MATCH_DB_POOLSIZE), 'Match')
const FantasyTeamConnect = connection(config.FANTASY_TEAM_DB_URL, parseInt(config.FANTASY_TEAM_DB_POOLSIZE), 'FantasyTeam')
const LeaguesDBConnect = connection(config.LEAGUES_DB_URL, parseInt(config.LEAGUES_DB_POOLSIZE), 'Leagues')
const SeriesLBDBConnect = connection(config.SERIES_LB_DB_URL, parseInt(config.SERIES_LB_DB_POOLSIZE), 'Series Leader-Board')
const UsersDBConnect = connection(config.USERS_DB_URL, parseInt(config.USERS_DB_POOLSIZE), 'Users')
const StatisticsDBConnect = connection(config.STATISTICS_DB_URL, parseInt(config.STATISTICS_DB_POOLSIZE), 'Statistics')
const ReportDBConnect = connection(config.REPORT_DB_URL, parseInt(config.REPORT_DB_POOLSIZE), 'Report')

// const BannersDBConnect = connection(config.BANNERS_DB_URL, parseInt(config.BANNERS_DB_POOLSIZE), 'Banners')
// const ComplaintsDBConnect = connection(config.COMPLAINS_DB_URL, parseInt(config.COMPLAINS_DB_POOLSIZE), 'Complaints')
// const FantasyTipsDBConnect = connection(config.FANTASYTIPS_DB_URL, parseInt(config.FANTASYTIPS_DB_POOLSIZE), 'FantasyTips')
// const PromocodesDBConnect = connection(config.PROMOCODES_DB_URL, parseInt(config.PROMOCODES_DB_POOLSIZE), 'Promocodes')
// const GeoDBConnect = connection(config.GEO_DB_URL, parseInt(config.GEO_DB_POOLSIZE), 'Geo')
// const NotificationsDBConnect = connection(config.NOTIFICATION_DB_URL, parseInt(config.NOTIFICATION_DB_POOLSIZE), 'Notifications')

function connection(DB_URL, maxPoolSize = 10, DB) {
  try {
    const dbConfig = { useNewUrlParser: true, useUnifiedTopology: true, readPreference: 'secondaryPreferred' }

    const conn = mongoose.createConnection(DB_URL, dbConfig)
    conn.on('connected', () => console.log(`Connected to ${DB} database.`))
    return conn
  } catch (error) {
    handleCatchError(error)
  }
}

module.exports = {
  UsersDBConnect,
  LeaguesDBConnect,
  StatisticsDBConnect,
  GamesDBConnect,
  MatchDBConnect,
  FantasyTeamConnect,
  ReportDBConnect,
  SeriesLBDBConnect
  // BannersDBConnect,
  // ComplaintsDBConnect,
  // FantasyTipsDBConnect,
  // PromocodesDBConnect,
  // NotificationsDBConnect,
  // GeoDBConnect,
}
