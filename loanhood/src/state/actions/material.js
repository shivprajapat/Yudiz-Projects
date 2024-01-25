import axios from '../../axios'

const errMsg = 'Server is unavailable.'

export const GetMaterials = (data) => (dispatch) => {
  dispatch({ type: 'CLEAR_MATERIAL_RESPONSE' })
  axios
    .post('/materials/admin', data)
    .then(({ data }) => {
      dispatch({
        type: 'GET_MATERIALS',
        payload: {
          data: data.data,
          resMessage: '',
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'GET_MATERIALS',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const MaterialDetail = (id) => (dispatch) => {
  dispatch({ type: 'CLEAR_MATERIAL_RESPONSE' })
  axios
    .get('/materials/' + id)
    .then(({ data }) => {
      dispatch({
        type: 'MATERIAL_DETAIL',
        payload: {
          data: data.data,
          resMessage: '',
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'MATERIAL_DETAIL',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const UpdateMaterial = (id, name) => (dispatch) => {
  dispatch({ type: 'CLEAR_MATERIAL_RESPONSE' })
  axios
    .put('/materials/' + id, { name: name })
    .then(({ data }) => {
      dispatch({
        type: 'UPDATE_MATERIAL',
        payload: {
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'UPDATE_MATERIAL',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const AddMaterial = (name) => (dispatch) => {
  dispatch({ type: 'CLEAR_MATERIAL_RESPONSE' })
  axios
    .post('/materials', { name: name })
    .then(({ data }) => {
      dispatch({
        type: 'ADD_MATERIAL',
        payload: {
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'ADD_MATERIAL',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const DeleteMaterial = (id) => (dispatch) => {
  dispatch({ type: 'CLEAR_MATERIAL_RESPONSE' })
  axios
    .delete('/materials/' + id)
    .then(({ data }) => {
      dispatch({
        type: 'DELETE_MATERIAL',
        payload: {
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'DELETE_MATERIAL',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}
