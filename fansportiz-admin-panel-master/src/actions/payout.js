import axios from '../axios'
import { catchFunc, successFunc } from '../helpers/helper'
import { CLEAR_PAYOUT_MESSAGE, PAYOUT_DETAILS, PAYOUT_LIST, UPDATE_PAYOUT } from './constants'

export const getPayoutList = (start, limit, sort, order, search, token) => async (dispatch) => {
  await axios.get(`/payout-option/list/v1?start=${start}&limit=${limit}&sort=${sort}&order=${order}&search=${search}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: PAYOUT_LIST,
      payload: {
        data: response.data.data[0] ? response.data.data[0] : [],
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: PAYOUT_LIST,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const getPayoutDetails = (Id, token) => async (dispatch) => {
  await axios.get(`/payout-option/${Id}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: PAYOUT_DETAILS,
      payload: {
        data: response.data.data,
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: PAYOUT_DETAILS,
      payload: {
        data: {},
        resStatus: false
      }
    })
  })
}

export const updatePayout = (updatePayoutData) => async (dispatch) => {
  const { type, key, minAmount, maxAmount, withdrawFee, payoutStatus, title, info, payoutImage, payoutId, token } = updatePayoutData
  dispatch({ type: CLEAR_PAYOUT_MESSAGE })
  try {
    if (payoutImage && payoutImage.file) {
      const response = await axios.post('/payout-option/pre-signed-url/v1', { sFileName: payoutImage.file.name, sContentType: payoutImage.file.type }, { headers: { Authorization: token } })
      const url = response.data.data.sUrl
      const sImage = response.data.data.sPath
      await axios.put(url, payoutImage.file, { headers: { 'Content-Type': payoutImage.file.type } })
      await axios.put(`/payout-option/${payoutId}/v1`, {
        eType: type,
        eKey: key,
        bEnable: payoutStatus,
        sTitle: title,
        sInfo: info,
        nMinAmount: minAmount,
        nMaxAmount: maxAmount,
        nWithdrawFee: withdrawFee,
        sImage
      }, { headers: { Authorization: token } }).then((response2) => {
        dispatch(successFunc(UPDATE_PAYOUT, response2))
      })
    } else {
      await axios.put(`/payout-option/${payoutId}/v1`, {
        eType: type,
        eKey: key,
        bEnable: payoutStatus,
        sTitle: title,
        sInfo: info,
        nMinAmount: minAmount,
        nMaxAmount: maxAmount,
        nWithdrawFee: withdrawFee,
        sImage: payoutImage
      }, { headers: { Authorization: token } }).then((response) => {
        dispatch(successFunc(UPDATE_PAYOUT, response))
      })
    }
  } catch (error) {
    dispatch(catchFunc(UPDATE_PAYOUT, error))
  }
}
