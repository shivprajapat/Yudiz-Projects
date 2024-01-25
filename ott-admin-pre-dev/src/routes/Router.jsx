import { lazy } from 'react'
import { route } from 'shared/constants/AllRoutes'

const PublicRoute = lazy(() => import('routes/PublicRoutes'))
const PrivateRoute = lazy(() => import('routes/PrivateRoutes'))

// public Routes Files
const Login = lazy(() => import('views/auth/login'))
const ForgotPassword = lazy(() => import('views/auth/forgot-password'))
const ResetPassword = lazy(() => import('views/auth/reset-password'))

// Private Routes Files
const Dashboard = lazy(() => import('views/dashboard'))
const Profile = lazy(() => import('views/profile'))
const Languages = lazy(() => import('views/languages'))
const SubAdmins = lazy(() => import('views/subadmins/sub-admin-list'))
const AddEditSubAdmin = lazy(() => import('views/subadmins/add-edit-subadmin'))
const CustomerManagement = lazy(() => import('views/customerManagement'))
const CustomerView = lazy(() => import('views/customerManagement/view'))
const CategoryManagement = lazy(() => import('views/categoryManagement'))

const RoutesDetails = [
  {
    defaultRoute: '',
    Component: PublicRoute,
    props: {},
    isPrivateRoute: false,
    children: [
      { path: '/login', Component: Login, exact: true },
      { path: route.forgotPassword, Component: ForgotPassword, exact: true },
      { path: route.resetPassword, Component: ResetPassword, exact: true }
    ]
  },
  {
    defaultRoute: '',
    Component: PrivateRoute,
    props: {},
    isPrivateRoute: true,
    children: [
      { path: route.dashboard, Component: Dashboard, exact: true, isOk: 'DASHBOARD' },
      { path: route.editProfile, Component: Profile, exact: true },
      { path: route.subAdmins, Component: SubAdmins, exact: true },
      { path: route.addSubAdmins, Component: AddEditSubAdmin, exact: true },
      { path: route.editSubAdmins(':id'), component: AddEditSubAdmin, exact: true },
      { path: route.languages, Component: Languages, props: {}, children: [], exact: true },
      { path: route.customerManagement, Component: CustomerManagement, exact: true },
      { path: route.customerView(':id'), Component: CustomerView, exact: true },
      { path: route.categoryManagement, Component: CategoryManagement, exact: true }
    ]
  }
]

export default RoutesDetails
