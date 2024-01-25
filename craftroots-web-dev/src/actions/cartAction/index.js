import { FormattedMessage } from 'react-intl'
import { constants } from '../type'
import { setToastDataAction } from '../toastAction'
import { isLoggedIn } from '@/helper'
import { STORAGE_KEYS } from '@/helper/constant'
import {
  ApplyCouponCode,
  GetAllCouponCodes,
  MiniCart,
  RemoveCouponCode,
} from '@/queries/cartQueries'
import {
  GetAddressses,
  SetBillingAddress,
  SetShippingAddress,
  SetShippingMethod,
} from '@/queries/checkoutQueries'
import { request } from '@/services/api.service'

export const miniCartData = () => async (dispatch) => {
  dispatch(
    miniCartAction({
      isLoading: true,
      isError: false,
      isSuccess: false,
    })
  )
  try {
    const result = await request({
      ...MiniCart,
      variables: {
        cart_id: localStorage.getItem(STORAGE_KEYS.cartId),
      },
    })
    dispatch({
      type: constants.MINI_CART_DATA,
      items: result?.cart?.items,
      totalItems: result?.cart?.total_quantity,
      prices: result?.cart?.prices,
      appliedCoupon: result?.cart?.applied_coupons?.[0]?.code || null,
      paymentMethods: result?.cart?.available_payment_methods,
      addresses: result?.cart?.shipping_addresses,
      storeCreditAmount:
        result?.cart?.storecredit_applied?.base_bss_storecredit_amount,
      // billingAddress: result?.cart?.billing_address,
      email: result?.cart?.email,
      isSuccess: true,
      // sameAddresses: result?.cart?.billing_address?.id !== null ? result?.cart?.same_as_shipping : false,
    })
    if (result?.cart?.items?.length > 0) {
      dispatch(checkAndSetShippingMethod(result?.cart))
    }
    dispatch(shippingAddressAction(result?.cart?.shipping_addresses))
    dispatch(billingAction(result?.cart?.billing_address))
    dispatch(setPrices(result?.cart))
    if (isLoggedIn()) {
      dispatch(setSameAddressAction(result?.cart?.same_as_shipping))
    } else {
      dispatch(setSameAddressAction(result?.cart?.same_as_shipping))
    }
  } catch (error) {
    dispatch(
      miniCartAction({
        isLoading: false,
        isError: true,
        isSuccess: true,
      })
    )
  }
}

export const editCartItemData = (payload) => (dispatch) => {
  if (payload) {
    dispatch({
      type: constants.EDIT_CART_ITEM,
      payload: payload,
    })
    return payload
  }
}

export const editCartColor = (payload) => (dispatch) => {
  if (payload) {
    dispatch({
      type: constants.EDIT_CART_PRODUCT_COLOR,
      payload: payload,
    })
    return payload
  }
}
export const editCartSize = (payload) => (dispatch) => {
  if (payload) {
    dispatch({
      type: constants.EDIT_CART_SELECTED_SIZE,
      payload: payload,
    })
    return payload
  }
}
export const editCartVariant = (payload) => (dispatch) => {
  if (payload) {
    dispatch({
      type: constants.EDIT_CART_PRODUCT_VARIANT,
      payload: payload,
    })
    return payload
  }
}

export const resetEditCartData = () => (dispatch) => {
  dispatch({
    type: constants.RESET_EDIT_CART,
    payload: '',
  })
}

export const getCouponCodes = () => async (dispatch) => {
  try {
    const result = await request({
      ...GetAllCouponCodes,
      variables: {},
    })
    dispatch({
      type: constants.GET_ALL_COUPON_CODES,
      couponCodes: result?.allcouponcodes?.data,
    })
  } catch (e) {
    console.log(e)
  }
}

export const applyCouponToCart = (couponCode) => async (dispatch) => {
  try {
    dispatch(
      updateCartAction({
        updateCartLoading: true,
        isUpdateCartSuccess: false,
      })
    )
    const result = await request({
      ...ApplyCouponCode,
      variables: {
        cart_id: localStorage.getItem(STORAGE_KEYS.cartId),
        coupon_code: couponCode,
      },
    })

    if (result) {
      dispatch(
        updateCartAction({
          isUpdateCartSuccess: true,
          updateCartLoading: false,
        })
      )
      dispatch(miniCartData())
      dispatch(checkAndSetShippingMethod(result?.applyCouponToCart?.cart))
      dispatch(
        setToastDataAction({
          show: true,
          message: <FormattedMessage id="checkout.couponCodeAppliedMessage" />,
        })
      )
    }
  } catch (error) {
    console.log(error)
    dispatch(
      miniCartAction({
        isLoading: false,
        isError: true,
      })
    )
    dispatch(clearUpdateCart())
  }
}

export const removeCouponFromCart = () => async (dispatch) => {
  try {
    /* dispatch(clearUpdateCart({
      updateCartLoading: true,
      isError: false,
      isUpdateCartSuccess: false,
    })) */
    dispatch(
      updateCartAction({
        updateCartLoading: true,
        isUpdateCartSuccess: false,
      })
    )
    const result = await request({
      ...RemoveCouponCode,
      variables: {
        cart_id: localStorage.getItem(STORAGE_KEYS.cartId),
      },
    })
    if (result) {
      dispatch(
        updateCartAction({
          updateCartLoading: false,
          isUpdateCartSuccess: true,
        })
      )
      dispatch(miniCartData())
      dispatch(checkAndSetShippingMethod(result?.removeCouponFromCart?.cart))
    }
  } catch (error) {
    console.log(error)
    dispatch(
      miniCartAction({
        isLoading: false,
        isError: true,
      })
    )
    dispatch(clearUpdateCart())
  }
}

export const setBillingAddress = (address) => async (dispatch) => {
  dispatch(addressLoader(true))
  dispatch(setBillingSaved(false))
  try {
    dispatch({ type: constants.CLEAR_UPDATE_CART_DATA })

    const result = await request({
      ...SetBillingAddress,
      variables: {
        cart_id: localStorage.getItem(STORAGE_KEYS.cartId),
        billing_address: address,
      },
    })
    dispatch(addressLoader(false))
    dispatch(
      billingAction(result?.setBillingAddressOnCart?.cart?.billing_address)
    )
    dispatch(setOrderDetail(result?.setBillingAddressOnCart?.cart))
    // dispatch(
    //   shippingAddressAction(
    //     result?.setBillingAddressOnCart?.cart?.shipping_addresses
    //   )
    // )
    dispatch(setBillingSaved(true))
    // if (isLoggedIn()) {
    // dispatch(
    //   setSameAddressAction(
    //     result?.setBillingAddressOnCart?.cart?.billing_address?.id
    //       ? result?.setBillingAddressOnCart?.cart?.same_as_shipping
    //       : false
    //   )
    // )
    return dispatch(
      setSameAddressAction(
        result?.setBillingAddressOnCart?.cart?.same_as_shipping
      )
    )
  } catch (error) {
    console.log(error)
    dispatch(addressLoader(false))
  }
}

export const setBillingSaved = (addressSaved) => ({
  type: constants.IS_ADDRESS_SAVED,
  addressSaved: addressSaved,
})

export const setShippingAddress = (address) => async (dispatch) => {
  dispatch(addressLoader(true))
  try {
    const result = await request({
      ...SetShippingAddress,
      variables: {
        cart_id: localStorage.getItem(STORAGE_KEYS.cartId),
        shipping_addresses: address,
      },
    })
    dispatch(
      shippingAddressAction(
        result?.setShippingAddressesOnCart?.cart?.shipping_addresses
      )
    )

    //set shipping methods
    dispatch(
      fetchAndSetShippingMethod(
        result?.setShippingAddressesOnCart?.cart?.shipping_addresses?.[0]
          ?.available_shipping_methods
      )
    )
    // dispatch(
    //   setShippingMethod(
    //     result?.setShippingAddressesOnCart?.cart?.shipping_addresses?.[0]
    //       ?.available_shipping_methods
    //   )
    // )
    // }
    dispatch(addressLoader(false))
  } catch (error) {
    console.log(error)
    dispatch(addressLoader(false))
  }
}

//billing and shipping are same or not
export const setSameAddressAction = (isSame) => ({
  type: constants.SET_SAME_ADDRESS,
  sameAddresses: isSame,
})

//set billing address
export const billingAction = (billingAddress) => ({
  type: constants.SET_BILLING_ADDRESS,
  billingAddress: billingAddress,
})

export const addressLoader = (addressLoading) => async (dispatch) => {
  dispatch({
    type: constants.SET_ADDRESS_LOADER,
    addressLoading: addressLoading,
  })
}

//set shipping address
export const shippingAddressAction = (addresses) => ({
  type: constants.SET_SHIPPING_ADDRESS,
  addresses: addresses,
})

//get addresses for loggedin users
export const getAllAddressLogin = () => async (dispatch) => {
  dispatch(clearGetAddressLogin(true))
  try {
    const result = await request({
      ...GetAddressses,
      variables: {},
    })
    dispatch({
      type: constants.GET_ALL_ADDRESS_LOGIN_USER,
      loginAddressees: result?.customer?.addresses,
    })
    dispatch(clearGetAddressLogin(false))
  } catch (error) {
    console.log(error)
    dispatch(clearGetAddressLogin(false))
  }
}
export const clearGetAddressLogin = (loading) => ({
  type: constants.CLEAR_ALL_ADDRESS_LOGIN_USER,
  getAddressLoading: loading,
})

export const addToCartSuccess = ({ totalItems, items }) => ({
  type: constants.ADD_TO_CART_SUCCESS,
  totalItems: totalItems,
  items: items,
})
export const updateCartAction = ({
  isUpdateCartSuccess,
  updateCartLoading,
  isError = false,
}) => {
  return {
    type: constants.UPDATE_PRODUCT_ACTION,
    isUpdateCartSuccess,
    updateCartLoading,
    isError,
  }
}
export const miniCartAction = ({ isLoading, isError, isSuccess }) => ({
  type: constants.MINI_CART_ACTION,
  isLoading,
  isError,
  isSuccess,
})

export const setMiniCartData = ({
  items,
  totalItems,
  prices,
  appliedCoupon,
  paymentMethods,
  storeCreditAmount,
}) => ({
  type: constants.MINI_CART_DATA,
  items,
  totalItems,
  prices,
  appliedCoupon,
  paymentMethods,
  storeCreditAmount,
})

export const clearUpdateCart = () => ({
  type: constants.CLEAR_UPDATE_CART_DATA,
})

export const clearMiniCart = ({
  isUpdateCartSuccess,
  updateCartLoading,
  isError,
}) => ({
  type: constants.CLEAR_UPDATE_CART_DATA,
  updateCartLoading,
  isError,
  isUpdateCartSuccess,
})

export const dirtyHandlerBilling = (isDirty) => ({
  type: constants.SET_DIRTY_BILLING,
  billingIsDirty: isDirty,
})

export const dirtyHandlerShipping = (isDirty) => ({
  type: constants.SET_DIRTY_SHIPPING,
  shippingIsDirty: isDirty,
})

export const cartLoadingHandler = (loading) => ({
  type: constants.SET_CART_LOADING,
  cartLoading: loading,
})

export const outOfStockHandler = (status) => ({
  type: constants.SET_OUT_OF_STOCK_STATUS,
  outOfStockStatus: status,
})

export const setOrderDetail = (data) => ({
  type: constants.SET_ORDER_DETAILS,
  addresses: data?.shipping_addresses,
  prices: data?.prices,
  email: data?.email,
})

//set price after shipping method apply
export const setPrices = (cart) => ({
  type: constants.SET_PRICES,
  prices: cart?.prices,
  shippingAmount:
    cart?.shipping_addresses?.[0]?.selected_shipping_method?.amount,
})

//set shipping method state
export const setShippingMethod = (shippingMethodCart) => ({
  type: constants.SET_SHIPPING_METHOD_CART,
  shippingMethodCart: shippingMethodCart,
})

//api call for the shipping method apply
export const fetchAndSetShippingMethod =
  (shippingMethod) => async (dispatch) => {
    try {
      const result = await request({
        ...SetShippingMethod,
        variables: {
          cart_id: localStorage.getItem(STORAGE_KEYS.cartId),
          shipping_methods: [
            {
              carrier_code: shippingMethod?.[0]?.carrier_code,
              method_code: shippingMethod?.[0]?.method_code,
            },
          ],
        },
      })
      dispatch(setPrices(result?.setShippingMethodsOnCart?.cart))
      dispatch(
        setShippingMethod(
          result?.setShippingMethodsOnCart?.cart?.shipping_addresses?.[0]
            ?.available_shipping_methods
        )
      )
    } catch (err) {
      console.log('err', err)
    }
  }

export const checkAndSetShippingMethod = (cartData) => async (dispatch) => {
  if (
    cartData?.shipping_addresses?.[0]?.id ||
    cartData?.shipping_addresses?.[0]?.available_shipping_methods?.length > 0
  ) {
    dispatch(
      fetchAndSetShippingMethod(
        cartData?.shipping_addresses?.[0]?.available_shipping_methods
      )
    )
  }
}
