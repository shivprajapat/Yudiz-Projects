import { combineReducers } from 'redux'

/* reducers-file */
import auth from './auth'
import dashboard from './dashboard'
import packages from './package'
import test from './testprocess'
import assessment from './assessment'
import counsellor from './counsellor'
export default combineReducers({
  auth,
  dashboard,
  packages,
  test,
  assessment,
  counsellor
})
