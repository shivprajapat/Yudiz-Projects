import React, { memo } from 'react'
import PropTypes from 'prop-types'

import StarRating from './StarRating'
import NextImage from './NextImage'

const ONE_STAR_RATING = 20
const TOTAL_STARS = 5

const ReviewCard = ({ name, detail, productImg, createdAt, rating }) => {
  return (
    <div className="border border-grey-400 p-4 mb-4 last:mb-4">
      <div>
        <div className="flex justify-between items-center mb-1">
          <p className="text-grey-900 text-base font-semibold">{name}</p>
          <span className="text-grey-500 text-sm font-semibold">
            {createdAt}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <StarRating
            totalStars={TOTAL_STARS}
            initialRating={Number(rating / ONE_STAR_RATING)}
          />
          <span className="text-grey-800 font-jost text-sm font-medium">
            {`${Number(rating / ONE_STAR_RATING)}/${TOTAL_STARS}`}
          </span>
        </div>
      </div>
      <div>
        <p className="text-grey-800 text-sm font-normal py-3">{detail}</p>
        {productImg && (
          <NextImage
            src={productImg}
            alt="admin"
            width={50}
            height={50}
            className="w-[60px] h-[70px] object-cover object-top"
          />
        )}
      </div>
    </div>
  )
}

export default memo(ReviewCard)
ReviewCard.propTypes = {
  name: PropTypes.string.isRequired,
  detail: PropTypes.string.isRequired,
  productImg: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  rating: PropTypes.string,
}
ReviewCard.defaulProptypes = {
  rating: 0,
}
