import React from 'react'
import PropTypes from 'prop-types'

function AuthLayout({ childComponent }) {
  return (
    <div>
      <h1>AuthLayout</h1>
      {childComponent}
    </div>
  )
}
AuthLayout.propTypes = {
  childComponent: PropTypes.node.isRequired
}
export default AuthLayout
