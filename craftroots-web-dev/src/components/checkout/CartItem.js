import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Price, ProductQuantity } from '../generic'
import BtnEditProduct from '../Product/BtnEditProduct'
import BtnDeleteProduct from '../Product/BtnDeleteProduct'
import { ProductItemPropType } from '../../../lib/PropTypeValues'
import NextImage from '../generic/NextImage'
import {
  getPipelineVariantLabels,
  stockStatushandler,
} from '@/helper/product-helper'
import { PRODUCT_TYPE } from '@/helper/constant'
function CartItem({
  className,
  product,
  onItemEdit,
  onItemDelete,
  updateQuantity,
  isError,
}) {
  const outOfStock = stockStatushandler(product)
  useEffect(() => {
    if (
      product &&
      product?.total_qty &&
      product?.quantity > product?.total_qty
    ) {
      updateQuantity(product.id, product.total_qty)
    }
  }, [product])
  return (
    <div className={`flex ${className} ${outOfStock && 'relative'} `}>
      {outOfStock && <div className="absolute inset-0 opacity-50 bg-white " />}

      <div className="flex justify-between items-start gap-2 sm:gap-4 w-full">
        <div className="flex items-center gap-4">
          <div className="">
            <NextImage
              src={product.item_image}
              alt={product.product.name}
              className="object-cover object-center w-20"
              width={100}
              height={70}
              quality={100}
              // fill
            />
          </div>
          <div>
            <h5
              className="font-jost text-sm text-grey-900 font-medium truncate w-52 mb-2"
              title={product.product.name}
            >
              {product.product.name}
            </h5>

            <div className="flex items-center justify-between">
              <div>
                <ProductQuantity
                  small
                  quantity={product.quantity}
                  UpdateQuantity={updateQuantity}
                  selectedCartItemId={+product.id}
                  isError={isError}
                  totalQuantiy={product?.total_qty}
                />
                <span className="text-sm font-light block mt-3 text-error font-semibold">
                  {outOfStock && 'Out Of Stock'}
                </span>
              </div>
              <Price
                price={product?.prices?.row_total?.value}
                className="!text-sm !font-light text-[#2A2A27]"
              />
            </div>
            <div className="font-medium text-xs text-grey-600 flex items-center mt-2 gap-2 tracking-wide">
              {getPipelineVariantLabels(product?.configurable_options)}
            </div>
          </div>
        </div>
        <div>
          {PRODUCT_TYPE.configuralProduct.title.includes(
            product.product.__typename
          ) && (
            <BtnEditProduct
              className="!w-3.5 h-auto"
              handleCartEdit={() => onItemEdit(product)}
              item={product}
            />
          )}
          <div className={`${outOfStock && 'relative'}`}>
            <BtnDeleteProduct
              className="!w-3.5 h-auto"
              handleRemoveCart={() => onItemDelete(+product.id)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

CartItem.propTypes = {
  product: ProductItemPropType.isRequired,
  className: PropTypes.string,
  onItemEdit: PropTypes.func,
  onItemDelete: PropTypes.func,
  updateQuantity: PropTypes.func,
  isError: PropTypes.bool,
}

CartItem.defaultProps = {
  className: '',
  onItemEdit: () => {},
  onItemDelete: () => {},
  updateQuantity: () => {},
  isError: false,
}

export default CartItem
