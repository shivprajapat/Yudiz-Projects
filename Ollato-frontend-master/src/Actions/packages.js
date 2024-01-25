/* eslint-disable no-const-assign */

import axios from 'axios'
import constants from '../Shared/Types/constants'

/* Get All Packages Data */
export const getPackagesDataAction = (data, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_GET_ALL_PACKAGES_DATA })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/student/packages`, data, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.GET_ALL_PACKAGES_DATA,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        packagesData: response.data.data,
        isLoading: false
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.GET_ALL_PACKAGES_DATA,
      payload: {
        // resStatus: error?.response?.data.status,
        resStatus: false,
        resMessage: error?.response?.data?.message,
        isLoading: false
      }
    })
  })
}

/* Get Package Data by ID */
export const getPackageDataByIDAction = (data, token) => (dispatch) => {
  const dataObject = {
    id: Number(data)
  }
  dispatch({ type: constants.CLEAR_GET_PACKAGES_DATA_ID })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/student/packages/get`, dataObject, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.GET_PACKAGES_DATA_ID,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        packageDataById: response.data.data
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.GET_PACKAGES_DATA_ID,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message
      }
    })
  })
}

/* Get All Active Packages Data */
export const getActivePackagesDataAction = (search, token) => (dispatch) => {
  let data = {}
  if (search) {
    data = {
      search
    }
  } else {
    data = { }
  }
  dispatch({ type: constants.CLEAR_GET_ACTIVE_PACKAGES })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/student/active-purchased-packages`, data, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.GET_ACTIVE_PACKAGES,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        activePackagesArray: response.data.data
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.GET_ACTIVE_PACKAGES,
      payload: {
        resStatus: error?.response?.data.status,
        resMessage: error?.response?.data?.message
      }
    })
  })
}

/* Get All add On Packages Data */
export const getAllAddOnPackagesDataAction = (token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_GET_ADD_ON_PACKAGES })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/student/add-on-packages`, { }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.GET_ADD_ON_PACKAGES,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        addOnPackagesArray: response.data.data
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.GET_ADD_ON_PACKAGES,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message
      }
    })
  })
}

/* Get All Packages History Data */
export const getAllPackageHistoryDataAction = (token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_GET_PACKAGE_HISTORY_LIST })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/student/purchased-packages`, { }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.GET_PACKAGE_HISTORY_LIST,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        packageHistoryArray: response.data.data
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

/* Get All Packages History Data */
export const downloadInvoice = (id, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_GET_PACKAGE_HISTORY_LIST })
  axios.get(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/student/purchased-package/invoice/${id}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.GET_PACKAGE_HISTORY_LIST,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        isDownloaded: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.GET_PACKAGE_HISTORY_LIST,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        isDownloaded: false
      }
    })
  })
}

/* Get All Other Packages Data */
export const getOtherPackagesAction = (data, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_GET_OTHER_PACKAGES })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/student/others-packages`, { }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.GET_OTHER_PACKAGES,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        otherPackagesData: response.data.data
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.GET_OTHER_PACKAGES,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message
      }
    })
  })
}

/* Get All Other Packages Data */
export const purchasePackageAction = (data, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_PURCHASED_PACKAGE })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/student/packages/purchase`, data, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.PURCHASED_PACKAGE,
      payload: {
        resStatus: true,
        ressMessage: response.data.message,
        packagePurchasedDetails: response.data.data
      }
    })
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
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/student/purchase/success`, data, { headers: { Authorization: token } }).then((response) => {
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

export const purchasePackageActionn = (data, token, navigate) => (dispatch) => {
  dispatch({ type: constants.CLEAR_PURCHASED_PACKAGE })
  // dispatch({ type: constants.CLEAR_PACKAGE_PURCHASE_SUCCESS })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/student/payment/payumoney`, data, { headers: { Authorization: token } }).then((response) => {
    const newdata = response.data.data
    navigate('/payment-form', { state: { newdata } })
  }

  ).catch((error) => {
    dispatch({
      type: constants.PURCHASED_PACKAGE,
      payload: {
        resStatus: false,
        ressMessage: error?.response?.data?.message
      }
    })
  })
}

export const applycouponcode = (data, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_APPLY_COUPON_SUCCESS })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/student/coupon/apply`, data, { headers: { Authorization: token } }).then((response) => {
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
