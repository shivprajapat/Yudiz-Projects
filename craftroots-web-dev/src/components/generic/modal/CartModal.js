/* eslint-disable unused-imports/no-unused-imports */
import React from 'react'
import { useIntl } from 'react-intl'
import PropTypes from 'prop-types'

import Price from '../Price'
import Button from '../Button'
import ProductQuantity from '../ProductQuantity'
import RadioGroup from '../form/RadioGroup'
import CloseButton from '../CloseButton'
import NextImage from '../NextImage'
import useProductDetail from '@/hooks/useProductDetail'

const CartModal = ({
  closeConfirm,
  isShowing,
  editCartData,
  selectedCartItem,
}) => {
  const intl = useIntl()
  const outSideHandler = (e) => {
    e.stopPropagation()
  }
  const { getVariantData } = useProductDetail({ productDetail: editCartData })
  const { mediaGallery } = getVariantData()

  return (
    <div className={` modal ${isShowing ? 'active' : ''}`}>
      <div className="modal-body" onClick={closeConfirm} />
      <div className="modal-content">
        <div className="modal-bg">
          <div className="modal-size w-96 max-w-full">
            <div onClick={outSideHandler} className="!p-6">
              <div className="flex justify-between items-center border-b border-grey-400 pb-3">
                <h3 className="text-xl tracking-wide font-semibold font-jost text-grey-900">
                  Cart Item
                </h3>
                <CloseButton onClick={closeConfirm} />
              </div>
              <div className="mt-4">
                <div className="relative">
                  <div className="flex items-start gap-3 flex-col xs:flex-row">
                    <div className="relative w-16 h-20 sm:w-20 sm:h-24">
                      <NextImage
                        src={mediaGallery?.[0]?.url}
                        alt="product"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h5 className="font-jost text-sm text-grey-900 font-medium truncate w-48 sm:w-60 mb-2">
                        Ceramic luxury set of 4 with spoons. Ceramic luxury set
                        of 4 with spoons.
                      </h5>
                      <div className="flex items-center justify-between mb-3">
                        <ProductQuantity small />
                        <Price
                          price={selectedCartItem?.prices?.row_total?.value}
                          className="!text-sm !font-light text-custom-black"
                        />
                        {/* <RenderProductPrice productPrices={productPrices} className = '!text-sm !font-light text-custom-black'/> */}
                      </div>
                      <div className="text-left">
                        <h5 className="font-jost text-sm text-grey-900 font-medium mb-1">
                          Colors:
                        </h5>
                        <div className="bg-green-500">
                          <RadioGroup />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 justify-between md:justify-start flex-wrap my-4">
                    <button className="size-btn active">XS</button>
                    <button className="size-btn">s</button>
                    <button className="size-btn">M</button>
                    <button className="size-btn">l</button>
                    <button className="size-btn" disabled>
                      XL
                    </button>
                    <button className="size-btn" disabled>
                      XXL
                    </button>
                  </div>
                  <div>
                    <Button
                      fullWidth
                      title={intl.formatMessage({
                        id: 'button.updateItem',
                      })}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartModal
CartModal.propTypes = {
  closeConfirm: PropTypes.func,
  isShowing: PropTypes.bool,
  editCartData: PropTypes.object.isRequired,
  selectedCartItem: PropTypes.object.isRequired,
}
