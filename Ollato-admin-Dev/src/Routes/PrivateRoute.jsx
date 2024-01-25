import React from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
// import PageNotFound from '../Components/PageNotFound'
import MainLayout from '../MainLayout/MainLayout'
import ls from 'localstorage-slim'
// import localStorage from 'react-secure-storage'

function PrivateRoute ({ element: Component, slug }) {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const profile = JSON.parse(localStorage.getItem('profile'))
  const adminType = ls.get('admin-type', { decrypt: true, secret: profile?.id })

  if (!token) {
    setTimeout(() => {
      if (adminType === 'super' || adminType === 'sub') {
        navigate('/admin/login')
      } else if (adminType === 'center') {
        navigate('/center/login')
      } else {
        navigate('/counsellor/login')
      }
      localStorage.clear()
    }, 500)
  } else {
    return <MainLayout> {Component} </MainLayout>
  }
}
PrivateRoute.propTypes = {
  element: PropTypes.element,
  slug: PropTypes.string
}

export default PrivateRoute
