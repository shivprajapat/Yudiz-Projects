const { status, jsonStatus } = require('../helper/api.responses')
const { DISABLE_ADMIN_ROUTES } = require('../config/config')
module.exports = (app) => {
  if (DISABLE_ADMIN_ROUTES) {
    app.all('/api/admin/*', (req, res) => { return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound }) })
  }
  app.use('/api', [
    require('../models-routes-services/promocode/routes'),
    require('../models-routes-services/commonRules/routes'),
    require('../models-routes-services/sports/routes'),
    require('../models-routes-services/match/routes'),
    require('../models-routes-services/player/routes'),
    require('../models-routes-services/team/routes'),
    require('../models-routes-services/matchPlayer/routes'),
    require('../models-routes-services/playerRoles/routes'),
    require('../models-routes-services/leagueCategory/routes'),
    require('../models-routes-services/league/routes'),
    require('../models-routes-services/matchLeague/routes'),
    require('../models-routes-services/privateLeague/routes'),
    require('../models-routes-services/userTeam/routes'),
    require('../models-routes-services/userLeague/routes'),
    require('../models-routes-services/scorePoint/routes'),
    require('../models-routes-services/cron/routes'),
    require('../models-routes-services/myMatches/routes'),
    require('../models-routes-services/user/auth/routes'),
    require('../models-routes-services/user/statistics/routes'),
    require('../models-routes-services/user/profile/routes'),
    require('../models-routes-services/passbook/routes'),
    require('../models-routes-services/preferences/routes'),
    require('../models-routes-services/userBalance/routes'),
    require('../models-routes-services/setting/routes'),
    require('../models-routes-services/leaderBoard/routes'),
    require('../models-routes-services/report/routes'),
    require('../models-routes-services/user/systemUser/routes'),
    require('../models-routes-services/seriesLeaderBoard/routes'),
    require('../models-routes-services/country/routes'),
    require('../models-routes-services/promocode/statistics/routes'),
    require('../models-routes-services/match/fantasyPosts/routes'),
    require('../models-routes-services/season/routes'),
    require('../models-routes-services/dashboard/routes'),
    require('../models-routes-services/botLogs/routes'),
    require('../models-routes-services/userTds/routes'),
    require('../models-routes-services/scorecard/routes'),
    require('../models-routes-services/appDownload/routes'),
    require('../models-routes-services/apiLog/routes'),
    require('../models-routes-services/utility/routes'),
    require('../models-routes-services/user/otpVerifications/routes'),
    require('../models-routes-services/matchTeams/routes')
  ])
  app.get('/health-check', (req, res) => {
    const sDate = new Date().toJSON()
    return res.status(status.OK).jsonp({ status: jsonStatus.OK, sDate })
  })
  app.get('*', (req, res) => {
    return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound })
  })
}
