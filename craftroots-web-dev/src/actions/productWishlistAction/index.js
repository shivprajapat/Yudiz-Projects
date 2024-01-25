import { constants } from '../type'

export const setWishlistData = (payload) => {
  try {
    if (payload) {
      return {
        type: constants.SET_WISHLIST_DATA,
        payload: payload,
      }
    }
  } catch (error) {
    return error
  }
}

export const resetWishlistData = () => ({
  type: constants.RESET_WISHLIST_DATA,
})
