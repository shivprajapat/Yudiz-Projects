import axios from 'shared/libs/axios'
import { apiPaths } from 'shared/constants/apiPaths'
import { setParamsForGetRequest } from 'shared/utils'
import { ADMIN_BLOCK_UNBLOCK_ASSET, ADMIN_CLEAR_BLOCK_UNBLOCK_ASSET, ADMIN_CLEAR_GET_ASSETS, ADMIN_GET_ASSETS } from './action'
import { SHOW_TOAST } from 'modules/toast/redux/action'
import { TOAST_TYPE } from 'shared/constants'

const errMsg = 'Server is unavailable.'

export const adminGetAssets = (payload) => (dispatch) => {
  dispatch({ type: ADMIN_CLEAR_GET_ASSETS })
  axios
    .get(`${apiPaths.adminAssetManagement}/index${setParamsForGetRequest(payload)}`)
    .then(({ data }) => {
      dispatch({
        type: ADMIN_GET_ASSETS,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: ADMIN_GET_ASSETS,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const toggleAssetApproval = (payload) => async (dispatch) => {
  return await axios.put(apiPaths.toggleAssetApproval(payload.assetId), payload)
}

export const adminBlockUnblockAsset = (id, payload) => (dispatch) => {
  dispatch({ type: ADMIN_CLEAR_BLOCK_UNBLOCK_ASSET })
  axios
    .put(`${apiPaths.adminAssetBlockUnblock}/${id}`, payload)
    .then(({ data }) => {
      dispatch({
        type: ADMIN_BLOCK_UNBLOCK_ASSET,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true
        }
      })
      dispatch({
        type: SHOW_TOAST,
        payload: {
          message: data.result.asset.isActive ? 'The Asset is active now' : 'The Asset is deactivated now',
          type: TOAST_TYPE.Success
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: ADMIN_BLOCK_UNBLOCK_ASSET,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}
