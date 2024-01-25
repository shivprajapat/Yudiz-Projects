import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

import { allRoutes } from 'shared/constants/allRoutes'

function Private() {
  const auth = false
  return auth ? <Outlet /> : <Navigate to={allRoutes.home} />
}
export default Private
