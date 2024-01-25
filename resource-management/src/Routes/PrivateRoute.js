import React from 'react'
import PropTypes from 'prop-types'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import MainLayout from '../Layout/MainLayout'
import { navTo } from 'helpers/helper'

function PrivateRoute() {
  const navigate = useNavigate()
  function setNav() {
    navTo(navigate)
  }
  const token = localStorage.getItem('token') || sessionStorage.getItem('token')
  if (!token) return <Navigate to="/login" replace />
  return (
    <MainLayout>
      {setNav()}
      <Outlet />
    </MainLayout>
  )
}
PrivateRoute.propTypes = {
  element: PropTypes.element,
}

export default PrivateRoute
