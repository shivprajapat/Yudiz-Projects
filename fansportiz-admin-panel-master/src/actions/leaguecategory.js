import axios from '../axios'
import { catchFunc, successFunc } from '../helpers/helper'
import { DELETE_FILTER_CATEGORY, CLEAR_DELETE_FILTER_CATEGORY, ADD_FILTER_CATEGORY, ADD_LEAGUE_CATEGORY, CLEAR_LEAGUE_MESSAGE, FILTER_CATEGORIES_LIST, FILTER_CATEGORY_DETAILS, FILTER_CATEGORY_LIST, LEAGUE_CATEGORIES_LIST, LEAGUE_CATEGORY_DETAILS, LEAGUE_CATEGORY_LIST, UPDATE_FILTER_CATEGORY, UPDATE_LEAGUE_CATEGORY, DELETE_LEAGUE_CATEGORY } from './constants'
const errMsg = 'Server is unavailable.'

export const getListOfCategory = (token) => async (dispatch) => {
  await axios.get('/league-category/v1', { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: LEAGUE_CATEGORY_LIST,
      payload: {
        data: response.data.data ? response.data.data : [],
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: LEAGUE_CATEGORY_LIST,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const deleteFilterCategory = (Id, token) => async (dispatch) => {
  dispatch({ type: CLEAR_DELETE_FILTER_CATEGORY })
  await axios.delete(`/filter-category/${Id}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: DELETE_FILTER_CATEGORY,
      payload: {
        resMessage: response.data.message,
        resStatus: true,
        isDeleted: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: DELETE_FILTER_CATEGORY,
      payload: {
        resMessage: error.response ? error.response.data.message : errMsg,
        resStatus: false,
        isDeleted: false
      }
    })
  })
}

export const getLeagueCategoryList = (start, limit, sort, order, search, token) => async (dispatch) => {
  await axios.get(`/league-category/list/v1?start=${start}&limit=${limit}&sort=${sort}&order=${order}&search=${search}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: LEAGUE_CATEGORIES_LIST,
      payload: {
        data: response.data.data[0] ? response.data.data[0] : [],
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: LEAGUE_CATEGORIES_LIST,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const getFilterCategoryList = (start, limit, sort, order, search, token) => async (dispatch) => {
  await axios.get(`/filter-category/list/v1?start=${start}&limit=${limit}&sort=${sort}&order=${order}&search=${search}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: FILTER_CATEGORIES_LIST,
      payload: {
        data: response.data.data[0] ? response.data.data[0] : [],
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: FILTER_CATEGORIES_LIST,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const getLeagueCategoryDetails = (Id, token) => async (dispatch) => {
  await axios.get(`/league-category/${Id}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: LEAGUE_CATEGORY_DETAILS,
      payload: {
        data: response.data.data,
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: LEAGUE_CATEGORY_DETAILS,
      payload: {
        data: {},
        resStatus: false
      }
    })
  })
}

export const getFilterCategoryDetails = (Id, token) => async (dispatch) => {
  await axios.get(`/filter-category/${Id}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: FILTER_CATEGORY_DETAILS,
      payload: {
        data: response.data.data,
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: FILTER_CATEGORY_DETAILS,
      payload: {
        data: {},
        resStatus: false
      }
    })
  })
}

export const addNewLeagueCategory = (Title, Position, Remark, leagueCategoryImage, token) => async (dispatch) => {
  dispatch({ type: CLEAR_LEAGUE_MESSAGE })
  try {
    if (leagueCategoryImage) {
      const response = await axios.post('/league-category/pre-signed-url/v1', { sFileName: leagueCategoryImage.file.name, sContentType: leagueCategoryImage.file.type }, { headers: { Authorization: token } })
      const url = response.data.data.sUrl
      const sImage = response.data.data.sPath
      await axios.put(url, leagueCategoryImage.file, { headers: { 'Content-Type': leagueCategoryImage.file.type } })
      await axios.post('/league-category/v1', {
        sTitle: Title, nPosition: Position, sRemark: Remark, sImage
      }, { headers: { Authorization: token } }).then((response1) => {
        dispatch(successFunc(ADD_LEAGUE_CATEGORY, response1))
      })
    } else {
      await axios.post('/league-category/v1', {
        sTitle: Title, nPosition: Position, sRemark: Remark, sImage: ''
      }, { headers: { Authorization: token } }).then((response2) => {
        dispatch(successFunc(ADD_LEAGUE_CATEGORY, response2))
      })
    }
  } catch (error) {
    dispatch(catchFunc(ADD_LEAGUE_CATEGORY, error))
  }
}

export const getFilterCategory = (token) => async (dispatch) => {
  await axios.get('/filter-category/v1', { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: FILTER_CATEGORY_LIST,
      payload: {
        data: response.data.data ? response.data.data : [],
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: FILTER_CATEGORY_LIST,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const addNewFilterCategory = (Title, Remark, token) => async (dispatch) => {
  dispatch({ type: CLEAR_LEAGUE_MESSAGE })
  await axios.post('/filter-category/v1', {
    sTitle: Title,
    sRemark: Remark
  }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: ADD_FILTER_CATEGORY,
      payload: {
        data: response.data.data,
        resStatus: true,
        resMessage: response.data.message
      }
    })
  }).catch((error) => {
    dispatch({
      type: ADD_FILTER_CATEGORY,
      payload: {
        data: {},
        resStatus: false,
        resMessage: error.response ? error.response.data.message : errMsg
      }
    })
  })
}

export const updateNewLeagueCategory = (Title, Position, Remark, leagueCategoryImage, token, ID) => async (dispatch) => {
  dispatch({ type: CLEAR_LEAGUE_MESSAGE })
  try {
    if (leagueCategoryImage && leagueCategoryImage.file) {
      const response = await axios.post('/league-category/pre-signed-url/v1', { sFileName: leagueCategoryImage.file.name, sContentType: leagueCategoryImage.file.type }, { headers: { Authorization: token } })
      const url = response.data.data.sUrl
      const sImage = response.data.data.sPath
      await axios.put(url, leagueCategoryImage.file, { headers: { 'Content-Type': leagueCategoryImage.file.type } })
      await axios.put(`/league-category/${ID}/v1`, {
        sTitle: Title, nPosition: Position, sRemark: Remark, sImage
      }, { headers: { Authorization: token } }).then((response2) => {
        dispatch({
          type: UPDATE_LEAGUE_CATEGORY,
          payload: {
            data: response2.data.data,
            resStatus: true,
            resMessage: response2.data.message
          }
        })
      })
    } else {
      await axios.put(`/league-category/${ID}/v1`, {
        sTitle: Title, nPosition: Position, sRemark: Remark, sImage: leagueCategoryImage
      }, { headers: { Authorization: token } }).then((response) => {
        dispatch({
          type: UPDATE_LEAGUE_CATEGORY,
          payload: {
            data: response.data.data,
            resStatus: true,
            resMessage: response.data.message
          }
        })
      })
    }
  } catch (error) {
    dispatch(catchFunc(UPDATE_LEAGUE_CATEGORY, error))
  }
}

export const updateNewFilterCategory = (Title, Remark, token, ID) => async (dispatch) => {
  dispatch({ type: CLEAR_LEAGUE_MESSAGE })
  await axios.put(`/filter-category/${ID}/v1`, {
    sTitle: Title,
    sRemark: Remark
  }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: UPDATE_FILTER_CATEGORY,
      payload: {
        data: response.data.data,
        resStatus: true,
        resMessage: response.data.message
      }
    })
  }).catch((error) => {
    dispatch({
      type: UPDATE_FILTER_CATEGORY,
      payload: {
        data: {},
        resStatus: false,
        resMessage: error.response ? error.response.data.message : errMsg
      }
    })
  })
}

export const deleteLeagueCategory = (Id, token) => async (dispatch) => {
  dispatch({ type: CLEAR_DELETE_FILTER_CATEGORY })
  await axios.delete(`/league-category/${Id}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: DELETE_LEAGUE_CATEGORY,
      payload: {
        resMessage: response.data.message,
        resStatus: true,
        isDeleted: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: DELETE_LEAGUE_CATEGORY,
      payload: {
        resMessage: error.response ? error.response.data.message : errMsg,
        resStatus: false,
        isDeleted: false
      }
    })
  })
}
