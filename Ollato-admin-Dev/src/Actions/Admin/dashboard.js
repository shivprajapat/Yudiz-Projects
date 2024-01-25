import axios from 'axios'
import constants from '../../Shared/Types/constants'

export const getDashboardDataAdminAction = (token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_GET_ADMIN_DASHBOARD })
  axios.get(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/dashboard`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.GET_ADMIN_DASHBOARD,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        dashboardDataAdmin: response.data.data
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.GET_ADMIN_DASHBOARD,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message
      }
    })
  })
}
