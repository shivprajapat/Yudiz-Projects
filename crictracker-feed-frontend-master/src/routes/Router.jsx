import React from 'react'
import AddEditClient from 'shared/components/add-edit-client'
import { allRoutes } from 'shared/constants/AllRoutes'
import Analytics from 'views/analytics'
import ClientQuery from 'views/clientQuery'
import Clients from 'views/clients'
import EditProfile from 'views/profile'
import Secrets from 'views/secrets'
import Subscription from 'views/subscription'

const Login = React.lazy(() => import('views/auth/login'))
const ForgotPassword = React.lazy(() => import('views/auth/forgot-password'))
const ResetPassword = React.lazy(() => import('views/auth/reset-password'))

const Dashboard = React.lazy(() => import('views/dashboard'))
const Router = [
  {
    path: '',
    isRequiredLoggedIn: false,
    children: [
      { path: allRoutes.login, component: Login, exact: true },
      { path: allRoutes.admin, component: Login, exact: true },
      { path: allRoutes.forgotPassword, component: ForgotPassword, exact: true },
      { path: allRoutes.resetPassword, component: ResetPassword, exact: true }
    ]
  },
  {
    path: '',
    isRequiredLoggedIn: true,
    children: [
      { path: allRoutes.dashboard, component: Dashboard, exact: true, roles: ['admin', 'client'] },
      { path: allRoutes.editProfile, component: EditProfile, exact: true, roles: ['admin', 'client'] },
      { path: allRoutes.analytics, component: Analytics, exact: true, roles: ['client'] },
      { path: allRoutes.secrets, component: Secrets, exact: true, roles: ['client'] },
      { path: allRoutes.clients, component: Clients, exact: true, roles: ['admin'] },
      { path: allRoutes.addClient, component: AddEditClient, exact: true, roles: ['admin'] },
      { path: allRoutes.editClient(':iClientId'), component: AddEditClient, exact: true, roles: ['admin'] },
      { path: allRoutes.clientAnalytics(':iClientId'), component: Analytics, exact: true, roles: ['admin'] },
      { path: allRoutes.subscription, component: Subscription, exact: true, roles: ['client'] },
      { path: allRoutes.clientQuery, component: ClientQuery, exact: true, roles: ['admin'] }
    ]
  }
]

export default Router
