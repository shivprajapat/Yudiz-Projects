export default (state = {}, action = {}) => {
  switch (action.type) {
    case 'GET_ACCESS_CODES':
      return {
        ...state,
        codes: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case 'ACCESSCODE_DETAIL':
      return {
        ...state,
        codeDetail: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case 'UPDATE_ACCESSCODE':
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case 'ADD_ACCESSCODE':
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case 'CLEAR_ACCESSCODES_RESPONSE':
      return {
        ...state,
        resStatus: false,
        resMessage: ''
      }
    case 'DELETE_ACCESSCODE':
      return {
        ...state,
        codes: { count: state?.codes?.count - 1, rows: state?.codes?.rows?.filter((c) => c?.id !== action.payload.id) },
        resStatus: false,
        resMessage: action.payload.resMessage
      }
    default:
      return state
  }
}
