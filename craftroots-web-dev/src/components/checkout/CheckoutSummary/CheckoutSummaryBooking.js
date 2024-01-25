import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'

import { useSelector } from 'react-redux'
import Badge from '@/components/generic/Badge'

const CheckoutSummaryBooking = ({ code, couponHandler }) => {
  const { updateCartLoading, appliedCoupon } = useSelector(
    (state) => state.cartReducer
  )
  const [copied, setCopied] = useState(false)
  const copyToClipboard = () => {
    if (
      navigator.clipboard &&
      typeof navigator.clipboard.writeText === 'function'
    ) {
      navigator.clipboard
        .writeText(code?.couponCode)
        .then(() => {
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        })
        .catch((error) => {
          console.error('Error copying to clipboard:', error)
        })
    } else {
      console.error('Clipboard not supported')
    }
  }

  return (
    <div
      className={`border ${
        appliedCoupon !== code?.couponCode
          ? 'border-dashed'
          : 'border-secondary-200'
      } border-grey-500 mb-4 py-[9px] px-4`}
    >
      <div className="mb-2">
        <p className="text-grey-800 text-sm font-medium mb-[2px]">
          {code?.couponTitle}
        </p>
        <p className="text-grey-700 text-sm font-normal">
          {code?.couponDescription}
        </p>
      </div>
      <div className="flex items-center justify-between">
        <button onClick={copyToClipboard}>
          <Badge
            className="border border-secondary-200 text-secondary-200 !font-medium px-3 !text-xs"
            title={code?.couponCode}
          />
        </button>
        {copied && (
          <span className="text-success text-xs font-medium">Copied!</span>
        )}
        <button
          className="text-grey-700 text-sm font-medium"
          disabled={updateCartLoading || appliedCoupon}
          onClick={() => couponHandler(code?.couponCode)}
        >
          <FormattedMessage id="apply" />
        </button>
      </div>
    </div>
  )
}

export default CheckoutSummaryBooking

CheckoutSummaryBooking.propTypes = {
  code: PropTypes.object,
  couponHandler: PropTypes.func.isRequired,
}
