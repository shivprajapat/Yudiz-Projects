import React from 'react'
import PropTypes from 'prop-types'

const SkeletonOrderDetails = ({ width, height }) => {
  return (
    <div className="p-3" style={{ width, height }}>
      <div className="mt-4">
        <div className="animate-pulse h-6 w-full bg-slate-200 rounded"></div>
        <div className="animate-pulse h-6 w-full bg-slate-200 rounded"></div>
      </div>
      <div className="mt-4 mb-4">
        <div className="animate-pulse h-[400px] w-full bg-slate-200 rounded"></div>
      </div>
    </div>
  )
}

export default SkeletonOrderDetails

SkeletonOrderDetails.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}
