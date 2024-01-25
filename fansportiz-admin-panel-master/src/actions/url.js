import axios from 'axios'
import baseURL from '../axios'
import { GET_KYC_URL, GET_URL, KYC_URL } from './constants'

export const getUrl = type => async (dispatch) => {
  await axios.get(`${baseURL.defaults.baseURL.replace('/admin', '')}/get-url/${type}/v1`).then((response) => {
    dispatch({
      type: GET_URL,
      payload: {
        data: response.data.data ? response.data.data : '',
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

export const getKycUrl = type => async (dispatch) => {
  await axios.get(`${baseURL.defaults.baseURL.replace('/admin', '')}/get-url/${type}/v1`).then((response) => {
    dispatch({
      type: GET_KYC_URL,
      payload: {
        data: response.data.data ? response.data.data : '',
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: GET_KYC_URL,
      payload: {
        data: '',
        resStatus: false
      }
    })
  })
}

export const getKYCUrl = (path, token) => async (dispatch) => {
  await baseURL.post('/pre-signed-url-kyc/v1', { oPath: path }, { headers: { Authorization: token } }).then((res) => {
    dispatch({
      type: KYC_URL,
      payload: {
        data: res.data.data,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: KYC_URL,
      payload: {
        data: {},
        resMessage: error.response ? error.response.data.message : '',
        resStatus: true
      }
    })
  })
}
