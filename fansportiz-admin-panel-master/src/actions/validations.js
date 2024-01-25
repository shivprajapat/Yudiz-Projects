import axios from '../axios'
import { CLEAR_VALIDATION_MESSAGE, UPDATE_VALIDATION, VALIDATION_DETAILS, VALIDATION_LIST } from './constants'
const errMsg = 'Server is unavailable.'

export const getValidationsList = (start, limit, sort, order, search, token) => async (dispatch) => {
  await axios.get(`/validation/v1?start=${start}&limit=${limit}&sort=${sort}&order=${order}&search=${search}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: VALIDATION_LIST,
      payload: {
        data: response.data.data[0] ? response.data.data[0] : [],
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: VALIDATION_LIST,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const getValidationDetails = (id, token) => async (dispatch) => {
  await axios.get(`/validation/${id}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: VALIDATION_DETAILS,
      payload: {
        data: response.data.data,
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: VALIDATION_DETAILS,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const updateValidation = (updateValidationData) => async (dispatch) => {
  const { name, MinValue, MaxValue, ValidationId, token } = updateValidationData
  dispatch({ type: CLEAR_VALIDATION_MESSAGE })
  await axios.put(`/validation/${ValidationId}/v1`, {
    sName: name, nMax: parseInt(MaxValue), nMin: parseInt(MinValue)
  }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: UPDATE_VALIDATION,
      payload: {
        resMessage: response.data.message,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: UPDATE_VALIDATION,
      payload: {
        resMessage: error.response ? error.response.data.message : errMsg,
        resStatus: false
      }
    })
  })
}
