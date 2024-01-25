import { combineReducers } from 'redux'
import authReducer from './AuthReducer'
import breadcrumbReducer from './BreadCrumbReducer'
import notificationReducer from './NotificationReducer'

const RootReducer = combineReducers({
  auth: authReducer,
  breadcrumb: breadcrumbReducer,
  notification: notificationReducer
})

export default RootReducer
