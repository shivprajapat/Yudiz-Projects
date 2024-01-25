import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, useIntl } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import Image from 'next/image'
import { useRouter } from 'next/router'

import dynamic from 'next/dynamic'
import { Button, CardEmpty, EditProductModal } from '../generic'
import SkeletonSideCart from '../generic/skeleton/SkeletonSideCart'
import { iconClose, iconEmptyCart } from '@/assets/images'
import { miniCartData } from '@/actions/cartAction'
import useCart from '@/hooks/useCart'

const CartItem = dynamic(() => import('./CartItem'))
const SideCartSubTotal = dynamic(() => import('./SideCartSubTotal'))

const SideCart = ({ isShowing, toggle }) => {
  const intl = useIntl()
  const router = useRouter()
  const { items, isLoading, updateCartLoading, isError } = useSelector(
    (state) => state.cartReducer
  )

  const dispatch = useDispatch()
  const {
    removeFromCart,
    UpdateQty,
    handleCartEdit,
    isCartOpen,
    handleCartClose,
    editCartData,
    selectedCartItem,
    editCartLoading,
  } = useCart()

  useEffect(() => {
    if (isShowing && items?.length === 0) {
      dispatch(miniCartData())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShowing])

  return (
    <>
      <div>
        <div
          className={`sidebar-left-overlay ${isShowing ? 'active' : ''}`}
          onClick={toggle}
        />
        <div
          className={`justify-between sidebar-left ${
            isShowing ? 'active' : ''
          }`}
        >
          {updateCartLoading && (
            <div className="absolute w-full h-full inset-0 bg-grey-100 opacity-50" />
          )}

          <div className="grow">
            <div className="head">
              <h5>
                <FormattedMessage id="cartSidebar.title" />
              </h5>
              <button type="button" onClick={toggle} className="icon-hover">
                <Image src={iconClose} alt="close" />
              </button>
            </div>
            {items?.length === 0 && !isLoading && (
              <div className="pt-9 sm:pt-12">
                <CardEmpty
                  icon={iconEmptyCart}
                  title={intl.formatMessage({
                    id: 'empty.cart.title',
                  })}
                  description={intl.formatMessage({
                    id: 'empty.cart.description',
                  })}
                />
              </div>
            )}
            <div className="h-[90%] overflow-y-auto remove-scrollbar">
              {isLoading ? (
                <SkeletonSideCart display={4} />
              ) : (
                <>
                  {items?.map((item) => {
                    return (
                      <CartItem
                        key={item.id}
                        className="border-b border-grey-400 py-4"
                        product={item}
                        updateQuantity={UpdateQty}
                        onItemEdit={handleCartEdit}
                        onItemDelete={removeFromCart}
                        isError={isError}
                      />
                    )
                  })}
                </>
              )}
            </div>
          </div>
          {items.length > 0 && (
            <div className="shrink-0">
              {/* <CheckoutPriceItem /> */}
              {/* <div className="bg-grey-100  px-3 py-3 flex justify-between items-center mb-3">
                <span className="font-medium text-sm text-[#2A2A27]">
                  <FormattedMessage id="button.subTotal" />
                </span>
                <span className="font-medium text-sm text-grey-900">
                  ₹{prices?.grand_total?.value}
                </span>
              </div> */}
              <SideCartSubTotal className="bg-grey-100 p-3 mb-3" />
              <div className="mb-3">
                <Button
                  fullWidth
                  border
                  title={intl.formatMessage({
                    id: 'button.viewCart',
                  })}
                  onClick={() => {
                    router.push('/cart')
                    toggle()
                  }}
                />
              </div>
              {/* <div>
                <Button
                  fullWidth
                  type="button"
                  title={intl.formatMessage({
                    id: 'button.checkout',
                  })}
                />
              </div> */}
            </div>
          )}
        </div>
      </div>
      {isCartOpen && (
        <EditProductModal
          isShowing={isCartOpen}
          closeConfirm={handleCartClose}
          editCartItem={editCartData}
          selectedCartItem={selectedCartItem}
          UpdateQty={UpdateQty}
          editCartLoading={editCartLoading}
        />
      )}
    </>
  )
}

export default React.memo(SideCart)
SideCart.propTypes = {
  isShowing: PropTypes.bool,
  toggle: PropTypes.func,
}
