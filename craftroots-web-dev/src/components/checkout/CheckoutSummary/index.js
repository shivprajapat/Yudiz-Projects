import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useIntl } from 'react-intl'
import dynamic from 'next/dynamic'
import { useDispatch, useSelector } from 'react-redux'

import { useRouter } from 'next/router'
import CheckoutPriceItem from './CheckoutPriceItem'
import CheckoutSummaryBooking from './CheckoutSummaryBooking'
import {
  applyCouponToCart,
  getCouponCodes,
  removeCouponFromCart,
} from '@/actions/cartAction'
import { outOfStockStatusHandle } from '@/helper'

const ScrollArea = dynamic(() => import('react-scrollbar'), {
  ssr: false,
})
const CheckoutSummary = ({ couponCodes, updateCartLoading }) => {
  const intl = useIntl()
  const router = useRouter()
  const [couponCode, setCouponCode] = useState('')
  const [couponApplied, setCouponApplied] = useState(false)
  const { appliedCoupon, items } = useSelector((state) => state.cartReducer)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getCouponCodes())
  }, [])

  const couponHandler = (code) => {
    if (couponApplied) {
      dispatch(removeCouponFromCart())
    } else {
      dispatch(applyCouponToCart(code))
    }
  }
  useEffect(() => {
    setCouponCode(appliedCoupon || '')
    setCouponApplied(!!appliedCoupon)
  }, [appliedCoupon])

  useEffect(() => {
    if (items?.length > 0) {
      outOfStockStatusHandle(items, dispatch)
    }
  }, [items])

  return (
    <div className="bg-grey-100 p-6">
      <div className="border border-grey-800 mb-4 flex items-center justify-between py-[9px] px-4">
        <input
          type="text"
          className="w-full mr-2 bg-transparent text-grey-700 text-sm font-medium"
          value={couponCode}
          placeholder={intl.formatMessage({
            id: 'page.checkout.checkoutSummary.promoCode',
          })}
          onChange={(e) => setCouponCode(e.target.value)}
          disabled={couponApplied || updateCartLoading}
          maxLength={20}
        />
        <button
          className="text-grey-900 text-sm font-medium"
          onClick={() => couponHandler(couponCode)}
          disabled={!couponCode || updateCartLoading}
        >
          {!couponApplied
            ? intl.formatMessage({
              id: 'apply',
            })
            : intl.formatMessage({
              id: 'couponCodeRemovedMessage',
            })}
        </button>
      </div>
      <div>
        {couponCodes?.length > 0 && (
          <div className="mb-5">
            <ScrollArea>
              {couponCodes.map((code) => {
                return (
                  <CheckoutSummaryBooking
                    key={code.couponCode}
                    code={code}
                    couponHandler={couponHandler}
                  />
                )
              })}
            </ScrollArea>
          </div>
        )}
        <CheckoutPriceItem
          btnTitle={intl.formatMessage({ id: 'button.proceedToCheckout' })}
          onCheckoutClick={() => {
            router.push('/cart/address', undefined, { shallow: true })
          }}
        />
      </div>
    </div>
  )
}

export default CheckoutSummary
CheckoutSummary.propTypes = {
  onNext: PropTypes.func,
  couponCodes: PropTypes.array,
  updateCartLoading: PropTypes.bool,
}

CheckoutSummary.defaultProps = {
  couponCodes: [],
  updateCartLoading: false,
}
