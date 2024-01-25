import React from 'react'
import { connect } from 'react-redux'
import { Route, Redirect, useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'
// import { history } from '../App'
import qs from 'query-string'

// Public Route Component

export const PublicRoute = ({ isAuthenticated, component: Component, ...rest }) => {
  const history = useHistory()
  const querySearch = qs.parse(history.location.search)
  const redirectTo =
          history.location.pathname.includes('/auth') || history.location.pathname === '/'
            ? querySearch.redirectTo || '/dashboard'
            : history.location.pathname
  return (
    <Route
      {...rest}
      render={props => (isAuthenticated ? <Redirect to={redirectTo} /> : <Component {...props} />)}
    />
  )
}

PublicRoute.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  component: PropTypes.elementType.isRequired
}

const mapStateToProps = state => ({
  isAuthenticated: !!state.auth.token
})

export default connect(mapStateToProps, null, null, { pure: false })(PublicRoute)
