export default (state = {}, action = {}) => {
  switch (action.type) {
    case 'GET_MESSAGES':
      return {
        ...state,
        messages: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }

    case 'CLEAR_MESSAGES_RESPONSE':
      return {
        resStatus: false,
        resMessage: ''
      }
    default:
      return state
  }
}
