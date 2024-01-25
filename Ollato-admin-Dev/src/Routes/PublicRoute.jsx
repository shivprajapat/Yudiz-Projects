import React from 'react'
import PropTypes from 'prop-types'
import { Navigate } from 'react-router-dom'
import ls from 'localstorage-slim'
// import ls from 'localstorage-slim'
// import localStorage from 'react-secure-storage'

function PublicRoute ({ element: Component }) {
  const token = localStorage.getItem('token')
  // const profile = JSON.parse(localStorage.getItem('profile'))
  // const adminType = ls.get('admin-type', { decrypt: true, secret: profile?.id })
  const profile = JSON.parse(localStorage.getItem('profile'))
  const adminType = ls.get('admin-type', { decrypt: true, secret: profile?.id })
  if (token && adminType === 'super') return <Navigate to='/admin/dashboard' replace />
  else if (token && adminType === 'sub') return <Navigate to='/admin/norms-management' replace />
  else if (token && adminType === 'center') return <Navigate to='/center/dashboard' replace />
  else if (token && adminType === 'counsellor') return <Navigate to='/counsellor-dashboard' replace />
  else { return Component }
}

PublicRoute.propTypes = {
  element: PropTypes.element.isRequired
}
export default PublicRoute
