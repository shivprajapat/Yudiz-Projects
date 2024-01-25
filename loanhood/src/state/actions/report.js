import axios from '../../axios'

const errMsg = 'Server is unavailable.'

export const GetReports = (val) => (dispatch) => {
  dispatch({ type: 'CLEAR_REPORTS_RESPONSE' })
  axios
    .post('/admin/report', val)
    .then(({ data }) => {
      dispatch({
        type: 'GET_REPORTS',
        payload: {
          data: data.data,
          resMessage: '',
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'GET_REPORTS',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const GetReportDetail = (id) => (dispatch) => {
  dispatch({ type: 'CLEAR_REPORTS_RESPONSE' })
  axios
    .get('/admin/report/' + id)
    .then(({ data }) => {
      dispatch({
        type: 'REPORT_DETAIL',
        payload: {
          data: data.data,
          resMessage: '',
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'REPORT_DETAIL',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const UpdateReport = (id, val) => (dispatch) => {
  dispatch({ type: 'CLEAR_REPORTS_RESPONSE' })

  axios
    .put('/admin/report/' + id, val)
    .then(({ data }) => {
      dispatch({
        type: 'UPDATE_REPORT',
        payload: {
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'UPDATE_REPORT',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}
