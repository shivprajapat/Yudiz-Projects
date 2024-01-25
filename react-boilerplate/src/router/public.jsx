import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

import { allRoutes } from 'shared/constants/allRoutes'

function Public() {
  const auth = false
  return auth ? <Navigate to={allRoutes.dashboard} /> : <Outlet />
}
export default Public
