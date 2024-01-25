import axios from '../axios'
import { catchFunc, successFunc } from '../helpers/helper'
import { ADD_OFFER, CLEAR_OFFER_MESSAGE, DELETE_OFFER, OFFER_DETAILS, OFFER_LIST, UPDATE_OFFER } from './constants'

export const getOfferList = (start, limit, sort, order, search, token) => async (dispatch) => {
  await axios.get(`/offer/list/v1?start=${start}&limit=${limit}&sort=${sort}&order=${order}&search=${search}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: OFFER_LIST,
      payload: {
        data: response.data.data[0] ? response.data.data[0] : [],
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: OFFER_LIST,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const addOffer = (addOfferData) => async (dispatch) => {
  const { Title, Details, Description, Active, offerImage, token } = addOfferData
  dispatch({ type: CLEAR_OFFER_MESSAGE })
  try {
    if (offerImage) {
      const response = await axios.post('/offer/pre-signed-url/v1', { sFileName: offerImage.file.name, sContentType: offerImage.file.type }, { headers: { Authorization: token } })
      const url = response.data.data.sUrl
      const sImage = response.data.data.sPath
      await axios.put(url, offerImage.file, { headers: { 'Content-Type': offerImage.file.type } })
      await axios.post('/offer/add/v1', {
        sTitle: Title, sDetail: Details, sDescription: Description, eStatus: Active, sImage
      }, { headers: { Authorization: token } }).then((response1) => {
        dispatch(successFunc(ADD_OFFER, response1))
      })
    } else {
      await axios.post('/offer/add/v1', {
        sTitle: Title, sDetail: Details, sDescription: Description, eStatus: Active, sImage: ''
      }, { headers: { Authorization: token } }).then((response2) => {
        dispatch(successFunc(ADD_OFFER, response2))
      })
    }
  } catch (error) {
    dispatch(catchFunc(ADD_OFFER, error))
  }
}

export const getOfferDetails = (Id, token) => async (dispatch) => {
  await axios.get(`/offer/${Id}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: OFFER_DETAILS,
      payload: {
        data: response.data.data,
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: OFFER_DETAILS,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const updateOffer = (updateOfferData, offerId, token) => async (dispatch) => {
  const { Title, Details, Description, Active, offerImage } = updateOfferData
  dispatch({ type: CLEAR_OFFER_MESSAGE })
  try {
    if (offerImage && offerImage.file) {
      const response = await axios.post('/offer/pre-signed-url/v1', { sFileName: offerImage.file.name, sContentType: offerImage.file.type }, { headers: { Authorization: token } })
      const url = response.data.data.sUrl
      const sImage = response.data.data.sPath
      await axios.put(url, offerImage.file, { headers: { 'Content-Type': offerImage.file.type } })
      await axios.put(`/offer/${offerId}/v1`, {
        sTitle: Title, sDetail: Details, sDescription: Description, eStatus: Active, sImage
      }, { headers: { Authorization: token } }).then((response2) => {
        dispatch(successFunc(UPDATE_OFFER, response2))
      })
    } else {
      await axios.put(`/offer/${offerId}/v1`, {
        sTitle: Title, sDetail: Details, sDescription: Description, eStatus: Active, sImage: offerImage
      }, { headers: { Authorization: token } }).then((response) => {
        dispatch(successFunc(UPDATE_OFFER, response))
      })
    }
  } catch (error) {
    dispatch(catchFunc(UPDATE_OFFER, error))
  }
}

export const deleteOffer = (Id, token) => async (dispatch) => {
  dispatch({ type: CLEAR_OFFER_MESSAGE })
  await axios.delete(`/offer/${Id}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch(successFunc(DELETE_OFFER, response))
  }).catch((error) => {
    dispatch(catchFunc(DELETE_OFFER, error))
  })
}
