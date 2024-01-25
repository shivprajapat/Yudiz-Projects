import React from 'react'
import { Routes as ReactRouter, Route, Navigate } from 'react-router-dom'

import { allRoutes } from 'shared/constants/allRoutes'
import Router from 'routes/Router'
import AuthLayout from 'layouts/auth-layout'
import MainLayout from 'layouts/main-layout'
import useStorageEvents from 'shared/hooks/use-storage-events'
import ScrollToTop from 'shared/components/scroll-to-top'

const Routes = () => {
  const { isAuthenticated } = useStorageEvents()

  return (
    <>
      <ScrollToTop />
      <ReactRouter>
        {Router.map((route) => {
          return route.children.map((child) => {
            if (route.isAuth) {
              return (
                <Route
                  key={child.path}
                  path={child.path}
                  exact={child.exact}
                  element={isAuthenticated ? <Navigate to={allRoutes.home} /> : <AuthLayout childComponent={<child.component />} />}
                />
              )
            } else {
              return (
                <Route path={child.path} exact={child.exact} key={child.path} element={<MainLayout childComponent={<child.component />} />}>
                  {child.isNested && (
                    <>
                      {child.nestedChild.map((nestedChild) => (
                        <Route
                          key={nestedChild.path}
                          path={nestedChild.path}
                          exact={nestedChild.exact}
                          element={<nestedChild.nestedComponent />}
                        />
                      ))}
                      {/* <Route path="" element={<Navigate to={allRoutes.home} />} /> */}
                    </>
                  )}
                </Route>
              )
            }
          })
        })}
        <Route path="/*" element={<Navigate to={allRoutes.home} />} />
      </ReactRouter>
    </>
  )
}
export default React.memo(Routes)
