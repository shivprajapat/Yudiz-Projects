import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { removeToken } from 'helpers'

function PublicRoute() {
  const navigate = useNavigate()
  function unauthorized(e) {
    if (e.oldValue !== e.newValue && e.key === 'token') {
      const token = localStorage.getItem('token')
      removeToken(token)
      navigate('/login')
      console.warn('Your token has been changed thats why you are redirected to login page.... XD')
    }
  }
  useEffect(() => {
    window.addEventListener('storage', unauthorized)
    return () => window.removeEventListener('storage', unauthorized)
  }, [])

  // const token = localStorage.getItem('token') || sessionStorage.getItem('token')
  const token = localStorage.getItem('token')
  const location = useLocation()
  const redirect = location?.pathname === '/' ? location?.pathname : '/dashboard'
  if (token) return <Navigate to={redirect} replace />
  return <Outlet />
}

PublicRoute.propTypes = {
  element: PropTypes.element,
}
export default PublicRoute
