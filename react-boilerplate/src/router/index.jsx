import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { allRoutes } from 'shared/constants/allRoutes'
import routes from './routes'

const AuthLayout = React.lazy(() => import('layouts/auth-layout'))
const MainLayout = React.lazy(() => import('layouts/main-layout'))

function Router() {
  const isAuthenticated = false
  return (
    <Routes>
      {/* {routes.map((route) => {
        if (route.isRequiredLoggedIn) {
          if (isAuthenticated) {
        })         */}
      {/* <Route path={allRoutes.home} element={<Public />}>
        <Route path="" element={<Login />} />
      </Route>
      <Route path={allRoutes.dashboard} element={<Private />}>
        <Route path="" element={<Dashboard />} />
      </Route> */}

      {routes.map((route) => {
        return route.children.map((child) => {
          if (route.isRequiredLoggedIn) {
            return (
              <Route
                key={child.path}
                path={child.path}
                exact={child.exact}
                element={!isAuthenticated ? <Navigate to={allRoutes.login} /> : <MainLayout childComponent={<child.component />} />}
              />
            )
          } else {
            return (
              <Route
                key={child.path}
                path={child.path}
                exact={child.exact}
                element={isAuthenticated ? <Navigate to={allRoutes.dashboard} /> : <AuthLayout childComponent={<child.component />} />}
              />
            )
          }
        })
      })}

      <Route path="*" element={<Navigate to={allRoutes.login} />} />
    </Routes>
  )
}
export default Router
