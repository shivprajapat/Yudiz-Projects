import React from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import MainLayout from '../MainLayout/MainLayout'

function PrivateRoute ({ element: Component }) {
  const token = localStorage.getItem('token')
  const navigate = useNavigate()
  if (!token) {
    return setTimeout(() => {
      navigate('/login')
      localStorage.clear()
    }, 500)
  }
  return <MainLayout>{Component}</MainLayout>
}
PrivateRoute.propTypes = {
  element: PropTypes.element
}

export default PrivateRoute
