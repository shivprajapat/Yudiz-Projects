import axios from '../../../axios'
import { apiPaths } from 'shared/constants/apiPaths'
import {
  CLEAR_ASSET_DETAILS_RESPONSE,
  CLEAR_ASSET_UPLOAD_RESPONSE,
  CLEAR_CREATED_ASSET_DETAILS_RESPONSE,
  CLEAR_CREATE_ASSET_RESPONSE,
  CLEAR_CREATOR_ASSETS_RESPONSE,
  CLEAR_OWNED_ASSET_DETAILS_RESPONSE,
  GET_ASSET_DETAILS,
  GET_ASSET_UPLOAD,
  GET_CREATED_ASSET_DETAILS,
  GET_CREATE_ASSET,
  GET_CREATOR_ASSETS,
  GET_OWNED_ASSET_DETAILS
} from './action'
import { SHOW_TOAST } from 'modules/toast/redux/action'
import { TOAST_TYPE } from 'shared/constants'
import {
  CLEAR_ORDER_PAYMENT_RESPONSE,
  CLEAR_ORDER_CREATION_RESPONSE,
  CLEAR_ORDER_UPDATE_RESPONSE,
  CLEAR_PENDING_ORDER_RESPONSE
} from 'modules/checkout/redux/action'
import { setParamsForGetRequest } from 'shared/utils'
import { CLEAR_AUCTION_BIDS_RESPONSE } from 'modules/auction/redux/action'

const errMsg = 'Server is unavailable.'

export const createAsset = (payload, callBack) => (dispatch) => {
  dispatch({ type: CLEAR_CREATE_ASSET_RESPONSE })
  axios
    .post(apiPaths.asset, payload)
    .then(({ data }) => {
      dispatch({
        type: GET_CREATE_ASSET,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true
        }
      })
      callBack && callBack()
    })
    .catch((error) => {
      dispatch({
        type: GET_CREATE_ASSET,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
      dispatch({
        type: SHOW_TOAST,
        payload: {
          message: error.response.data.message,
          type: TOAST_TYPE.Error
        }
      })
    })
}

export const uploadAsset = (payload) => (dispatch) => {
  dispatch({ type: CLEAR_ASSET_UPLOAD_RESPONSE })
  axios
    .post(apiPaths.assetUpload, payload)
    .then(({ data }) => {
      dispatch({
        type: GET_ASSET_UPLOAD,
        payload: {
          data: data.result,
          resMessage: '',
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: GET_ASSET_UPLOAD,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
      dispatch({
        type: SHOW_TOAST,
        payload: {
          message: error.response.data.message,
          type: TOAST_TYPE.Error
        }
      })
    })
}

export const getAssetDetails = (id) => (dispatch) => {
  dispatch({ type: CLEAR_ASSET_DETAILS_RESPONSE })
  dispatch({ type: CLEAR_ORDER_CREATION_RESPONSE })
  dispatch({ type: CLEAR_ORDER_UPDATE_RESPONSE })
  dispatch({ type: CLEAR_ORDER_PAYMENT_RESPONSE })
  dispatch({ type: CLEAR_PENDING_ORDER_RESPONSE })
  dispatch({ type: CLEAR_AUCTION_BIDS_RESPONSE })

  axios
    .get(apiPaths.assetOnSaleListing + '/' + id)
    .then(({ data }) => {
      dispatch({
        type: GET_ASSET_DETAILS,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: GET_ASSET_DETAILS,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
      dispatch({
        type: SHOW_TOAST,
        payload: {
          message: error.response ? error.response.data.message : errMsg,
          type: TOAST_TYPE.Error
        }
      })
    })
}

export const getCreatorAssets = (payload) => (dispatch) => {
  dispatch({ type: CLEAR_CREATOR_ASSETS_RESPONSE })
  axios
    .get(`${apiPaths.assetOnSaleListing}${setParamsForGetRequest(payload)}`)
    .then(({ data }) => {
      dispatch({
        type: GET_CREATOR_ASSETS,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: GET_CREATOR_ASSETS,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
      dispatch({
        type: SHOW_TOAST,
        payload: {
          message: error.response ? error.response.data.message : errMsg,
          type: TOAST_TYPE.Error
        }
      })
    })
}

export const getOwnedAssetDetails = (id) => (dispatch) => {
  dispatch({ type: CLEAR_OWNED_ASSET_DETAILS_RESPONSE })
  dispatch({ type: CLEAR_AUCTION_BIDS_RESPONSE })

  axios
    .get(`${apiPaths.ownedAssets}/${id}`)
    .then(({ data }) => {
      dispatch({
        type: GET_OWNED_ASSET_DETAILS,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: GET_OWNED_ASSET_DETAILS,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
      dispatch({
        type: SHOW_TOAST,
        payload: {
          message: error.response ? error.response.data.message : errMsg,
          type: TOAST_TYPE.Error
        }
      })
    })
}

export const getCreatedAssetDetails = (payload) => (dispatch) => {
  dispatch({ type: CLEAR_CREATED_ASSET_DETAILS_RESPONSE })
  dispatch({ type: CLEAR_AUCTION_BIDS_RESPONSE })

  axios
    .get(`${apiPaths.assetOnSaleCreatorShow}${setParamsForGetRequest(payload)}`)
    .then(({ data }) => {
      dispatch({
        type: GET_CREATED_ASSET_DETAILS,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: GET_CREATED_ASSET_DETAILS,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
      dispatch({
        type: SHOW_TOAST,
        payload: {
          message: error.response ? error.response.data.message : errMsg,
          type: TOAST_TYPE.Error
        }
      })
    })
}
