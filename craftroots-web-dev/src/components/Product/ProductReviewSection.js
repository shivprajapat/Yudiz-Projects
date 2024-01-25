import React, { memo, useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import { ReviewCard, ViewAllReviews } from '../generic'
import CustomerReview from './CustomerReview'
import { request } from '@/services/api.service'
import { GetProductReview } from '@/queries'
import { PRODUCT_REVIEW } from '@/helper/constant'

function ProductReviewSection({ intl, productId }) {
  const [productReview, setProductReview] = useState()
  const getProductReview = async () => {
    const productReviewData = await request({
      ...GetProductReview,
      variables: { product_id: productId },
    })
    setProductReview(productReviewData?.productReviews)
  }
  useEffect(() => {
    getProductReview()
  }, [])

  const approvedReviews =
    productReview?.data?.length > 0 &&
    productReview.data.filter((review) =>
      PRODUCT_REVIEW.includes(review.status)
    )
  return (
    productReview?.data?.length > 0 && (
      <>
        <CustomerReview
          intl={intl}
          ratingStarCount={JSON?.parse(productReview?.ratingStarCount)}
          totalReviews={productReview.totalRating}
          totalRating={productReview.totalStarts}
        />
        <div className="w-full md:w-[65%]">
          <div className="mb-6 flex items-center justify-between">
            <h6>
              <FormattedMessage id="page.productDetails.title.review" />
            </h6>
            {productReview?.totalRating > 4 && (
              <div className="block md:hidden">
                <ViewAllReviews totalReviews={productReview?.totalRating} />
              </div>
            )}
          </div>
          {approvedReviews?.length > 0 &&
            approvedReviews.map((review) => {
              const parsedRating = JSON.parse(review.rating)

              const rating =
                parsedRating.length > 0 &&
                parsedRating.find(
                  (ratingPercent) =>
                    PRODUCT_REVIEW.includes(ratingPercent.rating_code) &&
                    ratingPercent
                )?.rating_percent
              return (
                <ReviewCard
                  key={`${review.product_name}-${review.review_id}`}
                  name={review.nickname}
                  detail={review.detail}
                  productImg={review.product_img}
                  createdAt={review.created_at}
                  rating={rating || 0}
                />
              )
            })}
          {productReview?.totalRating > 4 && (
            <div className="hidden md:block">
              <ViewAllReviews totalReviews={productReview?.totalRating} />
            </div>
          )}
        </div>
      </>
    )
  )
}

ProductReviewSection.propTypes = {
  intl: PropTypes.object.isRequired,
  productId: PropTypes.number.isRequired,
}

export default memo(ProductReviewSection)
