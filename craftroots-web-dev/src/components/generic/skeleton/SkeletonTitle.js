import React from 'react'
import PropTypes from 'prop-types'

const SkeletonTitle = ({ display }) => {
  const totalRenders = []
  while (totalRenders.length < display) {
    totalRenders.push(totalRenders.length)
  }
  return totalRenders.map((r) => (
    <div key={'skeleton' + r} className="product-item animate-pulse flex-col">
      <div className="animate-pulse bg-slate-200 rounded h-12 block w-[30%] lg:mb-10" />
    </div>
  ))
}

export default SkeletonTitle
SkeletonTitle.propTypes = {
  display: PropTypes.number,
}
SkeletonTitle.defaultProps = {
  display: 1,
}
