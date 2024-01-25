import axios from 'axios'
import constants from '../../Shared/Types/constants'

/* Add Qualification Functionality */
export const addNewCoupon = (coupondata, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_ADD_COUPON_CODE_DATA })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/coupon-code/create`, coupondata, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.ADD_COUPON_CODE_DATA,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        isCouponAdded: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.ADD_COUPON_CODE_DATA,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        isCouponAdded: true
      }
    })
  })
}

/* Get all Qualification Functionality */
export const getAllCouponCodes = (start, limit, sort, order, search, token) => (dispatch) => {
  const data = {
    start,
    limit,
    sort,
    order,
    search
  }
  dispatch({ type: constants.CLEAR_GET_ALL_COUPEN_CODE_DATA })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/coupon-code`, data, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.GET_ALL_COUPEN_CODE_DATA,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        coupenCodeList: response.data.data.rows,
        count: response.data.total
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.GET_ALL_COUPEN_CODE_DATA,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message
      }
    })
  })
}

export const getSpecificCouponData = (id, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_GET_SPECIFIC_COUPON_CODE_DATA })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/coupon-code/get`, { id }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.GET_SPECIFIC_COUPON_CODE_DATA,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        specificCouponData: response.data.data
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.GET_SPECIFIC_COUPON_CODE_DATA,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message
      }
    })
  })
}

export const editSpecificCoupon = (coupondata, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_EDIT_SPECIFIC_COUPON_CODE_DATA })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/coupon-code/update`, coupondata, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.EDIT_SPECIFIC_COUPON_CODE_DATA,
      payload: {
        resStatus: true,
        resMessage: response.data?.message,
        isCouponCodeEdited: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.EDIT_SPECIFIC_COUPON_CODE_DATA,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        isCouponCodeEdited: false
      }
    })
  })
}

/* Get Specific Grade Functionality */
export const deleteCoupon = (data, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_DELETE_COUPON_CODE })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/coupon-code/delete`, data, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.DELETE_COUPON_CODE,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        isDeleted: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.DELETE_COUPON_CODE,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        isDeleted: false
      }
    })
  })
}
