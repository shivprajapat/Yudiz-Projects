import { CLEAR_GENERATE_REPORT_MESSAGE, GET_REPORT_LIST } from '../actions/constants'

export default (state = {}, action = {}) => {
  switch (action.type) {
    case GET_REPORT_LIST:
      return {
        ...state,
        reportList: action.payload.data,
        resMessage: action.payload.resMessage,
        resStatus: action.payload.resStatus
      }
    case CLEAR_GENERATE_REPORT_MESSAGE:
      return {
        resMessage: ''
      }
    default:
      return state
  }
}
