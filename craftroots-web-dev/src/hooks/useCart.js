import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import useAsync from './useAsync'
import { RemoveItemCart, UpdateItemQty } from '@/queries/cartQueries'
import { request } from '@/services/api.service'
import { ProductDetail } from '@/queries'
import { STORAGE_KEYS } from '@/helper/constant'
import {
  checkAndSetShippingMethod,
  clearUpdateCart,
  miniCartAction,
  setMiniCartData,
  setPrices,
  setShippingMethod,
  // setShippingMethod,
  updateCartAction,
} from '@/actions/cartAction'
import { removeStoreCreditAction } from '@/helper'

export default function useCart() {
  const dispatch = useDispatch()
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [editCartData, setEditCartData] = useState({})
  const [selectedCartItem, setSelectedCartItem] = useState({})
  const getCartItemData = useAsync(null, null)
  const removeCredits = useAsync(null, null)

  const removeFromCart = async (id) => {
    try {
      dispatch(
        updateCartAction({
          updateCartLoading: true,
          isUpdateCartSuccess: false,
        })
      )
      const result = await request({
        ...RemoveItemCart,
        variables: {
          cart_id: localStorage.getItem(STORAGE_KEYS.cartId),
          cart_item_id: id,
        },
      })
      dispatch(
        setMiniCartData({
          items: result?.removeItemFromCart?.cart?.items,
          totalItems: result?.removeItemFromCart?.cart?.total_quantity,
          prices: result?.removeItemFromCart?.cart?.prices,
          appliedCoupon:
            result?.removeItemFromCart?.cart?.applied_coupons?.[0]?.code ||
            null,
          paymentMethods:
            result?.removeItemFromCart?.cart?.available_payment_methods,
          storeCreditAmount:
            result?.removeItemFromCart?.storecredit_applied
              ?.base_bss_storecredit_amount || null,
        })
      )
      dispatch(
        miniCartAction({
          isLoading: false,
          isError: false,
          isSuccess: true,
        })
      )
      const cartData = result?.removeItemFromCart?.cart

      //setshipping methods if address is present in cart
      if (cartData?.items?.length) {
        dispatch(checkAndSetShippingMethod(result?.removeItemFromCart?.cart))
      } else {
        // 1. if cart is empty then we need to set redux state shippingzmethod to empty
        // 2. remove applied store credits if any applied
        // 3. set Prices
        dispatch(setShippingMethod([]))
        dispatch(setPrices(result?.removeItemFromCart?.cart))
        if (cartData?.storecredit_applied?.base_bss_storecredit_amount) {
          removeStoreCreditAction(removeCredits)
        }
      }
    } catch (err) {
      console.log('err', err)
      dispatch(
        miniCartAction({
          isLoading: false,
          isError: true,
        })
      )
      dispatch(clearUpdateCart())
    }
  }

  const UpdateQty = async (id, quantity) => {
    try {
      dispatch(
        updateCartAction({
          updateCartLoading: true,
          isUpdateCartSuccess: false,
        })
      )
      const result = await request({
        ...UpdateItemQty,
        variables: {
          cart_id: localStorage.getItem(STORAGE_KEYS.cartId),
          cart_item_id: id,
          quantity: quantity,
        },
      })
      const cartData = result?.updateCartItems?.cart
      dispatch(checkAndSetShippingMethod(cartData))
      dispatch(
        setMiniCartData({
          items: cartData?.items,
          totalItems: cartData?.total_quantity,
          prices: cartData?.prices,
          appliedCoupon: cartData?.applied_coupons?.[0]?.code || null,
          paymentMethods: cartData?.available_payment_methods,
          storeCreditAmount:
            cartData?.storecredit_applied?.base_bss_storecredit_amount || null,
        })
      )
    } catch (err) {
      console.log('err', err)
      dispatch(
        miniCartAction({
          isLoading: false,
          isError: true,
        })
      )
      dispatch(clearUpdateCart())
    }
  }

  const handleCartClose = () => {
    setIsCartOpen(false)
    setEditCartData({})
    getCartItemData?.resetData()
  }
  useEffect(() => {
    if (getCartItemData?.state?.isSuccess) {
      setEditCartData(getCartItemData?.state?.data)
    }
  }, [getCartItemData?.state?.isSuccess])

  const handleCartEdit = async (item) => {
    dispatch(clearUpdateCart())
    setIsCartOpen(true)
    setSelectedCartItem(item)
    getCartItemData.run(request, {
      ...ProductDetail,
      variables: { url_key: item.product.url_key },
    })
  }

  return {
    removeFromCart,
    UpdateQty,
    handleCartEdit,
    isCartOpen,
    handleCartClose,
    editCartData,
    selectedCartItem,
    setSelectedCartItem,
    editCartLoading: getCartItemData.state.isLoading,
  }
}
