/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react'
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate
} from 'react-router-dom'

/* Components */
import PublicRoute from './PublicRoute'
import PrivateRoute from './PrivateRoute'
import Dashboard from '../Views/Dashboard'
import Login from '../Views/auth/login'
import LoginWithOtp from '../Views/auth/LoginWithOtp'
import ForgotPassword from '../Views/auth/ForgotPassword'
import ResetPassword from '../Views/auth/ResetPassword'
import OneTimePassword from '../Views/auth/OneTimePassword'
import SignUp from '../Views/auth/SignUp'
import EducationDetails from '../Components/Signup/CounsellorEducationDetails'
import KYCDetails from '../Components/Signup/CounsellorKYCDetails'
import RevenueCounsellor from '../Views/counselor/Revenue'
import QualificationMangement from '../Views/admin/QualificationManagement'
import AddNewQualification from '../Views/admin/QualificationManagement/AddNewQualification'
import EditQualification from '../Views/admin/QualificationManagement/EditQualification'
import ViewQualification from '../Views/admin/QualificationManagement/ViewQualification'

/* Package Mangement */
import PackageManagement from '../Views/admin/PackageManagement'
import AddNewPackage from '../Views/admin/PackageManagement/AddNewPackage'
import EditPackage from '../Views/admin/PackageManagement/EditPackage'
import ViewPackage from '../Views/admin/PackageManagement/ViewPackage'

/* University Mangement */
import UniversityManagement from '../Views/admin/UniversityManagement'
import AddNewUniversity from '../Views/admin/UniversityManagement/AddNewUniversity'
import EditUniversity from '../Views/admin/UniversityManagement/EditUniversity'
import ViewUniversity from '../Views/admin/UniversityManagement/ViewUniversity'

/* State Management */
import StateManagement from '../Views/admin/StateManagement'
import AddNewState from '../Views/admin/StateManagement/AddNewState'
import EditState from '../Views/admin/StateManagement/EditState'
import ViewState from '../Views/admin/StateManagement/ViewState'

/* University Management */
import CityManagement from '../Views/admin/CityManagement'
import AddNewCity from '../Views/admin/CityManagement/AddNewCity'
import EditCity from '../Views/admin/CityManagement/EditCity'
import ViewCity from '../Views/admin/CityManagement/ViewCity'

/* Grade Mangement */
import GradeManagement from '../Views/admin/GradeManagement'
import AddNewGrade from '../Views/admin/GradeManagement/AddNewGrade'
import EditGrade from '../Views/admin/GradeManagement/EditGrade'
import ViewGrade from '../Views/admin/GradeManagement/ViewGrade'

/* Board Mangement */
import BoardManagement from '../Views/admin/BoardManagement'
import AddNewBoard from '../Views/admin/BoardManagement/AddNewBoard'
import EditBoard from '../Views/admin/BoardManagement/EditBoard'
import ViewBoard from '../Views/admin/BoardManagement/ViewBoard'

/* School Mangement */
import SchoolManagement from '../Views/admin/SchoolManagement'
import AddNewSchool from '../Views/admin/SchoolManagement/AddNewSchool'
import EditSchool from '../Views/admin/SchoolManagement/EditSchool'
import ViewSchool from '../Views/admin/SchoolManagement/ViewSchool'

/* Test Management */
import Questions from '../Views/admin/TestManagement/Questions'
import AddNewQuestions from '../Views/admin/TestManagement/Questions/AddNewQuestions'
import EditQuestions from '../Views/admin/TestManagement/Questions/EditQuestions'
import ViewQuestions from '../Views/admin/TestManagement/Questions/ViewQuestions'
import MainCategory from '../Views/admin/TestManagement/MainCategory'
import AddNewMainCategory from '../Views/admin/TestManagement/MainCategory/AddNewMainCategory'
import ViewMainCategory from '../Views/admin/TestManagement/MainCategory/ViewMainCategory'
import EditMainCategory from '../Views/admin/TestManagement/MainCategory/EditMainCategory'
import SubCategory from '../Views/admin/TestManagement/SubCategory'
import AddNewSubCategory from '../Views/admin/TestManagement/SubCategory/AddNewSubCategory'
import ViewSubCategory from '../Views/admin/TestManagement/SubCategory/ViewSubCategory'
import EditSubCategory from '../Views/admin/TestManagement/SubCategory/EditSubCategory'
/* Norms Management */
import NormsManagement from '../Views/admin/NormsManagement'
import AddNewNorms from '../Views/admin/NormsManagement/AddNewNorms'
import ViewNorms from '../Views/admin/NormsManagement/ViewNorms'
import EditNorms from '../Views/admin/NormsManagement/EditNorms'
import GradeNorms from '../Views/admin/NormsManagement/GradeNorms'
import AddNewGradeNorms from '../Views/admin/NormsManagement/GradeNorms/AddNewGradeNorms'
import ViewGradeNorms from '../Views/admin/NormsManagement/GradeNorms/ViewGradeNorms'
import EditGradeNorms from '../Views/admin/NormsManagement/GradeNorms/EditGradeNorms'
import TestTimeNorms from '../Views/admin/NormsManagement/TestTimeNorms'
import AddNewTestTimeNorms from '../Views/admin/NormsManagement/TestTimeNorms/AddNewTestTimeNorms'
import ViewTestTimeNorms from '../Views/admin/NormsManagement/TestTimeNorms/ViewTestTimeNorms'
import EditTestTimeNorms from '../Views/admin/NormsManagement/TestTimeNorms/EditTestTimeNorms'
import TestDescriptionNorms from '../Views/admin/NormsManagement/TestDescriptionNorms'
import AddNewTestDescriptionNorms from '../Views/admin/NormsManagement/TestDescriptionNorms/AddNewTestDescriptionNorms'
import ViewTestDescriptionNorms from '../Views/admin/NormsManagement/TestDescriptionNorms/ViewTestDescriptionNorms'
import EditTestDescriptionNorms from '../Views/admin/NormsManagement/TestDescriptionNorms/EditTestDescriptionNorms'
/* Counsellor Pages */
import CounsellorDashboard from '../Views/counselor/CounsellorDashboard'
import NoSlotsSet from '../Views/counselor/Availability/NoSlotsSet'
import Availability from '../Views/counselor/Availability'
import SetAvailability from '../Views/counselor/Availability/SetAvailability'
import Session from '../Views/counselor/Session'
import SessionDetails from '../Views/counselor/Session/SessionDetails'
import CancelSessionDetails from '../Views/counselor/Session/CancelSessionDetails'
import RescheduleSessionDetails from '../Views/counselor/Session/RescheduleSessionDetails'
import ViewAvailable from '../Views/counselor/Availability/ViewAvailability'
import ViewRedeemDetailCounsellor from '../Views/counselor/Revenue/ViewRedemDetail'
// import Revenue from '../Views/counselor/Revenue'

/* SoftwareMatrix */
import SoftwareMatrix from '../Views/admin/SoftwareMatrix'
import AddNewSoftwareMatrix from '../Views/admin/SoftwareMatrix/AddNewSoftwareMatrix'
import EditSoftwareMatrix from '../Views/admin/SoftwareMatrix/EditSoftwareMatrix'
import ViewSoftwareMatrix from '../Views/admin/SoftwareMatrix/ViewSoftwareMatrix'
/* Career Profile */
import CareerProfile from '../Views/admin/CareerProfile'
import AddNewCareerProfile from '../Views/admin/CareerProfile/AddNewCareerProfile'
import EditCareerProfile from '../Views/admin/CareerProfile/EditCareerProfile'
import ViewCareerProfile from '../Views/admin/CareerProfile/ViewCareerProfile'
import Settings from '../Views/counselor/Settings'
import MyProfile from '../Views/counselor/Settings/MyProfile'
import EditMyProfile from '../Views/counselor/Settings/EditMyProfile'

/* Center Pages */
import CenterDashboard from '../Views/Center/CenterDashboard'
import CenterEditmyprofile from '../Views/Center/Settings/EditMyProfile'
import StudentsManagement from '../Views/admin/StudentsManagement/index'
import AddNewStudents from '../Views/admin/StudentsManagement/AddNewStudents'
import ViewStudents from '../Views/admin/StudentsManagement/ViewStudents'
import EditStudents from '../Views/admin/StudentsManagement/EditStudents'
import CounsellorManagement from '../Views/Center/CounsellorManagement'
import AddNewCounsellor from '../Views/Center/CounsellorManagement/AddNewCounsellor'
import EditCounsellor from '../Views/Center/CounsellorManagement/EditCounsellor'
import ViewCounsellor from '../Views/Center/CounsellorManagement/ViewCounsellor'
import RoleManagement from '../Views/Center/RoleManagement'
import AddNewRole from '../Views/Center/RoleManagement/AddNewRole'
import EditRole from '../Views/Center/RoleManagement/EditRole'
import ViewRole from '../Views/Center/RoleManagement/ViewRole'
import SubAdminManagement from '../Views/Center/SubAdminManagement'
import AddNewSubAdmin from '../Views/Center/SubAdminManagement/AddNewSubAdmin'
import EditSubAdmin from '../Views/Center/SubAdminManagement/EditSubAdmin'
import ViewSubAdmin from '../Views/Center/SubAdminManagement/ViewSubAdmin'
import PageNotFound from '../Components/PageNotFound'
import ViewStudentCen from '../Views/Center/StudentsManagement/ViewStudentCen'
import EditStudentsCen from '../Views/Center/StudentsManagement/EditStudentCen'
import AddNewStudentCen from '../Views/Center/StudentsManagement/AddNewStudentCen'
import CenterManagement from '../Views/admin/CenterManagement'
import AddNewCenter from '../Views/admin/CenterManagement/AddNewCenter'
import ViewCenter from '../Views/admin/CenterManagement/ViewCenter'
import EditCenter from '../Views/admin/CenterManagement/EditCenter'
import ChangePassword from '../Views/admin/Settings/ChangePassword'
import CenterProfile from '../Views/Center/Settings/MyProfile'
import AdminProfile from '../Views/admin/Settings/MyProfile'
import EditmyprofileAdmin from '../Views/admin/Settings/EditMyProfile'
import EditAvailable from '../Views/counselor/Availability/EditAvailabilty'
import StudentCenterManagement from '../Views/Center/StudentsManagement'
import Sessions from '../Views/admin/Sessions'
import SessionDetail from '../Views/admin/Sessions/SessionDetail'
import axios from 'axios'
import { useSnackbar } from 'react-notistack'
import ls from 'localstorage-slim'
import PurchaseLicense from '../Views/Center/PurchasedLicense'
import PurchaseCredit from '../Views/Center/PurchasedLicense/PurchaseCredit'
import RevenueCenter from '../Views/Center/Revenue'
import CenterRedeemHistory from '../Views/admin/CenterRedeemHistory'
import EditRedeemRequest from '../Views/admin/CenterRedeemHistory/EditRedeemRequest'
import ViewRedeemDetail from '../Views/Center/Revenue/ViewRedeemDetail'
import PaymentForm from '../Views/Center/PurchasedLicense/PaymentForm'
import Congratulations from '../Views/Center/PurchasedLicense/ThankYou'
import FailPayment from '../Views/Center/PurchasedLicense/FailPayment'
import PurchaseHistory from '../Views/Center/PurchasedLicense/PurchaseHistory'
import Coupons from '../Views/admin/CoupenCodes'
import AddNewCoupen from '../Views/admin/CoupenCodes/AddNewCoupen'
import EditCoupon from '../Views/admin/CoupenCodes/EditCoupon'
import ViewCoupon from '../Views/admin/CoupenCodes/ViewCoupon'
// import Revenue from '../Views/Center/Revenue'
// import localStorage from 'react-secure-storage'

function RoutesFile () {
  const roles = JSON.parse(localStorage.getItem('roles'))
  const profile = JSON.parse(localStorage.getItem('profile'))
  const adminType = ls.get('admin-type', { decrypt: true, secret: profile?.id })
  const location = useLocation()
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()

  // interceptor for authentication failed
  axios.interceptors.response.use(
    function (response) {
      return response
    },
    function (error) {
      console.log('error', error)

      if (error.response.status === 401) {
        localStorage.removeItem('token')
        enqueueSnackbar('Authentication Failed! Please login again', {
          variant: 'error',
          autoHide: true,
          hide: 3000
        })
        if (adminType === 'super' || adminType === 'sub') {
          navigate('/admin/login')
        } else if (adminType === 'center') {
          navigate('/center/login')
        } else if (adminType === 'counsellor') {
          navigate('/counsellor/login')
        }
      } else if (error.toJSON().message === 'Network Error') {
        enqueueSnackbar('No Internet Connection. Please Connect it!', {
          variant: 'error',
          autoHide: true,
          hide: 3000
        })
      } else {
        return Promise.reject(error)
      }
    }
  )

  useEffect(() => {}, [location?.pathname])

  // listing route role management function
  const validAdminList = (slug) => {
    if (
      roles?.find((i) => i.module_permissions.slug === slug)?.list === '1' ||
      adminType === 'super'
    ) {
      return true
    }
  }

  // Add module route role management function
  const validAdminCreate = (slug) => {
    if (
      roles?.find((i) => i.module_permissions.slug === slug)?.create === '1' ||
      adminType === 'super'
    ) {
      return true
    }
  }

  // View module route role management function
  const validAdminView = (slug) => {
    if (
      roles?.find((i) => i.module_permissions.slug === slug)?.view === '1' ||
      adminType === 'super'
    ) {
      return true
    }
  }

  // Update module route role management function
  const validAdminUpdate = (slug) => {
    if (
      roles?.find((i) => i.module_permissions.slug === slug)?.update === '1' ||
      adminType === 'super'
    ) {
      return true
    }
  }

  return (
    <>
      <Routes>
        {/* Page Not Found */}
        <Route exact path='*' element={<PageNotFound />} />
        {/* Public Routes */}
        <Route
          exact
          path='/counsellor/login'
          element={<PublicRoute element={<Login />} />}
        />
        <Route
          exact
          path='/center/login'
          element={<PublicRoute element={<Login />} />}
        />
        <Route
          exact
          path='/counsellor/signup'
          element={<PublicRoute element={<SignUp />} />}
        />
        <Route
          exact
          path='/reset-password'
          element={<PublicRoute element={<ResetPassword />} />}
        />
        <Route
          exact
          path='/login-with-otp/one-time-password'
          element={<PublicRoute element={<OneTimePassword />} />}
        />
        <Route
          exact
          path='/one-time-password'
          element={<PublicRoute element={<OneTimePassword />} />}
        />
        <Route
          exact
          path='/forgot-password'
          element={<PublicRoute element={<ForgotPassword />} />}
        />
        <Route
          exact
          path='/login-with-otp'
          element={<PublicRoute element={<LoginWithOtp />} />}
        />
        <Route
          exact
          path='/admin/login'
          element={<PublicRoute element={<Login />} />}
        />
        <Route
          exact
          path='/api/admin/reset-password/:token'
          element={<PublicRoute element={<ResetPassword />} />}
        />
        <Route
          exact
          path='/admin/forgot-password'
          element={<PublicRoute element={<ForgotPassword />} />}
        />
        <Route
          exact
          path='/admin/one-time-password'
          element={<PublicRoute element={<OneTimePassword />} />}
        />
        <Route
          exact
          path='/admin/reset-password'
          element={<PublicRoute element={<ResetPassword />} />}
        />
        <Route exact path='/' element={<PublicRoute element={<Login />} />} />

        {/* Private Routes */}
        <Route
          exact
          path='/admin/dashboard'
          element={<PrivateRoute element={<Dashboard />} />}
        />
        <Route
          exact
          path='/kycdetails'
          element={<PublicRoute element={<KYCDetails />} />}
        />
        <Route
          exact
          path='/educationdetails'
          element={<PublicRoute element={<EducationDetails />} />}
        />
        {/* University */}
        {validAdminList('university-management') && (
          <Route
            exact
            path='/admin/university-management'
            element={
              <PrivateRoute
                element={<UniversityManagement />}
                slug='university-management'
              />
            }
          />
        )}
        {validAdminCreate('university-management') && (
          <Route
            exact
            path='/admin/university-management/add-new-university'
            element={<PrivateRoute element={<AddNewUniversity />} />}
          />
        )}
        {validAdminUpdate('university-management') && (
          <Route
            exact
            path='/admin/university-management/edit-university/:id'
            element={<PrivateRoute element={<EditUniversity />} />}
          />
        )}
        {validAdminView('university-management') && (
          <Route
            exact
            path='/admin/university-management/view-university/:id'
            element={<PrivateRoute element={<ViewUniversity />} />}
          />
        )}

        {/* State */}
        {validAdminList('state-management') && (
          <Route
            exact
            path='/admin/state-management'
            element={
              <PrivateRoute
                element={<StateManagement />}
                slug='state-management'
              />
            }
          />
        )}
        {validAdminList('state-management') && (
          <Route
            exact
            path='/admin/state-management/add-new-state'
            element={<PrivateRoute element={<AddNewState />} />}
          />
        )}
        {validAdminUpdate('state-management') && (
          <Route
            exact
            path='/admin/state-management/edit-state/:id'
            element={<PrivateRoute element={<EditState />} />}
          />
        )}
        {validAdminView('state-management') && (
          <Route
            exact
            path='/admin/state-management/view-state/:id'
            element={<PrivateRoute element={<ViewState />} />}
          />
        )}

        {/* City */}
        {validAdminList('city-management') && (
          <Route
            exact
            path='/admin/city-management'
            element={
              <PrivateRoute
                element={<CityManagement />}
                slug='city-management'
              />
            }
          />
        )}
        {validAdminCreate('city-management') && (
          <Route
            exact
            path='/admin/city-management/add-new-city'
            element={<PrivateRoute element={<AddNewCity />} />}
          />
        )}
        {validAdminUpdate('city-management') && (
          <Route
            exact
            path='/admin/city-management/edit-city/:id'
            element={<PrivateRoute element={<EditCity />} />}
          />
        )}
        {validAdminView('city-management') && (
          <Route
            exact
            path='/admin/city-management/view-city/:id'
            element={<PrivateRoute element={<ViewCity />} />}
          />
        )}

        {/* Grade Module Routes */}
        {validAdminList('grade-management') && (
          <Route
            exact
            path='/admin/grade-management'
            element={
              <PrivateRoute
                element={<GradeManagement />}
                slug='grade-management'
              />
            }
          />
        )}
        {validAdminCreate('grade-management') && (
          <Route
            exact
            path='/admin/grade-management/add-new-grade'
            element={<PrivateRoute element={<AddNewGrade />} />}
          />
        )}
        {validAdminUpdate('grade-management') && (
          <Route
            exact
            path='/admin/grade-management/edit-grade/:id'
            element={<PrivateRoute element={<EditGrade />} />}
          />
        )}
        {validAdminView('grade-management') && (
          <Route
            exact
            path='/admin/grade-management/view-grade/:id'
            element={<PrivateRoute element={<ViewGrade />} />}
          />
        )}

        {/* Qualification Module Routes */}
        {validAdminList('qualification-management') && (
          <Route
            exact
            path='/admin/qualification-management'
            element={
              <PrivateRoute
                element={<QualificationMangement />}
                slug='qualification-management'
              />
            }
          />
        )}
        {validAdminCreate('qualification-management') && (
          <Route
            exact
            path='/admin/qualification-management/add-new-qualification'
            element={
              <PrivateRoute
                element={<AddNewQualification />}
                slug='qualification-management'
              />
            }
          />
        )}
        {validAdminUpdate('qualification-management') && (
          <Route
            exact
            path='/admin/qualification-management/edit-qualification/:id'
            element={
              <PrivateRoute
                element={<EditQualification />}
                slug='qualification-management'
              />
            }
          />
        )}
        {validAdminView('qualification-management') && (
          <Route
            exact
            path='/admin/qualification-management/view-qualification/:id'
            element={
              <PrivateRoute
                element={<ViewQualification />}
                slug='qualification-management'
              />
            }
          />
        )}

        {/* Board Module Routes */}
        {validAdminList('board-management') && (
          <Route
            exact
            path='/admin/board-management'
            element={
              <PrivateRoute
                element={<BoardManagement />}
                slug='board-management'
              />
            }
          />
        )}
        {validAdminCreate('board-management') && (
          <Route
            exact
            path='/admin/board-management/add-new-board'
            element={<PrivateRoute element={<AddNewBoard />} />}
          />
        )}
        {validAdminUpdate('board-management') && (
          <Route
            exact
            path='/admin/board-management/edit-board/:id'
            element={<PrivateRoute element={<EditBoard />} />}
          />
        )}
        {validAdminView('board-management') && (
          <Route
            exact
            path='/admin/board-management/view-board/:id'
            element={<PrivateRoute element={<ViewBoard />} />}
          />
        )}

        {/* School Module Routes */}
        {validAdminCreate('school-management') && (
          <Route
            path='/admin/school-management/add-new-school'
            element={
              <PrivateRoute
                element={<AddNewSchool />}
                slug='school-management'
              />
            }
          />
        )}
        {validAdminList('school-management') && (
          <Route
            exact
            path='/admin/school-management'
            element={
              <PrivateRoute
                element={<SchoolManagement />}
                slug='school-management'
              />
            }
          />
        )}
        {validAdminUpdate('school-management') && (
          <Route
            exact
            path='/admin/school-management/edit-school/:id'
            element={
              <PrivateRoute element={<EditSchool />} slug='school-management' />
            }
          />
        )}
        {validAdminView('school-management') && (
          <Route
            exact
            path='/admin/school-management/view-school/:id'
            element={
              <PrivateRoute element={<ViewSchool />} slug='school-management' />
            }
          />
        )}

        {/* Package Management */}
        {validAdminList('package-management') && (
          <Route
            exact
            path='/admin/package-management'
            element={
              <PrivateRoute
                element={<PackageManagement />}
                slug='package-management'
              />
            }
          />
        )}
        {validAdminCreate('package-management') && (
          <Route
            exact
            path='/admin/package-management/add-new-package'
            element={
              <PrivateRoute
                element={<AddNewPackage />}
                slug='package-management'
              />
            }
          />
        )}
        {validAdminUpdate('package-management') && (
          <Route
            exact
            path='/admin/package-management/edit-package/:id'
            element={
              <PrivateRoute
                element={<EditPackage />}
                slug='package-management'
              />
            }
          />
        )}
        {validAdminView('package-management') && (
          <Route
            exact
            path='/admin/package-management/view-package/:id'
            element={
              <PrivateRoute
                element={<ViewPackage />}
                slug='package-management'
              />
            }
          />
        )}

        {/* Test management */}
        {validAdminList('test-management/questions') && (
          <Route
            exact
            path='/admin/test-management/questions'
            element={
              <PrivateRoute
                element={<Questions />}
                slug='test-management/questions'
              />
            }
          />
        )}

        {/* Question management */}
        {validAdminCreate('test-management/questions') && (
          <Route
            exact
            path='/admin/test-management/questions/add-new-questions'
            element={
              <PrivateRoute
                element={<AddNewQuestions />}
                slug='test-management/questions'
              />
            }
          />
        )}
        {validAdminUpdate('test-management/questions') && (
          <Route
            exact
            path='/admin/test-management/question/edit-questions/:id'
            element={
              <PrivateRoute
                element={<EditQuestions />}
                slug='test-management/questions'
              />
            }
          />
        )}
        {validAdminView('test-management/questions') && (
          <Route
            exact
            path='/admin/test-management/question/view-questions/:id'
            element={
              <PrivateRoute
                element={<ViewQuestions />}
                slug='test-management/questions'
              />
            }
          />
        )}

        {/* Main category management */}
        {validAdminList('test-management/main-category') && (
          <Route
            exact
            path='/admin/test-management/main-category'
            element={
              <PrivateRoute
                element={<MainCategory />}
                slug='test-management/main-category'
              />
            }
          />
        )}
        {validAdminCreate('test-management/main-category') && (
          <Route
            exact
            path='/admin/test-management/main-category/add-new-maincategory'
            element={<PrivateRoute element={<AddNewMainCategory />} />}
          />
        )}
        {validAdminView('test-management/main-category') && (
          <Route
            exact
            path='/admin/test-management/main-category/view-maincategory/:id'
            element={<PrivateRoute element={<ViewMainCategory />} />}
          />
        )}
        {validAdminUpdate('test-management/main-category') && (
          <Route
            exact
            path='/admin/test-management/main-category/edit-maincategory/:id'
            element={<PrivateRoute element={<EditMainCategory />} />}
          />
        )}

        {/* Sub category management */}
        {validAdminList('test-management/sub-category') && (
          <Route
            exact
            path='/admin/test-management/sub-category'
            element={
              <PrivateRoute
                element={<SubCategory />}
                slug='test-management/sub-category'
              />
            }
          />
        )}
        {validAdminCreate('test-management/sub-category') && (
          <Route
            exact
            path='/admin/test-management/sub-category/add-new-subcategory'
            element={<PrivateRoute element={<AddNewSubCategory />} />}
          />
        )}
        {validAdminView('test-management/sub-category') && (
          <Route
            exact
            path='/admin/test-management/sub-category/view-subcategory/:id'
            element={<PrivateRoute element={<ViewSubCategory />} />}
          />
        )}
        {validAdminUpdate('test-management/sub-category') && (
          <Route
            exact
            path='/admin/test-management/sub-category/edit-subcategory/:id'
            element={<PrivateRoute element={<EditSubCategory />} />}
          />
        )}

        {/* Norms Management */}
        {validAdminList('norms-management') && (
          <Route
            exact
            path='/admin/norms-management'
            element={
              <PrivateRoute
                element={<NormsManagement />}
                slug='norms-management'
              />
            }
          />
        )}
        {validAdminCreate('norms-management') && (
          <Route
            exact
            path='/admin/norms-management/add-new-norms'
            element={
              <PrivateRoute element={<AddNewNorms />} slug='norms-management' />
            }
          />
        )}
        {validAdminView('norms-management') && (
          <Route
            exact
            path='/admin/norms-management/view-norms/:id'
            element={
              <PrivateRoute element={<ViewNorms />} slug='norms-management' />
            }
          />
        )}
        {validAdminUpdate('norms-management') && (
          <Route
            exact
            path='/admin/norms-management/edit-norms/:id'
            element={
              <PrivateRoute element={<EditNorms />} slug='norms-management' />
            }
          />
        )}

        {/* Grade norms management */}
        {validAdminList('norms-management/gradenorms') && (
          <Route
            exact
            path='/admin/norms/gradenorms'
            element={
              <PrivateRoute
                element={<GradeNorms />}
                slug='norms-management/gradenorms'
              />
            }
          />
        )}
        {validAdminCreate('norms-management/gradenorms') && (
          <Route
            exact
            path='/admin/norms/gradenorms/add-new-gradenorms'
            element={<PrivateRoute element={<AddNewGradeNorms />} />}
          />
        )}
        {validAdminView('norms-management/gradenorms') && (
          <Route
            exact
            path='/admin/norms/gradenorms/view-gradenorms/:id'
            element={<PrivateRoute element={<ViewGradeNorms />} />}
          />
        )}
        {validAdminUpdate('norms-management/gradenorms') && (
          <Route
            exact
            path='/admin/norms/gradenorms/edit-gradenorms/:id'
            element={<PrivateRoute element={<EditGradeNorms />} />}
          />
        )}

        {/* Test-time norms management */}
        {validAdminList('norms-management/test-time-norms') && (
          <Route
            exact
            path='/admin/norms/test-time-norms'
            element={
              <PrivateRoute
                element={<TestTimeNorms />}
                slug='norms-management/test-time-norms'
              />
            }
          />
        )}
        {validAdminCreate('norms-management/test-time-norms') && (
          <Route
            exact
            path='/admin/norms/test-time-norms/add-new-test-time-norms'
            element={<PrivateRoute element={<AddNewTestTimeNorms />} />}
          />
        )}
        {validAdminView('norms-management/test-time-norms') && (
          <Route
            exact
            path='/admin/norms/test-time-norms/view-test-time-norms/:id'
            element={<PrivateRoute element={<ViewTestTimeNorms />} />}
          />
        )}
        {validAdminUpdate('norms-management/test-time-norms') && (
          <Route
            exact
            path='/admin/norms/test-time-norms/edit-test-time-norms/:id'
            element={<PrivateRoute element={<EditTestTimeNorms />} />}
          />
        )}

        {/* Test descroption norms management */}
        {validAdminList('norms-management/test-description-norms') && (
          <Route
            exact
            path='/admin/norms/test-description-norms'
            element={
              <PrivateRoute
                element={<TestDescriptionNorms />}
                slug='norms-management/test-description-norms'
              />
            }
          />
        )}
        {validAdminCreate('norms-management/test-description-norms') && (
          <Route
            exact
            path='/admin/norms/test-description-norms/add-new-test-description-norms'
            element={<PrivateRoute element={<AddNewTestDescriptionNorms />} />}
          />
        )}
        {validAdminView('norms-management/test-description-norms') && (
          <Route
            exact
            path='/admin/norms/test-description-norms/view-test-description-norms/:id'
            element={<PrivateRoute element={<ViewTestDescriptionNorms />} />}
          />
        )}
        {validAdminUpdate('norms-management/test-description-norms') && (
          <Route
            exact
            path='/admin/norms/test-description-norms/edit-test-description-norms/:id'
            element={<PrivateRoute element={<EditTestDescriptionNorms />} />}
          />
        )}

        <Route
          exact
          path='/counsellor-dashboard'
          element={<PrivateRoute element={<CounsellorDashboard />} />}
        />
        {/* Center Start Pages  */}
        <Route
          exact
          path='/center/forgot-password'
          element={<PublicRoute element={<ForgotPassword />} />}
        />
        <Route
          exact
          path='/center/one-time-password'
          element={<PublicRoute element={<OneTimePassword />} />}
        />
        <Route
          exact
          path='/center/reset-password'
          element={<PublicRoute element={<ResetPassword />} />}
        />
        <Route
          exact
          path='/center/forgot-password'
          element={<PublicRoute element={<ForgotPassword />} />}
        />
        <Route
          exact
          path='/center/one-time-password'
          element={<PublicRoute element={<OneTimePassword />} />}
        />
        <Route
          exact
          path='/center/reset-password'
          element={<PublicRoute element={<ResetPassword />} />}
        />
        <Route
          exact
          path='/counsellor/revenue'
          element={<PrivateRoute element={<RevenueCounsellor />} />}
        />
        <Route
          exact
          path='/counsellor-settings'
          element={<PrivateRoute element={<Settings />} />}
        />
        <Route
          exact
          path='/counsellor/profile'
          element={<PrivateRoute element={<MyProfile />} />}
        />
        <Route
          exact
          path='/counsellor/editprofile'
          element={<PrivateRoute element={<EditMyProfile />} />}
        />
        {/* <Route
          exact
          path='/counsellor/revenue'
          element={<PrivateRoute element={<Revenue />} />}
        /> */}
        {/* Center Start Pages  */}
        {/* Center Start Pages  */}
        <Route
          exact
          path='/center/dashboard'
          element={<PrivateRoute element={<CenterDashboard />} />}
        />
        <Route
          exact
          path='/center/settings/editmyprofile'
          element={<PrivateRoute element={<CenterEditmyprofile />} />}
        />
        <Route
          exact
          path='/center/settings/myprofile'
          element={<PrivateRoute element={<CenterProfile />} />}
        />
        <Route
          exact
          path='/center/settings/myprofile/change-password'
          element={<PrivateRoute element={<ChangePassword />} />}
        />

        {/* Session Admin */}
        {validAdminList('sessions') && (
          <Route
            exact
            path='/admin/sessions'
            element={<PrivateRoute element={<Sessions />} />}
          />
        )}
        <Route
          exact
          path='/admin/session-details'
          element={<PrivateRoute element={<SessionDetail />} />}
        />

        {/* student management */}
        {validAdminList('students-management') && (
          <Route
            exact
            path='/admin/students-management'
            element={
              <PrivateRoute
                element={<StudentsManagement />}
                slug='students-management'
              />
            }
          />
        )}
        {validAdminCreate('students-management') && (
          <Route
            exact
            path='/admin/students-management/add-new-students'
            element={<PrivateRoute element={<AddNewStudents />} />}
          />
        )}
        {validAdminView('students-management') && (
          <Route
            exact
            path='/admin/students-management/view-students/:id'
            element={<PrivateRoute element={<ViewStudents />} />}
          />
        )}
        {validAdminUpdate('students-management') && (
          <Route
            exact
            path='/admin/students-management/edit-students/:id'
            element={<PrivateRoute element={<EditStudents />} />}
          />
        )}

        {/* student management */}
        {validAdminList('center-management') && (
          <Route
            exact
            path='/admin/center-management'
            element={
              <PrivateRoute
                element={<CenterManagement />}
                slug='center-management'
              />
            }
          />
        )}
        {/* Center redeem history */}
        {validAdminList('center-redeem-history') && (
          <Route
            exact
            path='/admin/center-redeem-history'
            element={
              <PrivateRoute
                element={<CenterRedeemHistory />}
                slug='center-management'
              />
            }
          />
        )}
        {validAdminUpdate('center-redeem-history') && (
          <Route
            exact
            path='/admin/center-redeem-history/edit-request/:id'
            element={
              <PrivateRoute
                element={<EditRedeemRequest />}
                slug='center-management'
              />
            }
          />
        )}
        {validAdminList('counsellor-redeem-history') && (
          <Route
            exact
            path='/admin/counsellor-redeem-history'
            element={
              <PrivateRoute
                element={<CenterRedeemHistory />}
                slug='center-management'
              />
            }
          />
        )}
        {validAdminUpdate('counsellor-redeem-history') && (
          <Route
            exact
            path='/admin/counsellor-redeem-history/edit-request/:id'
            element={
              <PrivateRoute
                element={<EditRedeemRequest />}
                slug='center-management'
              />
            }
          />
        )}
        {validAdminCreate('center-management') && (
          <Route
            exact
            path='/admin/center-management/add-new-center'
            element={<PrivateRoute element={<AddNewCenter />} />}
          />
        )}
        {validAdminView('center-management') && (
          <Route
            exact
            path='/admin/center-management/view-center/:id'
            element={<PrivateRoute element={<ViewCenter />} />}
          />
        )}
        {validAdminUpdate('center-management') && (
          <Route
            exact
            path='/admin/center-management/edit-center/:id'
            element={<PrivateRoute element={<EditCenter />} />}
          />
        )}

        {/* center student management */}
        <Route
          exact
          path='/center/students-management'
          element={
            <PrivateRoute
              element={<StudentCenterManagement />}
              slug='students-management'
            />
          }
        />
        <Route
          exact
          path='/center/students-management/add-new-students'
          element={<PrivateRoute element={<AddNewStudentCen />} />}
        />
        <Route
          exact
          path='/center/students-management/view-students/:id'
          element={<PrivateRoute element={<ViewStudentCen />} />}
        />
        <Route
          exact
          path='/center/students-management/edit-students/:id'
          element={<PrivateRoute element={<EditStudentsCen />} />}
          AddNewCounsellor
        />
        {/* center counsellor management */}

        <Route
          exact
          path='/center/counsellor-management'
          element={<PrivateRoute element={<CounsellorManagement />} />}
        />
        <Route
          exact
          path='/center/counsellor-management/add-new-counsellor'
          element={<PrivateRoute element={<AddNewCounsellor />} />}
        />
        <Route
          exact
          path='/center/counsellor-management/edit-counsellor/:id'
          element={<PrivateRoute element={<EditCounsellor />} />}
        />
        <Route
          exact
          path='/center/counsellor-management/view-counsellor/:id'
          element={<PrivateRoute element={<ViewCounsellor />} />}
        />

        {/* Counsellor management admin */}
        {validAdminList('counsellor-management') && (
          <Route
            exact
            path='/admin/counsellor-management'
            element={<PrivateRoute element={<CounsellorManagement />} />}
          />
        )}
        {validAdminCreate('counsellor-management') && (
          <Route
            exact
            path='/admin/counsellor-management/add-new-counsellor'
            element={<PrivateRoute element={<AddNewCounsellor />} />}
          />
        )}
        {validAdminUpdate('counsellor-management') && (
          <Route
            exact
            path='/admin/counsellor-management/edit-counsellor/:id'
            element={<PrivateRoute element={<EditCounsellor />} />}
          />
        )}
        {validAdminView('counsellor-management') && (
          <Route
            exact
            path='/admin/counsellor-management/view-counsellor/:id'
            element={<PrivateRoute element={<ViewCounsellor />} />}
          />
        )}

        {/* Role management */}
        {validAdminList('role-management') && (
          <Route
            exact
            path='/admin/role-management'
            element={
              <PrivateRoute
                element={<RoleManagement />}
                slug='role-management'
              />
            }
          />
        )}
        {validAdminCreate('role-management') && (
          <Route
            exact
            path='/admin/role-management/add-new-role'
            element={
              <PrivateRoute element={<AddNewRole />} slug='role-management' />
            }
          />
        )}
        {validAdminUpdate('role-management') && (
          <Route
            exact
            path='/admin/role-management/edit-role/:id'
            element={
              <PrivateRoute element={<EditRole />} slug='role-management' />
            }
          />
        )}
        {validAdminView('role-management') && (
          <Route
            exact
            path='/admin/role-management/view-role/:id'
            element={
              <PrivateRoute element={<ViewRole />} slug='role-management' />
            }
          />
        )}

        {/* Subadmin management */}
        {validAdminList('sub-admin-management') && (
          <Route
            exact
            path='/admin/sub-admin-management'
            element={
              <PrivateRoute
                element={<SubAdminManagement />}
                slug='sub-admin-management'
              />
            }
          />
        )}
        {validAdminCreate('sub-admin-management') && (
          <Route
            exact
            path='/admin/sub-admin-management/add-new-sub-admin'
            element={
              <PrivateRoute
                element={<AddNewSubAdmin />}
                slug='sub-admin-management'
              />
            }
          />
        )}
        {validAdminUpdate('sub-admin-management') && (
          <Route
            exact
            path='/admin/sub-admin-management/edit-sub-admin/:id'
            element={
              <PrivateRoute
                element={<EditSubAdmin />}
                slug='sub-admin-management'
              />
            }
          />
        )}
        {validAdminView('sub-admin-management') && (
          <Route
            exact
            path='/admin/sub-admin-management/view-sub-admin/:id'
            element={
              <PrivateRoute
                element={<ViewSubAdmin />}
                slug='sub-admin-management'
              />
            }
          />
        )}

        {/* Center Ended Pages  */}
        <Route
          exact
          path='/no-slots-set'
          element={<PrivateRoute element={<NoSlotsSet />} />}
        />
        <Route
          exact
          path='/cousellor/availability'
          element={<PrivateRoute element={<Availability />} />}
        />
        <Route
          exact
          path='/cousellor/view-availability'
          element={<PrivateRoute element={<ViewAvailable />} />}
        />
        <Route
          exact
          path='/cousellor/edit-availability'
          element={<PrivateRoute element={<EditAvailable />} />}
        />
        <Route
          exact
          path='/cousellor/set-availability'
          element={<PrivateRoute element={<SetAvailability />} />}
        />
        <Route
          exact
          path='/counsellor/session'
          element={<PrivateRoute element={<Session />} />}
        />
        <Route
          exact
          path='/cousellor/session-details'
          element={<PrivateRoute element={<SessionDetails />} />}
        />
        <Route
          exact
          path='/cousellor/cancel-session-details'
          element={<PrivateRoute element={<CancelSessionDetails />} />}
        />
        <Route
          exact
          path='/cousellor/reschedule-session-details'
          element={<PrivateRoute element={<RescheduleSessionDetails />} />}
        />
        <Route
          exact
          path='/counsellor/view-redeem-req-detail/:id'
          element={<PrivateRoute element={<ViewRedeemDetailCounsellor />} />}
        />
        {/* software matrix */}
        {validAdminList('software-matrix') && (
          <Route
            exact
            path='/admin/software-matrix'
            element={
              <PrivateRoute
                element={<SoftwareMatrix />}
                slug='software-matrix'
              />
            }
          />
        )}
        {validAdminCreate('software-matrix') && (
          <Route
            exact
            path='/admin/software-matrix/add-new-softwarematrix'
            element={
              <PrivateRoute
                element={<AddNewSoftwareMatrix />}
                slug='software-matrix'
              />
            }
          />
        )}
        {validAdminUpdate('software-matrix') && (
          <Route
            exact
            path='/admin/software-matrix/edit-softwarematrix/:id'
            element={
              <PrivateRoute
                element={<EditSoftwareMatrix />}
                slug='software-matrix'
              />
            }
          />
        )}
        {validAdminView('software-matrix') && (
          <Route
            exact
            path='/admin/software-matrix/view-softwarematrix/:id'
            element={
              <PrivateRoute
                element={<ViewSoftwareMatrix />}
                slug='software-matrix'
              />
            }
          />
        )}

        {/* career Profile */}
        {validAdminList('career-profile') && (
          <Route
            exact
            path='/admin/career-profile'
            element={
              <PrivateRoute element={<CareerProfile />} slug='career-profile' />
            }
          />
        )}
        {validAdminCreate('career-profile') && (
          <Route
            exact
            path='/admin/career-profile/add-new-career-profile'
            element={
              <PrivateRoute
                element={<AddNewCareerProfile />}
                slug='career-profile'
              />
            }
          />
        )}
        {validAdminUpdate('career-profile') && (
          <Route
            exact
            path='/admin/career-profile/edit-career-profile/:id'
            element={
              <PrivateRoute
                element={<EditCareerProfile />}
                slug='career-profile'
              />
            }
          />
        )}
        {validAdminView('career-profile') && (
          <Route
            exact
            path='/admin/career-profile/view-career-profile/:id'
            element={
              <PrivateRoute
                element={<ViewCareerProfile />}
                slug='career-profile'
              />
            }
          />
        )}

        {/* Coupon-code */}
        {validAdminList('coupon-codes') && (
          <Route
            exact
            path='/admin/coupon-codes'
            element={<PrivateRoute element={<Coupons />} slug='' />}
          />
        )}
        {validAdminUpdate('coupon-codes') && (
          <Route
            exact
            path='/admin/coupon-codes/edit-coupon-code/:id'
            element={<PrivateRoute element={<EditCoupon />} slug='' />}
          />
        )}
        {validAdminView('coupon-codes') && (
          <Route
            exact
            path='/admin/coupon-codes/view-coupon-code/:id'
            element={<PrivateRoute element={<ViewCoupon />} slug='' />}
          />
        )}
        {validAdminCreate('coupon-codes') && (
          <Route
            exact
            path='/admin/coupon-codes/add-coupon-code'
            element={<PrivateRoute element={<AddNewCoupen />} slug='' />}
          />
        )}

        {/* Center session management */}
        <Route
          exact
          path='/center/sessions'
          element={<PrivateRoute element={<Sessions />} />}
        />
        <Route
          exact
          path='/center/session-details'
          element={<PrivateRoute element={<SessionDetail />} />}
        />

        {/* licensepurchase Center */}
        <Route
          exact
          path='/center/purchase-license'
          element={<PrivateRoute element={<PurchaseLicense />} />}
        />
        <Route
          exact
          path='/center/purchase-license/purchase-history'
          element={<PrivateRoute element={<PurchaseHistory />} />}
        />
        <Route
          exact
          path='/center/payment-form'
          element={<PrivateRoute element={<PaymentForm />} />}
        />
        <Route
          exact
          path='/center/thank-you'
          element={<PrivateRoute element={<Congratulations />} />}
        />
        <Route
          exact
          path='/center/payment-fail'
          element={<PrivateRoute element={<FailPayment />} />}
        />
        <Route
          exact
          path='/center/purchase-license/purchase-credit'
          element={<PrivateRoute element={<PurchaseCredit />} />}
        />
        <Route
          exact
          path='/center/revenue'
          element={<PrivateRoute element={<RevenueCenter />} />}
        />
        <Route
          exact
          path='/center/view-redeem-req-detail/:id'
          element={<PrivateRoute element={<ViewRedeemDetail />} />}
        />

        {/* </Routes> */}
        <Route
          exact
          path='/admin/settings'
          element={<PrivateRoute element={<Settings />} />}
        />
        <Route
          exact
          path='/admin/settings/myprofile'
          element={<PrivateRoute element={<AdminProfile />} />}
        />
        <Route
          exact
          path='/admin/settings/myprofile/change-password'
          element={<PrivateRoute element={<ChangePassword />} />}
        />
        <Route
          exact
          path='/admin/settings/my-profile/editmyprofile'
          element={<PrivateRoute element={<EditmyprofileAdmin />} />}
        />
      </Routes>
    </>
  )
}
export default RoutesFile
