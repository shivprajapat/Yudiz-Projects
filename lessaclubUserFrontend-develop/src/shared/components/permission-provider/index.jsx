import React from 'react'
import PropTypes from 'prop-types'

import { GlobalEventsContext } from '../global-events'

function PermissionProvider({ children, isUserOnly }) {
  const {
    state: { profileData }
  } = React.useContext(GlobalEventsContext)

  if (profileData?.role === 'admin') {
    if (isUserOnly) {
      return null
    } else {
      return children
    }
  } else {
    if (isUserOnly) {
      return children
    } else {
      return null
    }
  }
}
PermissionProvider.propTypes = {
  children: PropTypes.node.isRequired,
  isUserOnly: PropTypes.bool
}
export default PermissionProvider
