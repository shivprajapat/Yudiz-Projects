import { constants } from '@/actions/type'

const initialState = Object.freeze({
  data: [],
  selectedColor: '',
  selectedColorLoading: true,
  selectedSize: '',
  productVariants: {
    colors: [],
    sizes: [],
    images: [],
  },
  loading: true,
  relatedProduct: [],
})

export const productDetails = (state = initialState, action) => {
  switch (action.type) {
    case constants.SET_PRODUCT_DETAILS_DATA:
      return { ...state, data: action.payload, loading: false }
    case constants.SET_PRODUCT_COLOR:
      state.selectedColor = action.payload
      state.selectedColorLoading = false
      return state
    case constants.SET_SELECTED_SIZE:
      return { ...state, selectedSize: action.payload }
    case constants.SET_PRODUCT_VARIANT:
      return { ...state, productVariants: action.payload }
    case constants.SET_RELATED_PRODUCT:
      return { ...state, relatedProduct: action.payload }
    case constants.RESET_PRODUCT_DETAILS:
      return { ...initialState }
    default:
      return state
  }
}
