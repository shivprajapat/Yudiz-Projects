import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { CART_QUERY_PRICES_KEYS } from '@/helper/constant'
import { getSubtotalContent } from '@/helper/product-helper'

function PriceItem({ className, title, value }) {
  return (
    <li
      className={`flex justify-between items-center text-sm font-light text-custom-black ${className}`}
    >
      <span>{title}</span>
      <span>{value}</span>
    </li>
  )
}
PriceItem.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
}
PriceItem.defaultProps = {
  className: '',
}

function SideCartSubTotal({ className }) {
  const { prices, appliedCoupon, storeCreditAmount, shippingAmount } =
    useSelector((state) => state.cartReducer)
  const [subTotaldata, setSubTotaldata] = useState([])
  const intl = useIntl()

  const orderPrices = () => {
    // Create a copy of prices object
    const priceData = prices
    // const shippingAmount = addresses?.[0]?.selected_shipping_method?.amount?.value
    const shipping = shippingAmount?.value
    if (shipping && prices) {
      priceData[CART_QUERY_PRICES_KEYS.shipping.key] = {
        value: shipping,
      }
    }

    if (storeCreditAmount) {
      priceData[CART_QUERY_PRICES_KEYS.storeCredit.key] = {
        value: storeCreditAmount,
      }
    }
    const data = getSubtotalContent(priceData, appliedCoupon)
    setSubTotaldata(data)
  }

  useEffect(orderPrices, [
    prices,
    storeCreditAmount,
    appliedCoupon,
    shippingAmount,
  ])

  return (
    <div className={className}>
      <ul className="flex flex-col gap-2">
        {subTotaldata?.map((priceData) => (
          <PriceItem
            key={priceData.intlID}
            className={
              priceData.intlID === CART_QUERY_PRICES_KEYS.grandTotal.intlID
                ? 'border-t border-grey-400 pt-2 !font-medium'
                : ''
            }
            title={intl.formatMessage({
              id: priceData.intlID,
            })}
            value={priceData.value}
          />
        ))}
      </ul>
      {/* {prices?.discounts && appliedCoupon && (
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-light text-custom-black">
            <FormattedMessage id="page.checkout.checkoutSummary.discount" />
          </span>
          <span className="text-sm font-light text-custom-black">
            ({appliedCoupon}) - ₹{prices?.discounts?.[0]?.amount.value}
          </span>
        </div>
      )}
      <div className="flex justify-between items-center">
        <span className="font-medium text-sm text-[#2A2A27]">
          <FormattedMessage id="button.subTotal" />
        </span>
        <span className="font-medium text-sm text-grey-900">
          ₹{prices?.grand_total?.value}
        </span>
      </div> */}
    </div>
  )
}

SideCartSubTotal.propTypes = {
  className: PropTypes.string,
}
SideCartSubTotal.defaultProps = {
  className: '',
}

export default SideCartSubTotal
