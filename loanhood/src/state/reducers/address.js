export default (state = {}, action = {}) => {
  switch (action.type) {
    case 'GET_USER_ADDRESS':
      return {
        ...state,
        userAddress: action.payload.data
      }
    case 'UPDATE_USER_ADDRESS':
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case 'GET_SINGLE_ADDRESS':
      return {
        ...state,
        singleAddress: action.payload.data
      }
    case 'ADD_USER_ADDRESS':
      return {
        ...state,
        newAddress: action.payload.newAddress,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case 'CLEAR_ADDRESS_RESPONSE':
      return {
        resStatus: false,
        resMessage: ''
      }
    default:
      return state
  }
}
