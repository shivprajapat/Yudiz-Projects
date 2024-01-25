import axios from '../../../axios'
import { apiPaths } from 'shared/constants/apiPaths'
import {
  CLEAR_PROFILE_UPDATE_RESPONSE,
  CLEAR_USER_ASSETS_RESPONSE,
  CLEAR_USER_OWNED_ASSETS_RESPONSE,
  CLEAR_USER_RESPONSE,
  GET_USER,
  GET_USER_ASSETS,
  GET_USER_OWNED_ASSETS,
  PROFILE_UPDATE
} from './action'
import { setParamsForGetRequest } from 'shared/utils'
import { SHOW_TOAST } from 'modules/toast/redux/action'
import { TOAST_TYPE } from 'shared/constants'

const errMsg = 'Server is unavailable.'

export const getUser = (id) => (dispatch) => {
  dispatch({ type: CLEAR_USER_RESPONSE })
  axios
    .get(`${apiPaths.userProfileDetails}/${id}`)
    .then(({ data }) => {
      dispatch({
        type: GET_USER,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: GET_USER,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}
export const profileUpdate = (id, payload, callBack) => (dispatch) => {
  dispatch({ type: CLEAR_PROFILE_UPDATE_RESPONSE })
  axios
    .put(`${apiPaths.userProfileDetails}/${id}`, payload)
    .then(({ data }) => {
      dispatch({
        type: PROFILE_UPDATE,
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
      callBack && callBack()
    })
    .catch((error) => {
      dispatch({
        type: PROFILE_UPDATE,
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

export const getUserAssets = (payload) => (dispatch) => {
  dispatch({ type: CLEAR_USER_ASSETS_RESPONSE })
  axios
    .get(`${apiPaths.assetListing}${setParamsForGetRequest(payload)}`)
    .then(({ data }) => {
      dispatch({
        type: GET_USER_ASSETS,
        payload: {
          data: data.result,
          resMessage: '',
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: GET_USER_ASSETS,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const getUserOwnedAssets = (payload) => (dispatch) => {
  dispatch({ type: CLEAR_USER_OWNED_ASSETS_RESPONSE })
  axios
    .get(`${apiPaths.ownedAssets}${setParamsForGetRequest(payload)}`)
    .then(({ data }) => {
      dispatch({
        type: GET_USER_OWNED_ASSETS,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: GET_USER_OWNED_ASSETS,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}
