import axios from 'shared/libs/axios'
import { apiPaths } from 'shared/constants/apiPaths'
import { setParamsForGetRequest } from 'shared/utils'
import { CLEAR_EXPLORE_RESPONSE, GET_EXPLORE_ASSETS } from './action'

const errMsg = 'Server is unavailable.'

export const getExploreAssets = (payload) => (dispatch) => {
  dispatch({ type: CLEAR_EXPLORE_RESPONSE })
  axios
    .get(`${apiPaths.asset}${setParamsForGetRequest(payload)}`)
    .then(({ data }) => {
      dispatch({
        type: GET_EXPLORE_ASSETS,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: GET_EXPLORE_ASSETS,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}
