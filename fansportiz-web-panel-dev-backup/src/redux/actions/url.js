import axios from '../../axios/instanceAxios'
import {
  GET_URL
} from '../constants'

export const getUrl = () => async (dispatch) => {
  await axios.get('/gaming/user/get-url/v1').then((response) => {
    dispatch({
      type: GET_URL,
      payload: {
        media: response.data.data ? response.data.data.media : '',
        kyc: response.data.data ? response.data.data.kyc : '',
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: GET_URL,
      payload: {
        data: '',
        resStatus: false
      }
    })
  })
}
