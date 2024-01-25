import React from 'react'
import { Redirect, Route, useLocation } from 'react-router-dom'
// import { useHistory } from 'react-router'
import PropTypes from 'prop-types'
import { allRoutes } from 'shared/constants/AllRoutes'
import { clearLocalStorage, getFromLocalStorage } from 'shared/helper/localStorage'
// import Loading from 'shared/components/loading'

const MainLayout = React.lazy(() => import('layouts/main-layout'))

function PrivateRoutes({ component: Component, isAllowedTo, path, roles, ...rest }) {
  const location = useLocation()
  const isAuthenticated = getFromLocalStorage('token')
  const role = getFromLocalStorage('role')

  return (
    <Route
      {...rest}
      render={(props) => {
        if (!isAuthenticated || !role) {
          clearLocalStorage()
          return <Redirect to={{ pathname: allRoutes.login, state: { previousPath: location.pathname } }} />
        } else if (isAuthenticated && roles.includes(role)) {
          return <MainLayout {...props} role={role} childComponent={<Component {...props} userPermission={role}/>} />
        } else {
          return <Redirect to={{ pathname: allRoutes.dashboard, state: { previousPath: location.pathname } }} />
        }
      }}
    />
  )
}

PrivateRoutes.propTypes = {
  component: PropTypes.elementType.isRequired,
  isAllowedTo: PropTypes.string,
  path: PropTypes.string,
  roles: PropTypes.array
}

export default PrivateRoutes
