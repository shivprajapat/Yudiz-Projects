import { combineReducers } from 'redux'

import auth from './auth'
import rental from './rental'
import user from './user'
import users from './users'
import brand from './brand'
import material from './material'
import color from './color'
import category from './category'
import subCategory from './subCategory'
import sizeGroup from './sizeGroup'
import size from './size'
import splashScreen from './splashScreen'
import bannerText from './bannerText'
import bannerImage from './bannerImage'
import filter from './filter'
import notification from './notification'
import message from './messages'
import sendMessages from './sendMessage'
import report from './report'
import transaction from './transaction'
import address from './address'
import accessCodes from './accessCodes'
import fees from './fees'

export default combineReducers({
  auth,
  rental,
  user,
  users,
  brand,
  material,
  color,
  category,
  subCategory,
  sizeGroup,
  size,
  splashScreen,
  bannerText,
  bannerImage,
  filter,
  notification,
  message,
  sendMessages,
  report,
  transaction,
  address,
  accessCodes,
  fees
})
