export default (state = {}, action = {}) => {
  switch (action.type) {
    case 'GET_USER':
      return {
        ...state,
        currentUser: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case 'CLEAR_USER_RESPONSE':
      return {
        resStatus: false,
        resMessage: ''
      }
    default:
      return state
  }
}
