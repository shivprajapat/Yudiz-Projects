import React from 'react'
import { useIntl } from 'react-intl'
import PropTypes from 'prop-types'

import { Controller, useForm } from 'react-hook-form'
import Price from '../Price'
import Button from '../Button'
import ProductQuantity from '../ProductQuantity'
import CloseButton from '../CloseButton'
import CustomSelect from '../select/CustomSelect'
import NextImage from '../NextImage'
import SkeletonEditProductModal from '@/components/generic/skeleton/SkeletonEditProductModal'
import useEditCartItem from '@/hooks/useEditCartItem'
import RenderProductSize from '@/components/Product/RenderProductSize'
import useModal from '@/hooks/useModal'
import { getColor, getSelectedColor } from '@/helper/product-helper'
import { OUT_OF_STOCK } from '@/helper/constant'
import NotifyMe from '@/components/Product/NotifyMe'

const EditProductModal = ({
  closeConfirm,
  isShowing,
  editCartItem,
  selectedCartItem,
  UpdateQty,
  editCartLoading,
}) => {
  const outSideHandler = (e) => {
    e.stopPropagation()
  }
  const {
    editCartStateData,
    handleCloseModal,
    handleSize,
    handleChangeColor,
    mediaGallery,
    selectedQuantity,
    setSelectedQuantity,
    handleEditCart,
    productVariants,
    stockStatus,
  } = useEditCartItem({
    productDetail: editCartItem,
    closeConfirm,
    selectedCartItem,
    UpdateQty,
  })
  const intl = useIntl()
  const { toggle } = useModal
  const { control } = useForm({ mode: 'onChange' })

  const color = getColor(productVariants)
  const extractSelectedColor = getSelectedColor({
    color,
    productState: editCartStateData,
  })
  return (
    <div className={` modal ${isShowing ? 'active' : ''}`}>
      <div className="modal-body" onClick={handleCloseModal} />
      <div className="modal-content">
        <div className="modal-bg">
          <div className="modal-size w-[310px] xs:w-[340px] sm:w-full max-w-[600px]">
            <div onClick={outSideHandler} className="!p-0">
              <CloseButton
                onClick={handleCloseModal}
                className="absolute top-1 right-1 z-10 bg-gray-100"
              />
              <div className="w-full md:max-w-full md:flex p-3">
                {editCartLoading ? (
                  <SkeletonEditProductModal />
                ) : (
                  <>
                    <div
                      className={
                        'h-64 sm:h-72 md:h-auto md:w-56 bg-cover overflow-hidden relative min-w-[224px]'
                      }
                    >
                      {mediaGallery?.[0]?.url && (
                        <NextImage
                          src={mediaGallery?.[0]?.url}
                          alt={selectedCartItem?.product?.name}
                          fill
                          className="object-contain render-image-slider"
                        />
                      )}
                    </div>
                    <div className="p-4 pt-6 flex flex-col justify-between leading-normal text-left">
                      <div className="w-full">
                        <h5 className="font-jost text-base sm:text-lg text-grey-900 font-medium mb-2">
                          {selectedCartItem?.product?.name}
                        </h5>
                        <div className="flex items-center justify-between mb-3">
                          <ProductQuantity
                            small
                            quantity={selectedQuantity}
                            selectedCartItemId={+selectedCartItem.id}
                            setSelectedQuantity={setSelectedQuantity}
                            totalQuantiy={selectedCartItem?.total_qty}
                          />
                          <Price
                            price={
                              selectedCartItem?.prices?.price?.value *
                              selectedQuantity
                            }
                            className="!text-sm !font-light text-custom-black"
                          />
                        </div>
                        <div>
                          <h5 className="font-jost text-sm text-grey-900 font-medium mb-1">
                            Colors:
                          </h5>
                          <div className="w-full sm:max-w-[150px]">
                            {/*  <RadioGroup
                          big
                          allColor={editCartStateData?.productVariants?.colors}
                          selectedColor={editCartStateData?.selectedColor}
                          productURLKey={editCartStateData?.data?.[0]?.url_key}
                          name="edit"
                          handleChangeColor={handleChangeColor}
                        /> */}
                            <Controller
                              name="color"
                              control={control}
                              render={({ field: { onChange } }) => (
                                <CustomSelect
                                  id="color"
                                  value={extractSelectedColor}
                                  options={color}
                                  onChange={(e) => {
                                    onChange(e)
                                    handleChangeColor(e.value)
                                  }}
                                />
                              )}
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2 md:justify-start flex-wrap my-4">
                          {editCartStateData?.data?.length > 0 &&
                            editCartStateData?.data?.map((productInfo, idx) => {
                              return (
                                <RenderProductSize
                                  key={productInfo.name + idx}
                                  productInfo={productInfo}
                                  toggle={toggle}
                                  productVariants={
                                    editCartStateData.productVariants
                                  }
                                  selectedSize={editCartStateData?.selectedSize}
                                  selectedColor={
                                    editCartStateData?.selectedColor
                                  }
                                  handleSize={(sizeValueIdx) =>
                                    handleSize(sizeValueIdx)
                                  }
                                />
                              )
                            })}
                        </div>
                        {stockStatus === OUT_OF_STOCK ? (
                          <NotifyMe intl={intl} />
                        ) : (
                          <div
                            className="flex sm:w-fit"
                            onClick={handleEditCart}
                          >
                            <Button
                              fullWidth
                              title={intl.formatMessage({
                                id: 'button.updateItem',
                              })}
                              disabled={editCartStateData.updateCartLoading}
                              btnLoader={editCartStateData.updateCartLoading}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default React.memo(EditProductModal)
EditProductModal.propTypes = {
  closeConfirm: PropTypes.func,
  isShowing: PropTypes.bool,
  editCartItem: PropTypes.object.isRequired,
  selectedCartItem: PropTypes.object.isRequired,
  UpdateQty: PropTypes.func.isRequired,
  editCartLoading: PropTypes.bool.isRequired,
}
