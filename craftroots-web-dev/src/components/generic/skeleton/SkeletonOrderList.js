import React from 'react'
import PropTypes from 'prop-types'

const SkeletonOrderList = ({ className, width, height }) => {
  return (
    <div className={className} style={{ width, height }}>
      <div className="mb-4">
        <div className="animate-pulse h-6 w-1/2 bg-slate-200 rounded"></div>
        <div className="animate-pulse h-6 w-1/2 bg-slate-200 rounded mt-2"></div>
        <div className="animate-pulse h-6 w-1/2 bg-slate-200 rounded mt-2"></div>
        <div className="animate-pulse h-6 w-1/3 bg-slate-200 rounded mt-2"></div>
      </div>
    </div>
  )
}

export default SkeletonOrderList

SkeletonOrderList.propTypes = {
  className: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

SkeletonOrderList.defaultProps = {
  className: '',
}
