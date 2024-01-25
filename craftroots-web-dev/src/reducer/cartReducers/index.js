import { constants } from '@/actions/type'

const initialState = Object.freeze({
  items: [],
  isLoading: null,
  prices: {},
  totalItems: null,
  updateCartLoading: false,
  isUpdateCartSuccess: false,
  isError: false,
  couponCodes: [],
  appliedCoupon: null,
  data: [],
  selectedColor: '',
  shippingMethod: null,
  selectedColorLoading: true,
  selectedSize: '',
  productVariants: {
    colors: [],
    sizes: [],
    images: [],
  },
  loading: true,
  isUpdateSuccess: false,
  addresses: [],
  emailAddress: '',
  billingAddress: {},
  sameAddresses: null,
  addressLoading: false,
  loginAddressees: [],
  getAddressLoading: false,
  billingIsDirty: false,
  shippingIsDirty: false,
  paymentMethods: [],
  addressSaved: false,
  isSuccess: false,
  cartLoading: true,
  outOfStockStatus: false,
  storeCreditAmount: null,
  shippingAmount: null,
  shippingMethodCart: [],
})

export const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    /* case constants.CLEAR_MINI_CART_DATA:
      return {
        ...state,
        isLoading: true,
      } */
    case constants.MINI_CART_DATA:
      let shippingAddress = {}
      if (action.addresses) {
        shippingAddress = { addresses: action.addresses }
      }
      return {
        ...state,
        isLoading: false,
        updateCartLoading: false,
        isError: false,
        items: action.items,
        prices: action.prices,
        totalItems: action.totalItems,
        appliedCoupon: action.appliedCoupon,
        paymentMethods: action.paymentMethods,
        storeCreditAmount: action.storeCreditAmount,
        // addresses: action.addresses,
        emailAddress: action.email,
        isSuccess: action.isSuccess,
        // billingAddress: action.billingAddress || {},
        // sameAddresses: action.sameAddresses
        ...shippingAddress,
      }
    case constants.MINI_CART_ACTION:
      return {
        ...state,
        isLoading: action.isLoading,
        updateCartLoading: action.updateCartLoading,
        isError: action.isError,
        isSuccess: action.isSuccess,
      }
    case constants.GET_ALL_COUPON_CODES:
      return {
        ...state,
        couponCodes: action.couponCodes,
      }
    case constants.CLEAR_UPDATE_CART_DATA:
      return {
        ...state,
        updateCartLoading: initialState.updateCartLoading,
        isUpdateCartSuccess: initialState.isUpdateCartSuccess,
      }
    case constants.UPDATE_PRODUCT_ACTION:
      return {
        ...state,
        isUpdateCartSuccess: action.isUpdateCartSuccess,
        updateCartLoading: action.updateCartLoading,
      }
    /*  case constants.UPDATE_PRODUCT_FAIL:
      return {
        ...state,
        isUpdateCartSuccess: false,
        updateCartLoading: false,
      } */
    case constants.ADD_TO_CART_SUCCESS:
      return {
        ...state,
        /* totalItems: action.totalItems,
        items: action.items */
        totalItems: action.totalItems,
        items: action.items,
      }
    case constants.EDIT_CART_ITEM:
      return { ...state, data: action.payload, loading: false }

    case constants.EDIT_CART_PRODUCT_COLOR:
      return {
        ...state,
        selectedColor: action.payload,
        selectedColorLoading: false,
      }

    case constants.EDIT_CART_SELECTED_SIZE:
      return { ...state, selectedSize: action.payload }

    case constants.EDIT_CART_PRODUCT_VARIANT:
      return { ...state, productVariants: action.payload }

    case constants.RESET_EDIT_CART:
      return {
        ...state,
        data: initialState.data,
        selectedColor: initialState.selectedColor,
        selectedColorLoading: initialState.selectedColorLoading,
        selectedSize: initialState.selectedSize,
        productVariants: initialState.productVariants,
        loading: initialState.loading,
      }
    case constants.SET_SHIPPING_ADDRESS:
      return {
        ...state,
        addresses: action.addresses,
        // prices: action.prices,
      }
    case constants.SET_BILLING_ADDRESS:
      return {
        ...state,
        billingAddress: action.billingAddress,
      }
    case constants.SET_SAME_ADDRESS:
      return {
        ...state,
        sameAddresses: action.sameAddresses,
      }
    case constants.SET_ADDRESS_LOADER:
      return {
        ...state,
        addressLoading: action.addressLoading,
      }
    case constants.CLEAR_ALL_ADDRESS_LOGIN_USER:
      return {
        ...state,
        getAddressLoading: action.getAddressLoading,
      }
    case constants.GET_ALL_ADDRESS_LOGIN_USER:
      return {
        ...state,
        loginAddressees: action.loginAddressees,
      }
    case constants.SET_DIRTY_BILLING:
      return {
        ...state,
        billingIsDirty: action.billingIsDirty,
      }
    case constants.SET_DIRTY_SHIPPING:
      return {
        ...state,
        shippingIsDirty: action.shippingIsDirty,
      }
    case constants.IS_ADDRESS_SAVED:
      return {
        ...state,
        addressSaved: action.addressSaved,
      }
    case constants.SET_CART_LOADING:
      return { ...state, cartLoading: action.cartLoading }
    case constants.SET_OUT_OF_STOCK_STATUS:
      return { ...state, outOfStockStatus: action.outOfStockStatus }
    case constants.SET_ORDER_DETAILS:
      return {
        ...state,
        addresses: action.addresses,
        prices: action.prices,
        emailAddress: action.email,
      }
    case constants.SET_PRICES:
      return {
        ...state,
        prices: action.prices,
        shippingAmount: action.shippingAmount,
      }
    case constants.SET_SHIPPING_METHOD_CART:
      return {
        ...state,
        shippingMethodCart: action.shippingMethodCart,
      }
    default:
      return state
  }
}
