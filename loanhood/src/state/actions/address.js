import axios from '../../axios'

const errMsg = 'Server is unavailable.'

export const GetAddressOfUser = (val) => (dispatch) => {
  dispatch({ type: 'CLEAR_ADDRESS_RESPONSE' })
  axios
    .get(`/address/${val}`)
    .then(({ data }) => {
      dispatch({
        type: 'GET_USER_ADDRESS',
        payload: {
          data: data.data
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'GET_USER_ADDRESS',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const GetSingleAddress = (id) => (dispatch) => {
  dispatch({ type: 'CLEAR_ADDRESS_RESPONSE' })
  axios
    .get(`address/single-address/${id}`)
    .then(({ data }) => {
      dispatch({
        type: 'GET_SINGLE_ADDRESS',
        payload: {
          data: data.data
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'GET_SINGLE_ADDRESS',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const UpdateAddressOfUser = (id, val) => (dispatch) => {
  dispatch({ type: 'CLEAR_ADDRESS_RESPONSE' })
  axios
    .put('/address/' + id, val)
    .then(({ data }) => {
      dispatch({
        type: 'UPDATE_USER_ADDRESS',
        payload: {
          data: data.data,
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'UPDATE_USER_ADDRESS',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const AddUserAddress = (id, val) => (dispatch) => {
  dispatch({ type: 'CLEAR_ADDRESS_RESPONSE' })
  axios
    .post('/address/' + id, val)
    .then(({ data }) => {
      dispatch({
        type: 'ADD_USER_ADDRESS',
        payload: {
          newAddress: data.data,
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'ADD_USER_ADDRESS',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}
