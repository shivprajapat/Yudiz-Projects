import React from 'react'
import PropTypes from 'prop-types'

const SkeletonBox = ({ display }) => {
  const totalRenders = []
  while (totalRenders.length < display) {
    totalRenders.push(totalRenders.length)
  }
  return totalRenders.map((r) => (
    <div key={'skeleton' + r} className="product-item animate-pulse flex-col">
      <div className="w-full">
        <div className="group block overflow-hidden relative mb-4">
          <div>
            <div className="animate-pulse bg-slate-200 h-[500px] md:h-[300px] xl:h-80 w-full" />
          </div>
        </div>
      </div>
    </div>
  ))
}

export default SkeletonBox
SkeletonBox.propTypes = {
  display: PropTypes.number,
}
SkeletonBox.defaultProps = {
  display: 1,
}
