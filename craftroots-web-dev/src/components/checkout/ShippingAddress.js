import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useSelector } from 'react-redux'
import CheckoutAddressForm from './CheckoutAddressForm'
import CheckoutPriceItem from './CheckoutSummary/CheckoutPriceItem'
import CheckoutSummaryProductItem from './CheckoutSummary/CheckoutSummaryProductItem'
import ShippingMethod from '@/components/ShippingMethod'
import ShippingGuestForm from '@/components/ShippingGuestForm'
import useGuestAddress from '@/hooks/useGuestAddress'

const ShippingAddress = () => {
  const intl = useIntl()
  const { items, prices, addresses, billingAddress } = useSelector(
    (state) => state.cartReducer
  )
  const { addressHandler, email, setEmail } = useGuestAddress()

  return (
    <>
      <div className="flex gap-8 sm:gap-10 flex-col md:flex-row justify-between">
        <div className="w-full md:w-[50%] lg:w-[60%]">
          <div className="mb-4 md:mb-8">
            <h6 className="font-jost font-semibold text-xl">
              <FormattedMessage id="page.thankYou.shippingAddress" />
            </h6>
          </div>
          <ShippingGuestForm setEmail={setEmail} email={email} />
          <CheckoutAddressForm
            email={email}
            addresses={addresses}
            billingAddress={billingAddress}
          />
          {addresses?.[0]?.available_shipping_methods && <ShippingMethod />}
        </div>
        <div className="w-full md:w-[50%] lg:w-[35%] xl:w-[30%]">
          <div className="mb-3">
            <div className="mb-4 md:mb-8">
              <h6 className="font-jost font-semibold text-xl">
                <FormattedMessage id="page.checkout.title.orderSummary" />
              </h6>
            </div>
            <div className="overflow-hidden">
              {items?.map((i) => {
                return <CheckoutSummaryProductItem key={i.id} item={i} />
              })}
              {/* <button className="flex items-center gap-2 my-6 sm:my-4">
                <span className="text-grey-800 text-sm">
                  <FormattedMessage id="button.loadMore" />
                </span>
                <Image
                  src={iconArrowDown}
                  alt="arrow"
                  className="w-3 h-3 mt-[3px]"
                />
              </button> */}
              <CheckoutPriceItem
                padding
                prices={prices}
                btnTitle={intl.formatMessage({
                  id: 'button.continue',
                })}
                onCheckoutClick={addressHandler}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ShippingAddress
