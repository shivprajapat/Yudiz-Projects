import axios from '../../axios'

const errMsg = 'Server is unavailable.'

export const GetSizeGroups = (data) => (dispatch) => {
  dispatch({ type: 'CLEAR_SIZE_GROUPS_RESPONSE' })
  axios
    .post('/sizegroups/admin', data)
    .then(({ data }) => {
      dispatch({
        type: 'GET_SIZE_GROUPS',
        payload: {
          data: data.data,
          resMessage: '',
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'GET_SIZE_GROUPS',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const GetAllSizeGroups = () => (dispatch) => {
  dispatch({ type: 'CLEAR_SIZE_GROUPS_RESPONSE' })
  axios
    .get('/sizegroups')
    .then(({ data }) => {
      dispatch({
        type: 'GET_ALL_SIZE_GROUPS',
        payload: {
          data: data.data,
          resMessage: '',
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'GET_ALL_SIZE_GROUPS',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const SizeGroupDetail = (id) => (dispatch) => {
  dispatch({ type: 'CLEAR_SIZE_GROUPS_RESPONSE' })
  axios
    .get('/sizegroups/' + id)
    .then(({ data }) => {
      dispatch({
        type: 'SIZE_GROUPS_DETAIL',
        payload: {
          data: data.data,
          resMessage: '',
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'SIZE_GROUPS_DETAIL',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const UpdateSizeGroup = (id, name) => (dispatch) => {
  dispatch({ type: 'CLEAR_SIZE_GROUPS_RESPONSE' })
  axios
    .put('/sizegroups/' + id, { name: name })
    .then(({ data }) => {
      dispatch({
        type: 'UPDATE_SIZE_GROUPS',
        payload: {
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'UPDATE_SIZE_GROUPS',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const AddSizeGroup = (name) => (dispatch) => {
  dispatch({ type: 'CLEAR_SIZE_GROUPS_RESPONSE' })
  axios
    .post('/sizegroups', { name: name })
    .then(({ data }) => {
      dispatch({
        type: 'ADD_SIZE_GROUPS',
        payload: {
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'ADD_SIZE_GROUPS',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const DeleteSizeGroup = (id) => (dispatch) => {
  dispatch({ type: 'CLEAR_SIZE_GROUPS_RESPONSE' })
  axios
    .delete('/sizegroups/' + id)
    .then(({ data }) => {
      dispatch({
        type: 'DELETE_SIZE_GROUPS',
        payload: {
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'DELETE_SIZE_GROUPS',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}
