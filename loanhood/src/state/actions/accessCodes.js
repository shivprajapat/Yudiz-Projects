import axios from '../../axios'

const errMsg = 'Server is unavailable.'

export const GetAccessCodes = (val) => (dispatch) => {
  dispatch({ type: 'CLEAR_ACCESSCODES_RESPONSE' })
  axios
    .post('/admin/access-code', val)
    .then(({ data }) => {
      dispatch({
        type: 'GET_ACCESS_CODES',
        payload: {
          data: data.data,
          resMessage: '',
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'GET_ACCESS_CODES',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const GetAccessCodeDetail = (id) => (dispatch) => {
  dispatch({ type: 'CLEAR_ACCESSCODES_RESPONSE' })
  axios
    .get('/admin/access-code/' + id)
    .then(({ data }) => {
      dispatch({
        type: 'ACCESSCODE_DETAIL',
        payload: {
          data: data.data,
          resMessage: '',
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'ACCESSCODE_DETAIL',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const UpdateAccessCode = (val) => (dispatch) => {
  dispatch({ type: 'CLEAR_ACCESSCODES_RESPONSE' })

  axios
    .put('/admin/access-code', val)
    .then(({ data }) => {
      dispatch({
        type: 'UPDATE_ACCESSCODE',
        payload: {
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'UPDATE_ACCESSCODE',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const AddAccessCode = (val) => (dispatch) => {
  dispatch({ type: 'CLEAR_ACCESSCODES_RESPONSE' })

  axios
    .post('/admin/access-code/create', val)
    .then(({ data }) => {
      dispatch({
        type: 'ADD_ACCESSCODE',
        payload: {
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'ADD_ACCESSCODE',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const DeleteAccessCode = (id) => (dispatch) => {
  dispatch({ type: 'CLEAR_ACCESSCODES_RESPONSE' })

  axios
    .delete('/admin/access-code/' + id)
    .then(({ data }) => {
      dispatch({
        type: 'DELETE_ACCESSCODE',
        payload: {
          id: id,
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'DELETE_ACCESSCODE',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}
