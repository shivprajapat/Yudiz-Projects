import axios from '../../axios'

const errMsg = 'Server is unavailable.'

export const GetSizes = (data) => (dispatch) => {
  dispatch({ type: 'CLEAR_SIZE_RESPONSE' })
  axios
    .post('/sizes/admin', data)
    .then(({ data }) => {
      dispatch({
        type: 'GET_SIZES',
        payload: {
          data: data.data,
          resMessage: '',
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'GET_SIZES',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const SizeDetail = (id) => (dispatch) => {
  dispatch({ type: 'CLEAR_SIZE_RESPONSE' })
  axios
    .get('/sizes/' + id)
    .then(({ data }) => {
      dispatch({
        type: 'SIZE_DETAIL',
        payload: {
          data: data.data,
          resMessage: '',
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'SIZE_DETAIL',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const UpdateSize = (id, data) => (dispatch) => {
  dispatch({ type: 'CLEAR_SIZE_RESPONSE' })
  axios
    .put('/sizes/' + id, data)
    .then(({ data }) => {
      dispatch({
        type: 'UPDATE_SIZE',
        payload: {
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'UPDATE_SIZE',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const AddSize = (data) => (dispatch) => {
  dispatch({ type: 'CLEAR_SIZE_RESPONSE' })
  axios
    .post('/sizes', data)
    .then(({ data }) => {
      dispatch({
        type: 'ADD_SIZE',
        payload: {
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'ADD_SIZE',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const DeleteSize = (id) => (dispatch) => {
  dispatch({ type: 'CLEAR_SIZE_RESPONSE' })
  axios
    .delete('/sizes/' + id)
    .then(({ data }) => {
      dispatch({
        type: 'DELETE_SIZE',
        payload: {
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'DELETE_SIZE',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}
