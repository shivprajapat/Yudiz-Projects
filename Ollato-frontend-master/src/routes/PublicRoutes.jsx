import React from 'react'
import PropTypes from 'prop-types'
import { Navigate } from 'react-router-dom'

function PublicRoute ({ element: Component }) {
  const token = localStorage.getItem('token')
  // const location = useLocation()
  // const redirect =
  // location?.pathname === '/login' ? location?.pathname : '/package'
  if (token) return <Navigate to='/package' replace />
  return Component
}

PublicRoute.propTypes = {
  element: PropTypes.element.isRequired
}
export default PublicRoute
