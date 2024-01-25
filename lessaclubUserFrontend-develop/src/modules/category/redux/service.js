import axios from 'shared/libs/axios'
import { apiPaths } from 'shared/constants/apiPaths'
import { setParamsForGetRequest } from 'shared/utils'
import { CLEAR_CATEGORY_RESPONSE, GET_CATEGORY_DATA } from './action'
import { SHOW_TOAST } from 'modules/toast/redux/action'
import { TOAST_TYPE } from 'shared/constants'

const errMsg = 'Server is unavailable.'

export const getCategories = (payload) => (dispatch) => {
  dispatch({ type: CLEAR_CATEGORY_RESPONSE })
  axios
    .get(`${apiPaths.categoryListing}${setParamsForGetRequest(payload)}`)
    .then(({ data }) => {
      dispatch({
        type: GET_CATEGORY_DATA,
        payload: {
          data: data.result,
          resMessage: '',
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: GET_CATEGORY_DATA,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.resStatus.data.message : errMsg
        }
      })
    })
}

export const deleteCategory = (id) => (dispatch) => {
  axios
    .delete(`${apiPaths.categoryListing}/${id}`)
    .then(({ data }) => {
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
        type: SHOW_TOAST,
        payload: {
          message: error.message,
          type: TOAST_TYPE.Error
        }
      })
    })
}
