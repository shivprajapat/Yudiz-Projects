import axios from '../../axios'

const errMsg = 'Server is unavailable.'

export const GetBrands = (data) => (dispatch) => {
  dispatch({ type: 'CLEAR_BRANDS_RESPONSE' })
  axios
    .post('/brands/admin', data)
    .then(({ data }) => {
      dispatch({
        type: 'GET_BRANDS',
        payload: {
          data: data.data,
          resMessage: '',
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'GET_BRANDS',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const BrandDetail = (id) => (dispatch) => {
  dispatch({ type: 'CLEAR_BRANDS_RESPONSE' })
  axios
    .get('/brands/' + id)
    .then(({ data }) => {
      dispatch({
        type: 'BRAND_DETAIL',
        payload: {
          data: data.data,
          resMessage: '',
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'BRAND_DETAIL',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const UpdateBrand = (id, name) => (dispatch) => {
  dispatch({ type: 'CLEAR_BRANDS_RESPONSE' })
  axios
    .put('/brands/' + id, { name: name })
    .then(({ data }) => {
      dispatch({
        type: 'UPDATE_BRAND',
        payload: {
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'UPDATE_BRAND',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const AddBrand = (name) => (dispatch) => {
  dispatch({ type: 'CLEAR_BRANDS_RESPONSE' })
  axios
    .post('/brands', { name: name })
    .then(({ data }) => {
      dispatch({
        type: 'ADD_BRAND',
        payload: {
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'ADD_BRAND',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const DeleteBrand = (id) => (dispatch) => {
  dispatch({ type: 'CLEAR_BRANDS_RESPONSE' })
  axios
    .delete('/brands/' + id)
    .then(({ data }) => {
      dispatch({
        type: 'DELETE_BRAND',
        payload: {
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'DELETE_BRAND',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}
