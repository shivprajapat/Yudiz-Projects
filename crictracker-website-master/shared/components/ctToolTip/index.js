import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'

import { getDeviceInfo } from '@shared/libs/menu'

const CustomToolTip = dynamic(() => import('@shared/components/customToolTips'))

const CtToolTip = ({ children, tooltip, position }) => {
  const device = getDeviceInfo()

  if (device?.isMobile) {
    return children
  } else {
    return <CustomToolTip tooltip={tooltip} position={position}>{children}</CustomToolTip>
  }
}

CtToolTip.propTypes = {
  tooltip: PropTypes.string.isRequired,
  children: PropTypes.any.isRequired,
  position: PropTypes.string
}
export default CtToolTip
