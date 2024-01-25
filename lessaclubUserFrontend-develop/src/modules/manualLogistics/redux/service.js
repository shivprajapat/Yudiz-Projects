import axios from 'shared/libs/axios'
import { apiPaths } from 'shared/constants/apiPaths'
import {
  UPDATE_MANUAL_LOGISTICS_DATA,
  CLEAR_MANUAL_LOGISTICS_DATA
} from './action'

const errMsg = 'Server is unavailable.'

export const updateManualLogistics = (id, payload) => (dispatch) => {
  dispatch({ type: CLEAR_MANUAL_LOGISTICS_DATA })
  axios
    .put(apiPaths.manualLogistics + '/' + id, payload)
    .then(({ data }) => {
      dispatch({
        type: UPDATE_MANUAL_LOGISTICS_DATA,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: UPDATE_MANUAL_LOGISTICS_DATA,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}
