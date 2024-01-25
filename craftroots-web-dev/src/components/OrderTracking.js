import React from 'react'
import { FormattedMessage } from 'react-intl'

import Link from 'next/link'
import { IconDelivered } from '@/assets/images'

const OrderTracking = () => {
  return (
    <Link
      href="https://www.shiprocket.in/shipment-tracking/"
      target="_blank"
      className="ease-in-out flex-center duration-300 icon-hover w-8 h-8 rounded-full relative hidden flex-col items-center group cursor-pointer sm:flex"
    >
      <IconDelivered />
      <div className="bg-grey-900 px-2 py-3 -bottom-[55px] absolute flex-col items-center hidden duration-300 ease-in-out group-hover:flex w-64 z-10">
        <span className="relative z-10 font-normal text-white whitespace-no-wrap text-sm">
          <FormattedMessage id="delivered.tooltip.title" />
        </span>
        <div className="tooltip-arrow top-arrow bg-grey-900 top-0 -translate-x-1/2 left-2/4 -translate-y-1/2" />
      </div>
    </Link>
  )
}

export default OrderTracking
