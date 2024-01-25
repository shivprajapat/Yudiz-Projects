import React from 'react'
import PropTypes from 'prop-types'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'

function CustomToolTips({ children, tooltip, ...rest }) {
  return (
    <OverlayTrigger overlay={<Tooltip>{tooltip}</Tooltip>} {...rest}>
      {children}
    </OverlayTrigger>
  )
}

CustomToolTips.propTypes = {
  children: PropTypes.node.isRequired,
  tooltip: PropTypes.string
}

export default CustomToolTips
