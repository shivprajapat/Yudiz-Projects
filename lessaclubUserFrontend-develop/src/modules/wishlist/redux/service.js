import { SHOW_TOAST } from 'modules/toast/redux/action'
import { TOAST_TYPE } from 'shared/constants'
import { apiPaths } from 'shared/constants/apiPaths'
import axios from 'shared/libs/axios'
import { setParamsForGetRequest } from 'shared/utils'
import {
  CLEAR_GET_WISH_LIST_ASSETS_RESPONSE,
  CLEAR_REMOVE_WISH_LIST_ASSET_RESPONSE,
  CLEAR_WISH_LIST_ASSET_RESPONSE,
  GET_WISH_LIST_ASSETS,
  REMOVE_WISH_LIST_ASSET,
  WISH_LIST_ASSET
} from './action'

const errMsg = 'Server is unavailable.'

export const wishlistAsset = (payload) => (dispatch) => {
  dispatch({ type: CLEAR_WISH_LIST_ASSET_RESPONSE })
  axios
    .post(`${apiPaths.wishlist}/wishlists`, payload)
    .then(({ data }) => {
      dispatch({
        type: WISH_LIST_ASSET,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true
        }
      })
      dispatch({
        type: SHOW_TOAST,
        payload: {
          message: data.message,
          type: TOAST_TYPE.Success
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: WISH_LIST_ASSET,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const removeWishlistAsset = (payload) => (dispatch) => {
  dispatch({ type: CLEAR_REMOVE_WISH_LIST_ASSET_RESPONSE })
  axios
    .post(`${apiPaths.wishlist}/wishlists/delete`, payload)
    .then(({ data }) => {
      dispatch({
        type: REMOVE_WISH_LIST_ASSET,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true
        }
      })
      dispatch({
        type: SHOW_TOAST,
        payload: {
          message: data.message,
          type: TOAST_TYPE.Success
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: REMOVE_WISH_LIST_ASSET,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const getWishlistAssets = (payload) => (dispatch) => {
  dispatch({ type: CLEAR_GET_WISH_LIST_ASSETS_RESPONSE })
  axios
    .get(`${apiPaths.wishlist}/wishlists${setParamsForGetRequest(payload)}`)
    .then(({ data }) => {
      dispatch({
        type: GET_WISH_LIST_ASSETS,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: GET_WISH_LIST_ASSETS,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}
