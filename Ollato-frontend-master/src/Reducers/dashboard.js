import constants from '../Shared/Types/constants'

/* initial state */
const initialAuthState = {
  resStatus: null,
  resMessage: null,
  dashboardData: []
}

export default (state = initialAuthState, action) => {
  switch (action.type) {
    case constants.DASHBOARD_COUNT:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        dashboardData: action.payload.dashboardData
      }
    case constants.CLEAR_DASHBOARD_COUNT:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        dashboardData: null
      }
    default:
      return state
  }
}
