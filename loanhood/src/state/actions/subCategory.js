import axios from '../../axios'

const errMsg = 'Server is unavailable.'

export const GetSubCategories = (data) => (dispatch) => {
  dispatch({ type: 'CLEAR_SUB_CATEGORY_RESPONSE' })
  axios
    .post('/subcategories/admin', data)
    .then(({ data }) => {
      dispatch({
        type: 'GET_SUB_CATEGORIES',
        payload: {
          data: data.data,
          resMessage: '',
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'GET_SUB_CATEGORIES',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const SubCategoryDetail = (id) => (dispatch) => {
  dispatch({ type: 'CLEAR_SUB_CATEGORY_RESPONSE' })
  axios
    .get('/subcategories/' + id)
    .then(({ data }) => {
      dispatch({
        type: 'SUB_CATEGORY_DETAIL',
        payload: {
          data: data.data,
          resMessage: '',
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'SUB_CATEGORY_DETAIL',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const UpdateSubCategory = (id, data) => (dispatch) => {
  dispatch({ type: 'CLEAR_SUB_CATEGORY_RESPONSE' })
  axios
    .put('/subcategories/' + id, data)
    .then(({ data }) => {
      dispatch({
        type: 'UPDATE_SUB_CATEGORY',
        payload: {
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'UPDATE_SUB_CATEGORY',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const AddSubCategory = (data) => (dispatch) => {
  dispatch({ type: 'CLEAR_SUB_CATEGORY_RESPONSE' })
  axios
    .post('/subcategories', data)
    .then(({ data }) => {
      dispatch({
        type: 'ADD_SUB_CATEGORY',
        payload: {
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'ADD_SUB_CATEGORY',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const DeleteSubCategory = (id) => (dispatch) => {
  dispatch({ type: 'CLEAR_SUB_CATEGORY_RESPONSE' })
  axios
    .delete('/subcategories/' + id)
    .then(({ data }) => {
      dispatch({
        type: 'DELETE_SUB_CATEGORY',
        payload: {
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'DELETE_SUB_CATEGORY',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}
