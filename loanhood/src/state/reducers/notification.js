export default (state = {}, action = {}) => {
  switch (action.type) {
    case 'GET_NOTIFICATIONS':
      return {
        ...state,
        notifications: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }

    case 'CLEAR_NOTIFICATIONS_RESPONSE':
      return {
        resStatus: false,
        resMessage: ''
      }
    default:
      return state
  }
}
