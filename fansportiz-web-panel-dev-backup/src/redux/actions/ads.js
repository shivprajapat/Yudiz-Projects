import axios from '../../axios/instanceAxios'
import {
  GET_ADS_LIST
} from '../constants'

const errMsg = 'Server is unavailable.'

export const GetAdsList = () => async (dispatch) => {
  await axios.get('/statics/user/popupAds/list/v1').then((response) => {
    dispatch({
      type: GET_ADS_LIST,
      payload: {
        data: response.data.data,
        resMessage: response.data.message,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: GET_ADS_LIST,
      payload: {
        data: [],
        resMessage: error.response ? error.response.data.message : errMsg,
        resStatus: false
      }
    })
  })
}
