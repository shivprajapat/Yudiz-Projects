import axios from '../../axios'

const errMsg = 'Server is unavailable.'

export const GetCategories = (data) => (dispatch) => {
  dispatch({ type: 'CLEAR_CATEGORY_RESPONSE' })
  axios
    .post('/categories/admin', data)
    .then(({ data }) => {
      dispatch({
        type: 'GET_CATEGORIES',
        payload: {
          data: data.data,
          resMessage: '',
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'GET_CATEGORIES',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const CategoryDetail = (id) => (dispatch) => {
  dispatch({ type: 'CLEAR_CATEGORY_RESPONSE' })
  axios
    .get('/categories/' + id)
    .then(({ data }) => {
      dispatch({
        type: 'CATEGORY_DETAIL',
        payload: {
          data: data.data,
          resMessage: '',
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'CATEGORY_DETAIL',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const UpdateCategory = (id, name) => (dispatch) => {
  dispatch({ type: 'CLEAR_CATEGORY_RESPONSE' })
  axios
    .put('/categories/' + id, { name: name })
    .then(({ data }) => {
      dispatch({
        type: 'UPDATE_CATEGORY',
        payload: {
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'UPDATE_CATEGORY',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const AddCategory = (name) => (dispatch) => {
  dispatch({ type: 'CLEAR_CATEGORY_RESPONSE' })
  axios
    .post('/categories', { name: name })
    .then(({ data }) => {
      dispatch({
        type: 'ADD_CATEGORY',
        payload: {
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'ADD_CATEGORY',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const DeleteCategory = (id) => (dispatch) => {
  dispatch({ type: 'CLEAR_CATEGORY_RESPONSE' })
  axios
    .delete('/categories/' + id)
    .then(({ data }) => {
      dispatch({
        type: 'DELETE_CATEGORY',
        payload: {
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'DELETE_CATEGORY',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}
