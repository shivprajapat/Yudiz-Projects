import React from 'react'
import { Routes as ReactRouter, Route, Navigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { allRoutes } from 'shared/constants/allRoutes'
import Router from 'routes/Router'
import AuthLayout from 'layouts/auth-layout'
import MainLayout from 'layouts/main-layout'
import ScrollToTop from 'shared/components/scroll-to-top'
import AdminLayout from 'layouts/admin-layout'

const Routes = ({ isAuthenticated }) => {
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
            } else if (route.isAdmin) {
              return (
                <Route
                  key={child.path}
                  path={child.path}
                  exact={child.exact}
                  element={<AdminLayout childComponent={<child.component />} />}
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
                      <Route path="" element={<Navigate to={allRoutes.home} />} />
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

Routes.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired
}

const mapStateToProps = (state) => ({
  isAuthenticated: !!state.user.user
})

export default connect(mapStateToProps, null, null, { pure: false })(Routes)
