import React from 'react'
import { connect } from 'react-redux'
import { Route, Redirect, useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'

// Private Route Component

export const PrivateRoute = ({ isAuthenticated, component: Component, ...rest }) => {
  const history = useHistory()
  return <Route
    {...rest}
    // render={props => (isAuthenticated ? <Component {...props} /> : <Redirect to={{ pathname: '/auth/login' }} />)}
    render={(props) => {
      if (isAuthenticated) {
        return <Component {...props} />
      } else {
        return <Redirect to={`/auth/login?redirectTo=${history.location.pathname}`} />
      }
    }}
  />
}

PrivateRoute.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  component: PropTypes.elementType.isRequired
}

const mapStateToProps = state => ({
  isAuthenticated: !!state.auth.token
})

export default connect(mapStateToProps, null, null, { pure: false })(PrivateRoute)
