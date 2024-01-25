import axios from 'shared/libs/axios'
import { apiPaths } from 'shared/constants/apiPaths'

import { SHOW_TOAST } from 'modules/toast/redux/action'
import { TOAST_TYPE } from 'shared/constants'
import {
  CLEAR_CRATE_ASSETS_RESPONSE,
  CLEAR_CREATE_LOOT_BOX_RESPONSE,
  CLEAR_CREATE_MYSTERY_BOX_RESPONSE,
  CLEAR_LOOT_BOXES_RESPONSE,
  CLEAR_LOOT_BOX_DETAILS_RESPONSE,
  CLEAR_MYSTERY_BOXES_RESPONSE,
  CLEAR_MYSTERY_BOX_DETAILS_RESPONSE,
  CREATE_LOOT_BOX,
  CREATE_MYSTERY_BOX,
  GET_CRATE_ASSETS,
  GET_LOOT_BOXES,
  GET_LOOT_BOX_DETAILS,
  GET_MYSTERY_BOXES,
  GET_MYSTERY_BOX_DETAILS
} from './action'
import { setParamsForGetRequest } from 'shared/utils'
import {
  CLEAR_ORDER_CREATION_RESPONSE,
  CLEAR_ORDER_PAYMENT_RESPONSE,
  CLEAR_ORDER_UPDATE_RESPONSE,
  CLEAR_PENDING_ORDER_RESPONSE
} from 'modules/checkout/redux/action'

const errMsg = 'Server is unavailable.'

export const createMysteryBox = (payload, callback) => (dispatch) => {
  dispatch({ type: CLEAR_CREATE_MYSTERY_BOX_RESPONSE })
  axios
    .post(apiPaths.adminMysteryBox, payload)
    .then(({ data }) => {
      dispatch({
        type: CREATE_MYSTERY_BOX,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true,
          resError: false
        }
      })
      callback && callback()
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
        type: CREATE_MYSTERY_BOX,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg,
          resError: true
        }
      })
    })
}

export const getCrateAssets = (payload) => (dispatch) => {
  dispatch({ type: CLEAR_CRATE_ASSETS_RESPONSE })
  axios
    .get(`${apiPaths.asset}${setParamsForGetRequest(payload)}`)
    .then(({ data }) => {
      dispatch({
        type: GET_CRATE_ASSETS,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: GET_CRATE_ASSETS,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const createLootBox = (payload, callback) => (dispatch) => {
  dispatch({ type: CLEAR_CREATE_LOOT_BOX_RESPONSE })
  axios
    .post(`${apiPaths.adminLootBox}/lootBoxes`, payload)
    .then(({ data }) => {
      dispatch({
        type: CREATE_LOOT_BOX,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true,
          resError: false
        }
      })
      callback && callback()
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
        type: CREATE_LOOT_BOX,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg,
          resError: true
        }
      })
    })
}

export const getMysteryBoxes = (payload) => (dispatch) => {
  dispatch({ type: CLEAR_MYSTERY_BOXES_RESPONSE })
  axios
    .get(`${apiPaths.mysteryBox}${setParamsForGetRequest(payload)}`)
    .then(({ data }) => {
      dispatch({
        type: GET_MYSTERY_BOXES,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: GET_MYSTERY_BOXES,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const getMysteryBoxDetails = (id) => (dispatch) => {
  dispatch({ type: CLEAR_MYSTERY_BOX_DETAILS_RESPONSE })
  dispatch({ type: CLEAR_ORDER_PAYMENT_RESPONSE })
  dispatch({ type: CLEAR_ORDER_CREATION_RESPONSE })
  dispatch({ type: CLEAR_ORDER_UPDATE_RESPONSE })
  dispatch({ type: CLEAR_PENDING_ORDER_RESPONSE })

  axios
    .get(`${apiPaths.mysteryBox}/${id}`)
    .then(({ data }) => {
      dispatch({
        type: GET_MYSTERY_BOX_DETAILS,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: GET_MYSTERY_BOX_DETAILS,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const getLootBoxes = (payload) => (dispatch) => {
  dispatch({ type: CLEAR_LOOT_BOXES_RESPONSE })
  axios
    .get(`${apiPaths.lootBox}${setParamsForGetRequest(payload)}`)
    .then(({ data }) => {
      dispatch({
        type: GET_LOOT_BOXES,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: GET_LOOT_BOXES,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const getLootBoxDetails = (id) => (dispatch) => {
  // TODO: order payment response should be cleared from here
  dispatch({ type: CLEAR_LOOT_BOX_DETAILS_RESPONSE })
  dispatch({ type: CLEAR_ORDER_PAYMENT_RESPONSE })
  dispatch({ type: CLEAR_ORDER_CREATION_RESPONSE })
  dispatch({ type: CLEAR_ORDER_UPDATE_RESPONSE })
  dispatch({ type: CLEAR_PENDING_ORDER_RESPONSE })

  axios
    .get(`${apiPaths.lootBoxDetails}/${id}`)
    .then(({ data }) => {
      dispatch({
        type: GET_LOOT_BOX_DETAILS,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: GET_LOOT_BOX_DETAILS,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}
