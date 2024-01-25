import axios from 'axios'
import constants from '../../Shared/Types/constants'
export const getAllCenterListAction =
  (start, limit, sorting, order, search, token) => (dispatch) => {
    const data = {
      start,
      limit,
      sorting,
      order,
      search
    }
    dispatch({ type: constants.CLEAR_GET_ALL_CENTER_DATA })
    axios
      .post(
        `${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/center/get-all`,
        data,
        { headers: { Authorization: token } }
      )
      .then((response) => {
        dispatch({
          type: constants.GET_ALL_CENTER_DATA,
          payload: {
            resStatus: true,
            resMessage: response.data.message,
            centerList: response.data.data.rows,
            centerCount: response.data.data.count
          }
        })
      })
      .catch((error) => {
        dispatch({
          type: constants.GET_ALL_CENTER_DATA,
          payload: {
            resStatus: false,
            resMessage: error?.response?.data?.message
          }
        })
      })
  }

// add student
export const addCenterAction = (centerData, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_ADD_CENTER_DATA })
  axios
    .post(
        `${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/center/create`,
        centerData,
        { headers: { Authorization: token } }
    )
    .then((response) => {
      dispatch({
        type: constants.ADD_CENTER_DATA,
        payload: {
          resStatus: true,
          resMessage: response.data.message,
          isCenterAdded: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: constants.ADD_CENTER_DATA,
        payload: {
          resStatus: false,
          resMessage: error?.response?.data?.message,
          isCenterAdded: false
        }
      })
    })
}

// get specific center
export const getSpecificCenter = (id, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_GET_SPECIFIC_CENTER })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/center/get-by-id`, { id }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.GET_SPECIFIC_CENTER,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        resData: response.data.data
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.GET_SPECIFIC_CENTER,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        resData: false
      }
    })
  })
}

// update student
export const editSpecificCenter = (studentData, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_EDIT_SPECIFIC_CENTER })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/center/update`, studentData, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.EDIT_SPECIFIC_CENTER,
      payload: {
        resStatus: true,
        resMessage: response.data?.message,
        isCenterEdited: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.EDIT_SPECIFIC_CENTER,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        isCenterEdited: false
      }
    })
  })
}

/// / delete center
export const deleteCenter = (centerData, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_DELETE_CENTER })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/center/delete`, centerData, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.DELETE_CENTER,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        isDeleted: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.DELETE_CENTER,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        isDeleted: false
      }
    })
  })
}

/* Redeem history */
export const getRedeemHistoryCenter = (starting, limit, sortField, sortBy, searchFor, token, userType) => (dispatch) => {
  const data = {
    start: starting,
    limit,
    sort: sortField,
    order: sortBy,
    search: searchFor
  }
  dispatch({ type: constants.CLEAR_GET_REDEEM_HISTORY_CENTER_SUCCESS })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/${userType}/redeem-request-list`, data, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.GET_REDEEM_HISTORY_CENTER_SUCCESS,
      payload: {
        resStatus: true,
        ressMessage: response.data.message,
        redeemHistoryCenterData: response.data.data.rows,
        redeemHistoryCenterCount: response.data.data.count
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.GET_REDEEM_HISTORY_CENTER_SUCCESS,
      payload: {
        resStatus: false,
        ressMessage: error?.response?.data?.message

      }
    })
  })
}

// get specific redeem request  center
export const getSpecificRedeemReqCenter = (id, token, usertype) => (dispatch) => {
  dispatch({ type: constants.CLEAR_GET_SPECIFIC_REDEEM_REQ })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/${usertype}/redeem-request-by-id`, { id }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.GET_SPECIFIC_REDEEM_REQ,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        specicRedeemReqData: response.data.data
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.GET_SPECIFIC_REDEEM_REQ,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message
      }
    })
  })
}

// update student
export const editSpecidicRedeemRequest = (studentData, token, userType) => (dispatch) => {
  dispatch({ type: constants.CLEAR_EDIT_SPECIFIC_REDEEM_REQ })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/${userType}/update-redeem-request`, studentData, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.EDIT_SPECIFIC_REDEEM_REQ,
      payload: {
        resStatus: true,
        resMessage: response.data?.message,
        isRedeemReqEdited: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.EDIT_SPECIFIC_REDEEM_REQ,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        isRedeemReqEdited: false
      }
    })
  })
}

// update student
export const exportCenter = (data, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_EXPORT_CENTERS })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/csv-center`, data, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.EXPORT_CENTERS,
      payload: {
        resStatus: true,
        resMessage: response.data?.message,
        exportedData: response.data?.data
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.EXPORT_CENTERS,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        exportedData: null
      }
    })
  })
}
