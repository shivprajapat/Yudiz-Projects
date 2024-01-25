import axios from 'axios'
import constants from '../../Shared/Types/constants'

// Board Action
/* Add Board Functionality */
export const addBoardAction = (boardData, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_ADD_BOARD_DATA })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/board/create`, boardData, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.ADD_BOARD_DATA,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        isBoardAdded: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.ADD_BOARD_DATA,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        isBoardAdded: false
      }
    })
  })
}

/* Add Board Functionality */
export const getAllBoardListAction = (start, limit, sort, order, search, token) => (dispatch) => {
  const data = {
    start,
    limit,
    sort,
    order,
    search
  }
  dispatch({ type: constants.CLEAR_GET_ALL_BOARD_DATA })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/board/get-all-board`, data, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.GET_ALL_BOARD_DATA,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        boardList: response.data.data,
        boardCount: response.data.total
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.GET_ALL_BOARD_DATA,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message
      }
    })
  })
}
/* Get Specific Board Functionality */
export const getSpecificBoardData = (id, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_GET_SPECIFIC_BOARD })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/board/get-board-by-id`, { id }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.GET_SPECIFIC_BOARD,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        specificBoardData: response.data.data
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.GET_SPECIFIC_BOARD,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        specificBoardData: false
      }
    })
  })
}

/* Get Specific Board Functionality */
export const editSpecificBoard = (boardData, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_EDIT_SPECIFIC_BOARD })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/board/update`, boardData, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.EDIT_SPECIFIC_BOARD,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        isBoardEdited: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.EDIT_SPECIFIC_BOARD,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        isBoardEdited: false
      }
    })
  })
}

/* Get Specific Board Functionality */
export const deleteBoard = (boardData, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_DELETE_BOARD })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/board/delete`, boardData, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.DELETE_BOARD,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        isDeleted: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.DELETE_BOARD,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        isDeleted: false
      }
    })
  })
}
