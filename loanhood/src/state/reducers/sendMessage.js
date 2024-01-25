export default (state = {}, action = {}) => {
  switch (action.type) {
    case 'SEND_MESSAGES':
      return {
        ...state,
        sendMessages: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }

    case 'CLEAR_SEND_MESSAGES_RESPONSE':
      return {
        resStatus: false,
        resMessage: ''
      }
    default:
      return state
  }
}
