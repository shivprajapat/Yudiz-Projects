import {
  CLEAR_GET_WISH_LIST_ASSETS_RESPONSE,
  CLEAR_REMOVE_WISH_LIST_ASSET_RESPONSE,
  CLEAR_WISH_LIST_ASSET_RESPONSE,
  GET_WISH_LIST_ASSETS,
  REMOVE_WISH_LIST_ASSET,
  WISH_LIST_ASSET
} from './action'

export const wishlist = (state = {}, action = {}) => {
  switch (action.type) {
    case WISH_LIST_ASSET:
      return {
        ...state,
        wishlistAsset: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case REMOVE_WISH_LIST_ASSET:
      return {
        ...state,
        removeWishlistAsset: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }

    case CLEAR_WISH_LIST_ASSET_RESPONSE:
      return {
        ...state,
        wishlistAsset: {},
        resStatus: '',
        resMessage: ''
      }
    case CLEAR_REMOVE_WISH_LIST_ASSET_RESPONSE:
      return {
        removeWishlistAsset: {},
        resStatus: false,
        resMessage: ''
      }
    case GET_WISH_LIST_ASSETS:
      return {
        ...state,
        getWishlistAssets: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case CLEAR_GET_WISH_LIST_ASSETS_RESPONSE:
      return {
        ...state,
        getWishlistAssets: {},
        resStatus: '',
        resMessage: ''
      }
    default:
      return state
  }
}
