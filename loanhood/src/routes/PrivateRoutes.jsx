import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

const MainLayout = React.lazy(() => import('layout/main-layout'))

function PrivateRoutes({ isAuthenticated, component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => (isAuthenticated ? <MainLayout {...props} childComponent={<Component {...props} />} /> : <Redirect to={'/'} />)}
    />
  )
}

PrivateRoutes.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  component: PropTypes.elementType.isRequired
}

const mapStateToProps = (state) => ({
  isAuthenticated: !!localStorage.getItem('userToken')
})

export default connect(mapStateToProps, null, null, { pure: false })(PrivateRoutes)
