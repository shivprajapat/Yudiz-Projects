import React from 'react'
import PropTypes from 'prop-types'
import { Navigate, Outlet } from 'react-router-dom'
import MainLayout from 'layouts/main-layout'

function PrivateRoute(props) {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token')
  if (!token) return <Navigate to='/login' replace />

  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  )
}
PrivateRoute.propTypes = {
  element: PropTypes.element
}

export default PrivateRoute
