import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

const AuthLayout = React.lazy(() => import('layout/auth-layout'))

function PublicRoute({ isAuthenticated, component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? <Redirect to={'/rentals'} /> : <AuthLayout {...props} childComponent={<Component {...props} />} />
      }
    />
  )
}

PublicRoute.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  component: PropTypes.elementType.isRequired
}

const mapStateToProps = (state) => ({
  isAuthenticated: !!localStorage.getItem('userToken')
})

export default connect(mapStateToProps, null, null, { pure: false })(PublicRoute)
