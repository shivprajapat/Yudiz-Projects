import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Wrapper from 'Components/Wrapper'
import { setLoginStatus } from 'Redux/Actions/AuthAction'
import { clearBreadCrumb } from 'Redux/Actions/BreadCrumbAction'

function PrivateRoute() {
  const dispatch = useDispatch()
  const location = useLocation()

  const isUserLoggedIn = useSelector((state) => state.auth.isUserLoggedIn)
  const resultIsUserLoggedIn = localStorage.getItem('isUserLoggedIn')

  useEffect(() => {
    dispatch(clearBreadCrumb())
  }, [location.pathname, dispatch])

  if (!isUserLoggedIn && resultIsUserLoggedIn !== 'true') {
    dispatch(setLoginStatus(false))
    return <Navigate to='/login' replace />
  } else {
    return (
      <Wrapper>
        <Outlet />
      </Wrapper>
    )
  }
}

PrivateRoute.propTypes = {
  element: PropTypes.element
}

export default PrivateRoute
