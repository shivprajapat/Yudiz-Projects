import React from 'react'
import { Navigate } from 'react-router-dom'

import { allRoutes } from 'shared/constants/allRoutes'

const WithAuth = (WrappedComponent) => {
  const WithAuthDisplayName = (props) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('userToken')
      if (!token) return <Navigate to={allRoutes.home} />

      return <WrappedComponent {...props} />
    } else return null
  }
  return React.memo(WithAuthDisplayName)
}

export default WithAuth
