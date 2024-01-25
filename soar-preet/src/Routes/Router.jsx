import { lazy } from 'react'
import { route } from 'Constants/AllRoutes'

const PublicRoute = lazy(() => import('./PublicRoutes'))
const PrivateRoute = lazy(() => import('./PrivateRoutes'))

// Public Routes
const Login = lazy(() => import('Views/Login'))

// Private Routes
const AllDashboard = lazy(() => import('Views/AllDashboard'))
const Vulnerability = lazy(() => import('Views/Vulnerability'))
const PatchDashboard = lazy(() => import('Views/Patch'))
const AuditDashboard = lazy(() => import('Views/Audit'))

const RoutesDetails = [
  {
    defaultRoute: '',
    Component: PublicRoute,
    props: {},
    isPrivateRoute: false,
    children: [{ path: route.login, Component: Login, exact: true }]
  },
  {
    defaultRoute: '',
    Component: PrivateRoute,
    props: {},
    isPrivateRoute: true,
    children: [
      { path: route.allDashboard, Component: AllDashboard, exact: true },
      { path: route.vulnerability, Component: Vulnerability, exact: true },
      { path: route.patch, Component: PatchDashboard, exact: true },
      { path: route.audit, Component: AuditDashboard, exact: true }
    ]
  }
]

export default RoutesDetails
