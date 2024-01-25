import React, { memo } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import PropTypes from 'prop-types'
import { Button, ReviewProgress, StarRating } from '../generic'

function CustomerReview({ ratingStarCount, totalReviews, totalRating }) {
  const intl = useIntl()
  return (
    <div className="w-full md:w-[45%]">
      <div className="mb-6">
        <h6>
          <FormattedMessage id="page.productDetails.title.customerReview" />
        </h6>
      </div>
      <div>
        <div className="flex items-center gap-2">
          <StarRating totalStars={5} initialRating={Number(totalRating)} />
          <span className="text-grey-800 font-jost text-sm font-medium">
            {`(${totalRating} out of 5)`}
          </span>
        </div>
        <div className="my-5 md:my-7 pb-6 md:pb-10 border-b border-grey-400">
          {Object.keys(ratingStarCount)
            .reverse()
            .map((ratingNumber) => (
              <ReviewProgress
                key={`rating-${ratingNumber}`}
                number={ratingNumber}
                rating={
                  Number(ratingStarCount[ratingNumber] / totalReviews) * 100
                }
                ratingCount={ratingStarCount[ratingNumber]}
              />
            ))}
        </div>
      </div>
      <div>
        <p className="mb-4 md:mb-8 text-grey-900 font-semibold text-base">
          <FormattedMessage id="page.productDetails.title.reviewProduct" />
        </p>
        <Button
          title={intl.formatMessage({
            id: 'button.writeProductReview',
          })}
        />
      </div>
    </div>
  )
}

export default memo(CustomerReview)
CustomerReview.propTypes = {
  ratingStarCount: PropTypes.object.isRequired,
  totalReviews: PropTypes.string.isRequired,
  totalRating: PropTypes.string.isRequired,
}
