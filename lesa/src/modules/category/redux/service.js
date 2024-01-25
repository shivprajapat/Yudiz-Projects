import axios from '../../../axios'
import { apiPaths } from 'shared/constants/apiPaths'
import { setParamsForGetRequest } from 'shared/utils'
import { CLEAR_CATEGORY_RESPONSE, GET_CATEGORY_DATA } from './action'

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
