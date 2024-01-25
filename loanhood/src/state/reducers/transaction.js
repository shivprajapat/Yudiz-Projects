export default (state = {}, action = {}) => {
  switch (action.type) {
    case 'GET_TRANSACTIONS':
      return {
        ...state,
        transactions: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case 'CLEAR_TRANSACTIONS_RESPONSE':
      return {
        resStatus: false,
        resMessage: ''
      }
    default:
      return state
  }
}
