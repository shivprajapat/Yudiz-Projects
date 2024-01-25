import React from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import PropTypes from 'prop-types'

const ToolTip = ({ children, toolTipMessage, position, disable, isSideMenu }) => {
  const renderTooltip = (message) => (
    <Tooltip className='' id='button-tooltip'>
      {message}
    </Tooltip>
  )
  return (
    <>
      <OverlayTrigger placement={position || 'top'} overlay={(isSideMenu && !disable) ? <></> : renderTooltip(toolTipMessage)}>
        {children}
      </OverlayTrigger>
    </>
  )
}
ToolTip.propTypes = {
  children: PropTypes.node.isRequired,
  toolTipMessage: PropTypes.any,
  position: PropTypes.string,
  disable: PropTypes.bool,
  isSideMenu: PropTypes.bool
}
export default ToolTip
