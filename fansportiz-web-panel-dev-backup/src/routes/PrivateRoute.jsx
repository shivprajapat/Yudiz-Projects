import React, { Suspense } from 'react'
import PropTypes from 'prop-types'
import { Navigate } from 'react-router-dom'
import useMaintenanceMode from '../api/settings/queries/useMaintenanceMode'
import Loading from '../component/Loading'

function PrivateRoute ({ element: Component }) {
  const token = localStorage.getItem('Token')
  const { data: Maintenance } = useMaintenanceMode()

  if (Maintenance?.bIsMaintenanceMode) return <Navigate replace to="/maintenance-mode" />
  if (!token) return <Navigate replace to='/login' />
  return (
    <Suspense fallback={<Loading />}>
      <Component />
    </Suspense>
  )
}

PrivateRoute.propTypes = {
  element: PropTypes.element
}

export default PrivateRoute
