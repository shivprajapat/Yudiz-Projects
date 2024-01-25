import axios from 'axios'
import constants from '../../Shared/Types/constants'

export const getallcredits = (token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_GET_ALL_CENTER_CREDITS })
  axios.get(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/center/packages/purchased-licence`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.GET_ALL_CENTER_CREDITS,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        allcredits: response.data.data
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.GET_ALL_CENTER_CREDITS,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message
      }
    })
  })
}

export const centerPackages = (token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_GET_ALL_CENTER_PACKAGE_DATA })
  axios.get(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/center/packages`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.GET_ALL_CENTER_PACKAGE_DATA,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        packageData: response.data.data
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.GET_ALL_CENTER_PACKAGE_DATA,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message
      }
    })
  })
}

/* Get All Other Packages Data */
export const purchasePackageAction = (data, token, navigate) => (dispatch) => {
  dispatch({ type: constants.CLEAR_PURCHASED_PACKAGE })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/center/payment/payumoney`, data, { headers: { Authorization: token } }).then((response) => {
    const newdata = response.data.data
    navigate('/center/payment-form', { state: { newdata } })
  }).catch((error) => {
    dispatch({
      type: constants.PURCHASED_PACKAGE,
      payload: {
        resStatus: false,
        ressMessage: error?.response?.data?.message
      }
    })
  })
}

/* Get All Other Packages Data */
export const purchasePackageSucees = (data, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_PACKAGE_PURCHASE_SUCCESS })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/center/purchase/success`, data, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.PACKAGE_PURCHASE_SUCCESS,
      payload: {
        resStatus: true,
        ressMessage: response.data.message,
        isPackagePurchase: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.PACKAGE_PURCHASE_SUCCESS,
      payload: {
        resStatus: false,
        ressMessage: error?.response?.data?.message,
        isPackagePurchase: false
      }
    })
  })
}

/* Revenue */
export const getRevenue = (data, token, adminType) => (dispatch) => {
  dispatch({ type: constants.CLEAR_GET_REVENUE_SUCCESS })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/${adminType}/get-revenue`, { duration: data }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.GET_REVENUE_SUCCESS,
      payload: {
        resStatus: true,
        ressMessage: response.data.message,
        revenueData: response.data.data,
        isRevenue: false
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.GET_REVENUE_SUCCESS,
      payload: {
        resStatus: false,
        ressMessage: error?.response?.data?.message,
        isRevenue: false
      }
    })
  })
}

/* Redeem history */
export const getRedeemHistory = (start, limit, sortField, sortBy, token, adminType) => (dispatch) => {
  const data = {
    start,
    limit,
    sort: sortField,
    order: sortBy
  }
  dispatch({ type: constants.CLEAR_GET_REDEEM_HISTORY_SUCCESS })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/${adminType}/redeem-request-list`, data, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.GET_REDEEM_HISTORY_SUCCESS,
      payload: {
        resStatus: true,
        ressMessage: response.data.message,
        redeemHistoryData: response.data.data.rows,
        redeemHistoryCount: response.data.data.count
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.GET_REDEEM_HISTORY_SUCCESS,
      payload: {
        resStatus: false,
        ressMessage: error?.response?.data?.message

      }
    })
  })
}

// Redeem Request
export const RedeemAmountReq = (data, token, adminType) => (dispatch) => {
  dispatch({ type: constants.CLEAR_REDEEM_REQUEST_SUCCESS })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/${adminType}/redeem-request`, data, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.REDEEM_REQUEST_SUCCESS,
      payload: {
        resStatus: true,
        ressMessage: response.data.message,
        isRedeemSuccess: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.REDEEM_REQUEST_SUCCESS,
      payload: {
        resStatus: false,
        ressMessage: error?.response?.data?.message,
        isRedeemSuccess: false
      }
    })
  })
}

// get specific student    n
export const getSpecificRedeemReqDetails = (id, token, adminType) => (dispatch) => {
  dispatch({ type: constants.CLEAR_VIEW_SPECIFIC_REDEEM_REQ })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/${adminType}/redeem-request-by-id`, { id }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.VIEW_SPECIFIC_REDEEM_REQ,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        specificRedeReqData: response.data.data
        // isStudentEdited: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.VIEW_SPECIFIC_REDEEM_REQ,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message
      }
    })
  })
}

export const getAllPackageHistoryDataAction = (start, limit, sort, order, search, token) => (dispatch) => {
  const data = {
    start,
    limit,
    sort,
    order,
    search
  }
  dispatch({ type: constants.CLEAR_GET_PACKAGE_HISTORY_LIST })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/center/purchased-packages`, data, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.GET_PACKAGE_HISTORY_LIST,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        packageHistoryArray: response.data.data,
        packageHistoryCount: response.data.total
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.GET_PACKAGE_HISTORY_LIST,
      payload: {
        resStatus: error?.response?.data.status,
        resMessage: error?.response?.data?.message
      }
    })
  })
}

export const applycouponcode = (data, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_APPLY_COUPON_SUCCESS })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/center/coupon/apply`, data, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.APPLY_COUPON_SUCCESS,
      payload: {
        resStatus: false,
        ressMessage: response.data.message,
        applyCoupon: true,
        CouponCodeData: response.data.data
      }
    })
  }

  ).catch((error) => {
    dispatch({
      type: constants.APPLY_COUPON_SUCCESS,
      payload: {
        resStatus: false,
        ressMessage: error?.response?.data?.message,
        applyCoupon: false
      }
    })
  })
}
