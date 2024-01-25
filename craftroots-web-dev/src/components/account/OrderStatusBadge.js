import { memo } from 'react'
import PropTypes from 'prop-types'
import { STATUS_MAPPINGS } from '@/helper/account-helper'

function OrderStatusBadge({ className, status }) {
  const statusMapping = STATUS_MAPPINGS[status]
  if (!statusMapping) {
    return null
  }
  const { icon: StatusIcon, name, colorClass } = statusMapping
  return (
    <span className={`flex gap-2 items-center ${colorClass} ${className}`}>
      <StatusIcon size="15" />
      <span className="text-base font-medium">{name}</span>
    </span>
  )
}

OrderStatusBadge.propTypes = {
  className: PropTypes.string,
  status: PropTypes.string.isRequired,
}

OrderStatusBadge.defaultProps = {
  className: '',
}

export default memo(OrderStatusBadge)
