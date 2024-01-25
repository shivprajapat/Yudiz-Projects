import React from 'react'
import PropTypes from 'prop-types'
import NextImage from '@/components/generic/NextImage'

const CheckoutSummaryProductItem = ({ item }) => {
  return (
    <div className="flex justify-between items-start border-b border-grey-400 py-4">
      <div className="flex gap-2 sm:gap-4 w-full">
        <NextImage
          src={item?.item_image}
          alt="product"
          width={48}
          height={48}
          quality={100}
          className="object-contain "
        />
        <div className="flex flex-1 justify-between flex-col xs:flex-row">
          <div>
            <h5 className="font-jost text-sm text-grey-900 font-medium truncate w-56">
              {item?.product?.name}
            </h5>
            <div className="mb-1 flex items-center gap-8">
              {item?.configurable_options && (
                <div className="flex gap-2">
                  {item?.configurable_options?.map((i, idx) => {
                    return (
                      <p
                        className="font-jost font-medium text-xs sm:text-sm text-grey-800 flex items-center gap-1"
                        key={i.value_label}
                      >
                        <span>{i.value_label}</span>
                        {item?.configurable_options.length - 1 !== idx && (
                          <span className="w-1 block">| </span>
                        )}
                      </p>
                    )
                  })}
                </div>
              )}
              <div className="flex items-center gap-1">
                <span className=" text-grey-800 font-medium text-xs sm:text-sm">
                  Qty:
                </span>
                <div>{item?.quantity}</div>
              </div>
            </div>
          </div>
          <div className="w-fit">
            <p className="block text-custom-black text-sm font-light">
              ₹{item?.prices?.row_total?.value}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
export default CheckoutSummaryProductItem

CheckoutSummaryProductItem.propTypes = {
  item: PropTypes.object.isRequired,
}
