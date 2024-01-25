import axios from 'shared/libs/axios'
import { apiPaths } from 'shared/constants/apiPaths'
import { ADMIN_BLOCK_UNBLOCK_USER, ADMIN_CLEAR_BLOCK_UNBLOCK_USER, ADMIN_CLEAR_GET_USERS, ADMIN_GET_USERS } from './action'
import { setParamsForGetRequest } from 'shared/utils'
import { SHOW_TOAST } from 'modules/toast/redux/action'
import { TOAST_TYPE } from 'shared/constants'

const errMsg = 'Server is unavailable.'

export const adminGetUsers = (payload) => (dispatch) => {
  dispatch({ type: ADMIN_CLEAR_GET_USERS })
  axios
    .get(`${apiPaths.userProfileDetails}${setParamsForGetRequest(payload)}`)
    .then(({ data }) => {
      dispatch({
        type: ADMIN_GET_USERS,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: ADMIN_GET_USERS,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const adminBlockUnblockUser = (id, payload) => (dispatch) => {
  dispatch({ type: ADMIN_CLEAR_BLOCK_UNBLOCK_USER })
  axios
    .put(`${apiPaths.adminBlockUnblock}/${id}`, payload)
    .then(({ data }) => {
      dispatch({
        type: ADMIN_BLOCK_UNBLOCK_USER,
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
        type: ADMIN_BLOCK_UNBLOCK_USER,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}
