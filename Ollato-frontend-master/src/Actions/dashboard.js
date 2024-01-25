
import axios from 'axios'
import constants from '../Shared/Types/constants'

/* Get Dashboard Count */
export const getDashboardCount = (token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_DASHBOARD_COUNT })
  axios.get(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/student/dashboard`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.DASHBOARD_COUNT,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        dashboardData: response.data.data
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.DASHBOARD_COUNT,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message
      }
    })
  })
}
