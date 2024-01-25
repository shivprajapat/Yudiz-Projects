import { useEffect } from 'react'
import Image from 'next/image'
import PropTypes from 'prop-types'
import ProductQuantity from '../../components/generic/ProductQuantity'
import useCart from '@/hooks/useCart'
import { EditProductModal } from '@/components/generic'
import { PRODUCT_TYPE } from '@/helper/constant'
import BtnEditProduct from '@/components/Product/BtnEditProduct'
import BtnDeleteProduct from '@/components/Product/BtnDeleteProduct'
import { stockStatushandler } from '@/helper/product-helper'

const CheckoutProduct = ({ productDetail, isError }) => {
  const {
    removeFromCart,
    UpdateQty,
    handleCartEdit,
    isCartOpen,
    handleCartClose,
    editCartData,
    selectedCartItem,
  } = useCart()

  const outOfStock = stockStatushandler(productDetail)

  useEffect(() => {
    if (
      productDetail &&
      productDetail?.total_qty &&
      productDetail?.quantity > productDetail?.total_qty
    ) {
      UpdateQty(productDetail.id, productDetail.total_qty)
    }
  }, [productDetail])
  return (
    <div
      className={`flex justify-between items-start border-b border-grey-400 py-4 ${
        outOfStock && 'relative'
      }`}
    >
      {outOfStock && <div className="absolute inset-0 opacity-50 bg-white " />}
      <div className="flex gap-4 md:gap-6 w-full sm:w-fit">
        <div className="relative w-16 h-16 sm:w-24 sm:h-24">
          <Image
            src={productDetail?.item_image}
            alt={productDetail?.product?.name}
            className="object-contain"
            quality={100}
            fill
          />
        </div>
        <div className="flex-1">
          <h5 className="font-jost text-sm sm:text-base text-grey-900 font-medium mb-0 sm:mb-1 lg:text-lg">
            {productDetail?.product?.name}
          </h5>
          <div className="mb-1 flex items-center justify-between w-fit gap-2">
            {productDetail?.configurable_options?.map((i, idx) => {
              return (
                <p
                  className="font-jost font-medium text-xs sm:text-sm text-grey-800 flex items-center gap-1"
                  key={i.value_label}
                >
                  <span>{i.value_label}</span>
                  {productDetail?.configurable_options.length - 1 !== idx && (
                    <span className="w-1 block">| </span>
                  )}
                </p>
              )
            })}

            {/* <p className="font-jost text-sm text-grey-800 font-medium capitalize">
              color : Brown
            </p>
            <div className="flex items-center gap-1">
              <span className="text-sm text-grey-800 font-medium">Size :</span>
              <div className="size-option">
                <CustomSelect
                  value={selectedOption}
                  onChange={setSelectedOption}
                  options={sizeOptions}
                  label="xs"
                  classNames={{
                    ...SELECT_CLASSNAMES,
                  }}
                />
              </div>
            </div> */}
          </div>
          <div className="w-full sm:w-24">
            <p className="block sm:hidden mb-4 text-custom-black text-base font-light">
              ₹{productDetail?.prices?.row_total?.value}
            </p>
            <div className="flex justify-between items-center mt-2">
              <div>
                <ProductQuantity
                  small
                  quantity={productDetail?.quantity}
                  UpdateQuantity={UpdateQty}
                  selectedCartItemId={+productDetail?.id}
                  isError={isError}
                  totalQuantiy={productDetail?.total_qty}
                />
                <span className="text-sm font-light block mt-3 text-error font-semibold">
                  {outOfStock && 'Out Of Stock'}
                </span>
              </div>
              <div className="md:hidden flex gap-6 ">
                {PRODUCT_TYPE.configuralProduct.title.includes(
                  productDetail?.product.__typename
                ) && (
                  <BtnEditProduct
                    className="w-4 h-4"
                    handleCartEdit={() => handleCartEdit(productDetail)}
                  />
                )}
                <div className={`${outOfStock && 'relative'}`}>
                  <BtnDeleteProduct
                    className="w-4 h-4"
                    handleRemoveCart={() => removeFromCart(+productDetail?.id)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden sm:flex flex-col justify-between items-end h-24">
        <p className="text-custom-black text-base font-light">
          ₹{productDetail?.prices?.row_total?.value}
        </p>
        <div className="flex gap-4">
          {PRODUCT_TYPE.configuralProduct.title.includes(
            productDetail?.product.__typename
          ) && (
            <BtnEditProduct
              className="w-4 h-4"
              handleCartEdit={() => handleCartEdit(productDetail)}
            />
          )}
          <div className={`${outOfStock && 'relative'}`}>
            <BtnDeleteProduct
              className="w-4 h-4"
              handleRemoveCart={() => removeFromCart(+productDetail?.id)}
            />
          </div>
        </div>
      </div>
      {isCartOpen && Object.keys(editCartData).length > 0 && (
        <EditProductModal
          isShowing={isCartOpen}
          closeConfirm={handleCartClose}
          editCartItem={editCartData}
          selectedCartItem={selectedCartItem}
          UpdateQty={UpdateQty}
          RemoveFromCart={removeFromCart}
        />
      )}
    </div>
  )
}

export default CheckoutProduct

CheckoutProduct.propTypes = {
  productDetail: PropTypes.object,
  isError: PropTypes.bool,
}
