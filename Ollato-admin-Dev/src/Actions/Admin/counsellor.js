import axios from 'axios'
import constants from '../../Shared/Types/constants'
export const getAllCounsellorListAction =
  (start, limit, sorting, order, search, token, admintype) => (dispatch) => {
    const data = {
      start,
      limit,
      sorting,
      order,
      search
    }
    dispatch({ type: constants.CLEAR_GET_ALL_COUNSELLOR_DATA })
    axios
      .post(
        `${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/${admintype}/counsellor/get-all-counsellor`,
        data,
        { headers: { Authorization: token } }
      )
      .then((response) => {
        dispatch({
          type: constants.GET_ALL_COUNSELLOR_DATA,
          payload: {
            resStatus: true,
            resMessage: response.data.message,
            counsellorList: response.data.data.rows,
            counsellorCount: response.data.data.count
          }
        })
      })
      .catch((error) => {
        dispatch({
          type: constants.GET_ALL_COUNSELLOR_DATA,
          payload: {
            resStatus: false,
            resMessage: error?.response?.data?.message
          }
        })
      })
  }

// update student
export const editSpecificCounsellor = (counsellorData, token, admintype) => (dispatch) => {
  dispatch({ type: constants.CLEAR_EDIT_SPECIFIC_COUNSELLOR })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/${admintype}/counsellor/update`, counsellorData, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.EDIT_SPECIFIC_COUNSELLOR,
      payload: {
        resStatus: true,
        resMessage: response.data?.message,
        isCounsellorEdited: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.EDIT_SPECIFIC_COUNSELLOR,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        isCounsellorEdited: false
      }
    })
  })
}

// delete student
export const deleteCouncellor = (counsellorData, token, admintype) => (dispatch) => {
  dispatch({ type: constants.CLEAR_DELETE_COUNSELLOR })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/${admintype}/counsellor/delete`, counsellorData, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.DELETE_COUNSELLOR,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        isDeleted: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.DELETE_COUNSELLOR,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        isDeleted: false
      }
    })
  })
}

// add student
export const addCounsellorAction = (counsellorData, token, admintype) => (dispatch) => {
  dispatch({ type: constants.CLEAR_ADD_COUNSELLOR_DATA })
  axios
    .post(
      `${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/${admintype}/counsellor/create`,
      counsellorData,
      { headers: { Authorization: token } }
    )
    .then((response) => {
      dispatch({
        type: constants.ADD_COUNSELLOR_DATA,
        payload: {
          resStatus: true,
          resMessage: response.data.message,
          isCounsellorAdded: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: constants.ADD_COUNSELLOR_DATA,
        payload: {
          resStatus: false,
          resMessage: error?.response?.data?.message,
          isCounsellorAdded: false
        }
      })
    })
}

// get specific student
export const getSpecificCounsellor = (id, token, admintype) => (dispatch) => {
  dispatch({ type: constants.CLEAR_GET_SPECIFIC_COUNSELLOR })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/${admintype}/counsellor/get-counsellor-by-id`, { id }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.GET_SPECIFIC_COUNSELLOR,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        resData: response.data.data
        // isStudentEdited: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.GET_SPECIFIC_COUNSELLOR,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        specificStudentData: false
        // isStudentEdited: false
      }
    })
  })
}

export const getAllCenters = () => (dispatch) => {
  dispatch({ type: constants.CLEAR_GET_ALL_CENTERS })
  axios
    .get(
      `${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/center/get_all_centers`
    )
    .then((response) => {
      dispatch({
        type: constants.GET_ALL_CENTERS,
        payload: {
          resStatus: true,
          resMessage: response.data.message,
          centers: response.data.data
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: constants.GET_ALL_CENTERS,
        payload: {
          resStatus: false,
          resMessage: error?.response?.data?.message
        }
      })
    })
}

// export counsellor
export const exportCounsellor = (data, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_EXPORT_COUNSELLORS })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/csv-counsellor`, data, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.EXPORT_COUNSELLORS,
      payload: {
        resStatus: true,
        resMessage: response.data?.message,
        exportedData: response.data?.data
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.EXPORT_COUNSELLORS,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        exportedData: null
      }
    })
  })
}
