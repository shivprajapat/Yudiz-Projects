import { combineReducers } from 'redux'

/* reducers-file */
// Admin Panel
import auth from './auth'
import grade from './Admin/grade'
import school from './Admin/school'
import board from './Admin/board'
import university from './Admin/university'
import city from './Admin/cities'
import qualification from './Admin/qualification'
import state from './Admin/state'
import test from './Admin/test'
import packages from './Admin/package'
import question from './Admin/Test/Question'
import norms from './Admin/Norms/norms'
import testTimeNorms from './Admin/Norms/TestTimeNorms/TestTimeNorms'
import gradeNorms from './Admin/Norms/GradeNorms/GradeNorms'
import testNormsDescription from './Admin/Norms/TestNormsDescription/TestNormsDescription'
import softwareMetrics from './Admin/softwareMetrix'
import careerProfile from './Admin/careerProfile'
import subAdmin from './Admin/subAdmin'
import role from './Admin/role'
import student from './Admin/student'
import studentCenter from './Center/student'
import centerManAdmin from './Admin/center'
import centerPackages from './Center/purchaseLicense'
import counsellorManAdmin from './Admin/counsellor'
import session from './Counsellor/session'
import dashboard from './Counsellor/dashboard'
import sessionsAdmin from './Admin/session'
import CoupenCodesAdmin from './Admin/coupenCode'

// Counsellor Panel
import counsellor from './Counsellor/counsellor'

// center panel
import center from './Center/Center'

export default combineReducers({
  auth,
  grade,
  school,
  board,
  university,
  city,
  qualification,
  state,
  test,
  packages,
  question,
  norms,
  testTimeNorms,
  gradeNorms,
  testNormsDescription,
  softwareMetrics,
  careerProfile,
  subAdmin,
  role,
  student,
  counsellor,
  centerManAdmin,
  center,
  studentCenter,
  centerPackages,
  counsellorManAdmin,
  session,
  dashboard,
  sessionsAdmin,
  CoupenCodesAdmin
})
