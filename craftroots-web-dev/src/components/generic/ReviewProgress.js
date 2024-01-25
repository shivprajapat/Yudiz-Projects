import React from 'react'
import PropTypes from 'prop-types'

const ReviewProgress = ({ number, rating, ratingCount }) => {
  return (
    <div className="flex justify-between mb-2 lg:mb-4 gap-2">
      <span className="text-sm font-medium text-grey-800 w-20">
        {number} Star
      </span>
      <div className="w-full bg-gray-200 rounded-[4px] h-2 lg:h-3">
        <div
          className="bg-secondary-200 h-2 lg:h-3 rounded-full"
          style={{ width: `${rating}%` }}
        />
      </div>
      <span className="text-sm font-medium text-grey-800 w-10">
        {ratingCount}
      </span>
    </div>
  )
}

export default ReviewProgress

ReviewProgress.propTypes = {
  rating: PropTypes.number,
  number: PropTypes.number,
  ratingCount: PropTypes.number,
}
