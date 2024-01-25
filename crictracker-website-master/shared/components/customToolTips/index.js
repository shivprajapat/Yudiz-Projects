import PropTypes from 'prop-types'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'

import style from './style.module.scss'

function CustomToolTip({ children, tooltip, position }) {
  return (
    <OverlayTrigger
      placement={position || 'bottom'}
      delay={{ show: 200, hide: 200 }}
      overlay={(props) => (
        <Tooltip id="button-tooltip" className={`${style.tooltipText} position-absolute xsmall-text mt-2 py-1 px-2 br-sm d-none d-lg-block`} {...props}>
          {tooltip}
        </Tooltip>
      )}
    >
      {children}
    </OverlayTrigger>
  )
}

CustomToolTip.propTypes = {
  tooltip: PropTypes.string.isRequired,
  children: PropTypes.any.isRequired,
  position: PropTypes.string
}
export default CustomToolTip
