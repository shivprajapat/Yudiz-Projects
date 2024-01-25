export default (state = {}, action = {}) => {
  switch (action.type) {
    case 'GET_REPORTS':
      return {
        ...state,
        report: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case 'REPORT_DETAIL':
      return {
        ...state,
        reportDetail: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case 'UPDATE_REPORT':
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }

    case 'CLEAR_REPORT_RESPONSE':
      return {
        resStatus: false,
        resMessage: ''
      }
    default:
      return state
  }
}
