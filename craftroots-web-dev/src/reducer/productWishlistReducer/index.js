import { constants } from '@/actions/type'

const initialState = Object.freeze({
  data: [],
  isLoading: null,
  items_count: null,
})

export const productWishlistReducer = (state = initialState, action) => {
  switch (action.type) {
    case constants.SET_WISHLIST_DATA:
      return {
        ...state,
        data: action.payload,
        isLoading: false,
        items_count: action.payload?.items_count
          ? action.payload?.items_count
          : null,
      }
    case constants.RESET_WISHLIST_DATA:
      return initialState // Reset the state to its initial values
    default:
      return state
  }
}
