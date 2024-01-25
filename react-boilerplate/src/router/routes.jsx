import React from 'react'

import { allRoutes } from 'shared/constants/allRoutes'

const Login = React.lazy(() => import('views/login'))
const Dashboard = React.lazy(() => import('views/dashboard'))

const routes = [
  {
    path: '',
    key: 'public',
    isRequiredLoggedIn: false,
    children: [{ path: allRoutes.login, component: Login, exact: true }]
  },
  {
    path: '',
    key: 'private',
    isRequiredLoggedIn: true,
    children: [{ path: allRoutes.dashboard, component: Dashboard, exact: true }]
  }
]

export default routes
