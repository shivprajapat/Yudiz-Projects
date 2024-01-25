import React from 'react'
import { allRoutes } from '../Shared/Constants/AllRoutes'

const Login = React.lazy(() => import('../Views/auth/login'))
const ForgotPassword = React.lazy(() => import('../Views/auth/ForgotPassword'))

const Dashboard = React.lazy(() => import('../Views/auth/ForgotPassword'))

const Router = [
  {
    path: '',
    isRequiredLoggedIn: false,
    children: [
      { path: allRoutes.login, component: Login, exact: true },
      { path: allRoutes.forgotPassword, component: ForgotPassword, exact: true }
    ]
  },
  {
    path: '',
    isRequiredLoggedIn: true,
    children: [
      { path: allRoutes.dashboard, component: Dashboard, exact: true }
    ]
  }
]
export default Router
