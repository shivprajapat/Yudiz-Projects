import React from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'
import { FormattedMessage } from 'react-intl'
import { iconSizeChart } from '@/assets/images'
import { IN_STOCK, OUT_OF_STOCK, PRODUCT_TYPE } from '@/helper/constant'

function RenderProductSize({
  productInfo,
  toggle,
  productVariants,
  selectedSize,
  handleSize,
  selectedColor,
  sizeChart,
}) {
  return (
    productVariants?.sizes?.length > 0 && (
      <>
        <p className="font-medium text-base mb-2 hidden sm:block">
          Size<span className="text-error">*</span>
        </p>

        <div className="flex items-center w-full mb-2 justify-between sm:hidden">
          <p className="font-medium text-base">
            Size<span className="text-error">*</span>
          </p>
          <button
            className="flex items-center gap-1 ml-auto text-black-400 font-normal text-base"
            onClick={toggle}
          >
            <Image src={iconSizeChart} alt="size chart" />
            <FormattedMessage id="button.sizeChart" />
          </button>
        </div>

        {PRODUCT_TYPE.configuralProduct.title.includes(
          productInfo.__typename
        ) && (
          <div className="flex items-center gap-2 justify-between md:justify-start flex-wrap mb-4 sm:mb-7">
            {productVariants?.sizes?.map((size) => {
              const stockStatus = selectedColor
                ? productVariants?.newImages?.[selectedColor]?.[
                  size?.value_index
                ]?.product?.stock_status_data?.stock_status
                : productVariants?.newImages?.[size?.value_index]?.product
                  ?.stock_status

              return (
                <button
                  className={`size-btn ${
                    selectedSize &&
                    selectedSize.toString() === size.value_index.toString()
                      ? 'active'
                      : ''
                  } ${stockStatus === OUT_OF_STOCK ? 'out-of-stock' : ''}`}
                  disabled={stockStatus !== IN_STOCK}
                  key={size?.value_index}
                  onClick={() => handleSize(size.value_index)}
                >
                  {size?.swatch_data?.value}
                </button>
              )
            })}
            {sizeChart && (
              <button
                className="items-center gap-1 ml-auto md:ml-1 text-black-400 font-normal text-base hidden sm:flex"
                onClick={toggle}
              >
                <Image src={iconSizeChart} alt="size chart" />
                <FormattedMessage id="button.sizeChart" />
              </button>
            )}
          </div>
        )}
      </>
    )
  )
}

export default RenderProductSize
RenderProductSize.propTypes = {
  productInfo: PropTypes.object.isRequired,
  toggle: PropTypes.func.isRequired,
  productVariants: PropTypes.object.isRequired,
  selectedSize: PropTypes.string.isRequired,
  handleSize: PropTypes.func.isRequired,
  selectedColor: PropTypes.string.isRequired,
  sizeChart: PropTypes.bool.isRequired,
}
