import axios from '../../axios'

const errMsg = 'Server is unavailable.'

export const GetAllCategories = () => (dispatch) => {
  dispatch({ type: 'CLEAR_FILTER_RESPONSE' })
  axios
    .get('/categories')
    .then(({ data }) => {
      dispatch({
        type: 'GET_ALL_CATEGORIES',
        payload: {
          data: data.data,
          resMessage: '',
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'GET_ALL_CATEGORIES',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const GetAllBrands = () => (dispatch) => {
  dispatch({ type: 'CLEAR_FILTER_RESPONSE' })
  axios
    .get('/brands')
    .then(({ data }) => {
      dispatch({
        type: 'GET_ALL_BRANDS',
        payload: {
          data: data.data,
          resMessage: '',
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'GET_ALL_BRANDS',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const GetAllMaterials = () => (dispatch) => {
  dispatch({ type: 'CLEAR_FILTER_RESPONSE' })
  axios
    .get('/materials')
    .then(({ data }) => {
      dispatch({
        type: 'GET_ALL_MATERIALS',
        payload: {
          data: data.data,
          resMessage: '',
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'GET_ALL_MATERIALS',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const GetAllColors = () => (dispatch) => {
  dispatch({ type: 'CLEAR_FILTER_RESPONSE' })
  axios
    .get('/colors')
    .then(({ data }) => {
      dispatch({
        type: 'GET_ALL_COLORS',
        payload: {
          data: data.data,
          resMessage: '',
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'GET_ALL_COLORS',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const GetAllUsers = () => (dispatch) => {
  dispatch({ type: 'CLEAR_FILTER_RESPONSE' })
  axios
    .get('/user')
    .then(({ data }) => {
      dispatch({
        type: 'GET_ALL_USERS',
        payload: {
          data: data.data,
          resMessage: '',
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'GET_ALL_USERS',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}
