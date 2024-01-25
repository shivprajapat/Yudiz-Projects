import { combineReducers } from 'redux'
import match from './match'
import league from './league'
import settings from './setting'
import team from './team'
import auth from './auth'
import profile from './profile'
import player from './player'
import contest from './contest'
import notification from './notification'
import more from './more'
import transaction from './transaction'
import url from './url'
import leaderBoard from './leaderBoard'
import scoreCard from './scoreCard'
import activeSports from './activeSports'
import complaints from './complaints'
import ads from './ads'

export default combineReducers({
  match,
  league,
  settings,
  team,
  auth,
  profile,
  player,
  contest,
  notification,
  more,
  transaction,
  activeSports,
  url,
  leaderBoard,
  ads,
  scoreCard,
  complaints
})
