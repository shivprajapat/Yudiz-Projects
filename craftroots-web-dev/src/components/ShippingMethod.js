import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'

const ShippingMethod = () => {
  const { shippingMethodCart } = useSelector((state) => state.cartReducer)

  return (
    shippingMethodCart?.length > 0 && (
      <div className="mt-6 sm:mt-10 lg:mt-14">
        <div className="mb-4 md:mb-8">
          <h6 className="font-jost font-semibold text-lg sm:text-xl">
            <FormattedMessage id="page.checkout.title.shippingMethod" />
          </h6>
        </div>
        <div className="border border-grey-400 p-4 flex flex-col gap-3 sm:gap-4">
          {shippingMethodCart?.[0]?.carrier_title}
          {/* <Radio
          title="Free Shipping"
          value="freShipping"
          className="text-grey-900 sm:!text-base"
        />
        <Radio
          title="Fixed (₹20)"
          value="fixed"
          className="text-grey-900 sm:!text-base"
        /> */}
        </div>
      </div>
    )
  )
}

export default ShippingMethod
