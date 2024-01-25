import React from 'react'
import PropTypes from 'prop-types'
import { Badge, Price } from '../generic'

function RenderProductPrice({ productPrices }) {
  const regularPrice = productPrices?.regular || 0
  const discountPrice = productPrices?.discount ? regularPrice : 0
  const productPrice = productPrices?.discount
    ? productPrices?.final
    : regularPrice

  return (
    <>
      {!!discountPrice && (
        <h6>
          <del>
            <Price
              price={regularPrice}
              className="font-jost font-normal text-secondary-700"
            />
            {/* <Price price={regularPrice} className="sm:!text-xl !font-normal" /> */}
          </del>
        </h6>
      )}

      <h6>
        {/* <h6 className="font-jost font-bold text-black-400"> */}
        <Price
          price={productPrice}
          className="font-jost font-bold text-black-400"
        />
      </h6>
      {!!discountPrice && (
        <Badge
          title={productPrices?.discount + '% OFF'}
          className="bg-secondary-200"
        />
      )}
    </>
  )
}

export default RenderProductPrice
RenderProductPrice.propTypes = {
  productPrices: PropTypes.object.isRequired,
}
