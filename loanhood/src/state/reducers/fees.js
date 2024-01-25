export default (state = {}, action = {}) => {
  switch (action.type) {
    case 'GET_FEES':
      return {
        ...state,
        fees: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }

    case 'UPDATE_FEES':
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }

    case 'CLEAR_FEES_RESPONSE':
      return {
        resStatus: false,
        resMessage: ''
      }
    default:
      return state
  }
}
