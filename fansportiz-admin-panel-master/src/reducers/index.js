import { combineReducers } from 'redux'
import auth from './auth'
import offers from './offers'
import cms from './cms'
import promocode from './promocode'
import rule from './rule'
import banner from './banner'
import account from './account'
import team from './team'
import player from './player'
import match from './match'
import matchplayer from './matchplayer'
import playerRole from './playerRole'
import league from './league'
import leaguecategory from './leaguecategory'
import matchleague from './matchleague'
import permission from './permission'
import subadmin from './subadmin'
import kyc from './kyc'
import users from './users'
import notification from './notification'
import payment from './payment'
import setting from './setting'
import url from './url'
import passbook from './passbook'
import withdraw from './withdraw'
import matchreport from './matchreport'
import pointSystem from './pointSystem'
import seriesLeaderBoard from './seriesLeaderBoard'
import validations from './validations'
import deposit from './deposit'
import sports from './sports'
import pushNotification from './pushNotification'
import reports from './reports'
import popup from './popup'
import leaderboard from './leaderboard'
import feedback from './feedback'
import version from './version'
import charts from './charts'
import systemusers from './systemusers'
import payout from './payout'
import role from './role'
import season from './season'
import apilogs from './apilogs'

export default combineReducers({
  auth,
  cms,
  offers,
  promocode,
  rule,
  banner,
  account,
  player,
  match,
  kyc,
  team,
  matchplayer,
  playerRole,
  league,
  matchleague,
  leaguecategory,
  permission,
  subadmin,
  users,
  notification,
  payment,
  setting,
  url,
  passbook,
  withdraw,
  matchreport,
  pointSystem,
  seriesLeaderBoard,
  validations,
  deposit,
  sports,
  pushNotification,
  reports,
  popup,
  leaderboard,
  feedback,
  version,
  charts,
  systemusers,
  payout,
  role,
  season,
  apilogs
})
