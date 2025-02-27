import React, { useEffect, useState } from 'react'
import { Redirect, Route, useLocation } from 'react-router-dom'
import { useHistory } from 'react-router'
import PropTypes from 'prop-types'
import { allRoutes } from 'shared/constants/AllRoutes'
import { GET_USER_PERMISSION } from 'graph-ql/permission/query'
import { useQuery } from '@apollo/client'
import Loading from 'shared/components/loading'

const MainLayout = React.lazy(() => import('layouts/main-layout'))

function PrivateRoutes({ component: Component, isAllowedTo, ...rest }) {
  const location = useLocation()
  const history = useHistory()
  const [permission, setPermission] = useState([])
  const isAuthenticated = localStorage.getItem('token')
  const { data } = useQuery(GET_USER_PERMISSION)
  useEffect(() => {
    data?.getUserPermissions && setPermission(data.getUserPermissions)
  }, [data])
  return (
    <Route
      {...rest}
      render={(props) => {
        if (permission.length) {
          if (!isAuthenticated) {
            return <Redirect to={{ pathname: allRoutes.login, state: { previousPath: location.pathname } }} />
          }
          if (isAllowedTo && !permission.includes(isAllowedTo)) {
            history.length > 2 ? history.goBack() : window.close()
          } else {
            return <MainLayout {...props} childComponent={<Component {...props} userPermission={permission} />} />
          }
        } else if (!permission.length && !isAuthenticated) {
          return <Redirect to={{ pathname: allRoutes.login, state: { previousPath: location.pathname } }} />
        } else {
          return <MainLayout {...props} childComponent={<Loading {...props} />} />
        }
      }}
    />
  )
}

PrivateRoutes.propTypes = {
  component: PropTypes.elementType.isRequired,
  isAllowedTo: PropTypes.string
}

export default PrivateRoutes
