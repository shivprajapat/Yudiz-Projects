import React from 'react'
import PropTypes from 'prop-types'
import { Outlet } from 'react-router-dom'

function PublicRoute() {
  return (
    <>
      <Outlet />
    </>
  )
}

PublicRoute.propTypes = {
  element: PropTypes.element
}

export default PublicRoute
