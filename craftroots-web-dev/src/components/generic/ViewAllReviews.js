import React, { memo } from 'react'
import Image from 'next/image'
import PropTypes from 'prop-types'

import { iconAngleRight } from '@/assets/images'

const ViewAllReviews = ({ totalReviews }) => {
  return (
    <button type="button" className="flex gap-2 items-center">
      <p className="text-grey-800 text-sm font-normal hover:text-primary">
        {`View All ${totalReviews} Reviews`}
      </p>
      <Image src={iconAngleRight} alt="iconAngleRight" className="w-4" />
    </button>
  )
}

export default memo(ViewAllReviews)
ViewAllReviews.propTypes = {
  totalReviews: PropTypes.string.isRequired,
}
