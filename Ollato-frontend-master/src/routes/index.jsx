/* eslint-disable no-unused-vars */
import React from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import axios from 'axios'
/* Components */
import PublicRoute from './PublicRoutes'
import PrivateRoutes from './PrivateRoutes'
import { useSnackbar } from 'react-notistack'

import Login from '../Views/auth/login'
import SignUp from '../Views/auth/SignUp'
import EducationDetails from '../Components/Signup/EducationDetails'
import Terms from '../Views/auth/login/Terms'
import PagenotFound from './PageNotFound'
import TestProcess from '../Views/TestProcess'
import Dashboard from '../Views/Dashboard'
import Package from '../Views/Package'
import ThankYou from '../Components/ThankYou'
import Forgot from '../Views/auth/ForgotPassword'
import LoginWithOTP from '../Views/auth/LoginWithOtp'
import OneTimePassword from '../Views/auth/OneTimePassword'
import ResetPassword from '../Views/auth/ResetPassword'
import PackageDetail from '../Views/Package/PackageDetail'
import ActivePackageDetail from '../Views/Package/ActivePackageDetail'
import PackageHistory from '../Views/Package/PackageHistory'
// import TestCategoryDetail from '../Views/TestProcess/TestCategoryDetail'
import TestQuestion from '../Views/TestProcess/TestQuestion'
import InterestTestQuestion from '../Views/TestProcess/InterestQuestionTest'
import Timesup from '../Views/TestProcess/Timesup'
// import Congratulations from '../Views/TestProcess/Congratulations'
import TestCategoryDetails from '../Views/TestProcess/TestCategoryDetail'
import MyProfile from '../Views/Settings/MyProfile'
import ChangePassword from '../Views/Settings/ChangePassword'
import EditMyProfile from '../Views/Settings/EditMyProfile'
import Assessment from '../Views/Assessment'
import TestScore from '../Views/Assessment/TestScore'
import Counselling from '../Views/Counselling'
import SessionHistory from '../Views/Counselling/SessionHistory'
import Reschedule from '../Views/Counselling/Reschedule'
import CancelSession from '../Views/Counselling/CancelSession'
import CounselorDetail from '../Views/Counselling/CounselorDetail'
import Congragualations from '../Views/TestProcess/Congratulations'
import PackDetail from '../Views/Package/AddOnPackageDetail'
import Chart from '../Views/Assessment/graph'
import ViewCounsellor from '../Views/Counselling/ViewCounselor'
import PaymentForm from '../Views/Package/PaymentForm'
import FailPayment from '../Components/FailPayment'
import AddOnPackeges from '../Views/Package/AddOnPackeges'

function RoutesFile () {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  axios.interceptors.response.use(function (response) {
    return response
  }, function (error) {
    if (error.response.status === 401) {
      localStorage.removeItem('token')
      enqueueSnackbar('Authentication Failed! Please login again', {
        variant: 'error',
        autoHide: true,
        hide: 3000
      })
      // window.location = '/'
      navigate('/login')
    } else if (error.toJSON().message === 'Network Error') {
      enqueueSnackbar('No Internet Connection. Please Connect it!', {
        variant: 'error',
        autoHide: true,
        hide: 3000
      })
    } else {
      return Promise.reject(error)
    }
  })
  return (
     <>
    <Routes>
    <Route exact path='*' element={<PagenotFound />} />
        <Route
          exact
          path='/'
          element={<PublicRoute element={<Login />} />}
        />
        <Route
          exact
          path='/login'
          element={<PublicRoute element={<Login />} />}
        />
         <Route
          exact
          path='/terms-condition'
          element={<PublicRoute element={<Terms />} />}
        />
        <Route
          exact
          path='/signup'
          element={<PublicRoute element={<SignUp />} />}
        />
        <Route
          exact
          path='/signup-educationdetails'
          element={<PublicRoute element={<EducationDetails />} />}
        />
        <Route
          exact
          path='/reset-password'
          element={<PublicRoute element={<ResetPassword />} />}
        />
        <Route
          exact
          path='/one-time-password'
          element={<PublicRoute element={<OneTimePassword />} />}
        />
        <Route
          exact
          path='/forgot-password'
          element={<PublicRoute element={<Forgot />} />}
        />
        <Route
          exact
          path='/login-with-otp'
          element={<PublicRoute element={<LoginWithOTP />} />}
        />
        <Route
          exact
          path='/'
          element={<PublicRoute element={<Login />} />}
        />
        <Route
          exact
          path='/dashboard'
          element={<PrivateRoutes element={<Dashboard />} />}
        />
        <Route
          exact
          path='/assetment'
          element={<PrivateRoutes element={<Assessment />} />}
        />
        <Route
          exact
          path='/package'
          element={<PrivateRoutes element={<Package />} />}
        />
         <Route
          exact
          path='/package/add-on-packages'
          element={<PrivateRoutes element={<AddOnPackeges />} />}
        />
          <Route
          exact
          path='/payment-form'
          element={<PrivateRoutes element={<PaymentForm />} />}
        />
        <Route
          exact
          path='/thank-you'
          element={<PrivateRoutes element={<ThankYou />} />}
        />
        <Route
          exact
          path='/payment-fail'
          element={<PrivateRoutes element={<FailPayment />} />}
        />
        <Route
          exact
          path='package/package-detail/:id'
          element={<PrivateRoutes element={<PackageDetail />} />}
        />
        <Route
          exact
          path='/package-detail/active/:id'
          element={<PrivateRoutes element={<PackDetail />} />}
        />
        <Route
          exact
          path='/activepackage-detail'
          element={<PrivateRoutes element={<ActivePackageDetail />} />}
        />
        <Route
          exact
          path='/package-history'
          element={<PrivateRoutes element={<PackageHistory />} />}
        />
        <Route
          exact
          path='/test-process'
          element={<PrivateRoutes element={<TestProcess />} />}
        />
        <Route
          exact
          path='/test-process/test-category-detail/:id'
          element={<PrivateRoutes element={<TestCategoryDetails />} />}
        />
        <Route
          exact
          path='/test-process/test-question/:id'
          element={<PrivateRoutes element={<TestQuestion />} />}
        />
        <Route
          exact
          path='/test-process/test-question/interest-test'
          element={<PrivateRoutes element={<InterestTestQuestion />} />}
        />
        <Route
          exact
          path="/settings/my-profile"
          element={<PrivateRoutes element={<MyProfile />} />}>
        </Route>
        <Route
          exact
          path="/settings/change-password"
          element={<PrivateRoutes element={<ChangePassword />} />}>
        </Route>
        <Route
          exact
          path="/settings/my-profile/editmyprofile"
          element={<PrivateRoutes element={<EditMyProfile />} />}>
        </Route>
        <Route
          exact
          path="/congratulations"
          element={<PrivateRoutes element={<Congragualations />} /> }>
        </Route>
        <Route
          exact
          path="/counselling"
          element={<PrivateRoutes element={<Counselling />} /> }>
        </Route>
        <Route
          exact
          path="/counselling/career"
          element={<PrivateRoutes element={<Counselling />} /> }>
        </Route>
        <Route
          exact
          path="/counselling/over"
          element={<PrivateRoutes element={<Counselling />} /> }>
        </Route>
        <Route
          exact
          path="/counselling/psy"
          element={<PrivateRoutes element={<Counselling />} /> }>
        </Route>
        <Route
          exact
          path="/counselling/expert"
          element={<PrivateRoutes element={<Counselling />} /> }>
        </Route>
        <Route
          exact
          path="/counselling/session-history/:type"
          element={<PrivateRoutes element={<SessionHistory />} /> }>
        </Route>
        <Route
          exact
          path="/counselling/reschedule"
          element={<PrivateRoutes element={<Reschedule />} /> }>
        </Route>
        <Route
          exact
          path="/counselling/cancel-session"
          element={<PrivateRoutes element={<CancelSession />} /> }>
        </Route>
        <Route
          exact
          path="/counselling/counselor-detail/:id"
          element={<PrivateRoutes element={<CounselorDetail />} /> }>
        </Route>
        <Route
          exact
          path="/counselling/session-detail/:id"
          element={<PrivateRoutes element={<ViewCounsellor />} /> }>
        </Route>
        <Route
          exact
          path="/chart"
          element={<PrivateRoutes element={<Chart />} /> }>
        </Route>
      </Routes>
    </>
  )
}
export default RoutesFile
