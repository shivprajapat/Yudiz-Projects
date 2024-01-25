import axios from '../../axios'

const errMsg = 'Server is unavailable.'

export const GetBannerTexts = (data) => (dispatch) => {
  dispatch({ type: 'CLEAR_BANNER_TEXT_RESPONSE' })
  axios
    .post('/app-text/admin', data)
    .then(({ data }) => {
      dispatch({
        type: 'GET_BANNER_TEXTS',
        payload: {
          data: data.data,
          resMessage: '',
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'GET_BANNER_TEXTS',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const ChangeBannerTextOrder = (data) => (dispatch) => {
  dispatch({ type: 'CLEAR_BANNER_TEXT_RESPONSE' })
  axios
    .put('/app-text/change-order', data)
    .then(({ data }) => {
      dispatch({
        type: 'CHANGE_BANNER_TEXT_ORDER',
        payload: {
          data: data.data,
          resMessage: '',
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'CHANGE_BANNER_TEXT_ORDER',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const BannerTextDetail = (id) => (dispatch) => {
  dispatch({ type: 'CLEAR_BANNER_TEXT_RESPONSE' })
  axios
    .get('/app-text/' + id)
    .then(({ data }) => {
      dispatch({
        type: 'BANNER_TEXT_DETAIL',
        payload: {
          data: data.data,
          resMessage: '',
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'BANNER_TEXT_DETAIL',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const UpdateBannerText = (id, text) => (dispatch) => {
  dispatch({ type: 'CLEAR_BANNER_TEXT_RESPONSE' })
  axios
    .put('/app-text/' + id, { text: text })
    .then(({ data }) => {
      dispatch({
        type: 'UPDATE_BANNER_TEXT',
        payload: {
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'UPDATE_BANNER_TEXT',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const AddBannerText = (text) => (dispatch) => {
  dispatch({ type: 'CLEAR_BANNER_TEXT_RESPONSE' })
  axios
    .post('/app-text', { text: text })
    .then(({ data }) => {
      dispatch({
        type: 'ADD_BANNER_TEXT',
        payload: {
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'ADD_BANNER_TEXT',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const DeleteBannerText = (id) => (dispatch) => {
  dispatch({ type: 'CLEAR_BANNER_TEXT_RESPONSE' })
  axios
    .delete('/app-text/' + id)
    .then(({ data }) => {
      dispatch({
        type: 'DELETE_BANNER_TEXT',
        payload: {
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'DELETE_BANNER_TEXT',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}
