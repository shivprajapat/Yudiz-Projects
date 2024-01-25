export default (state = {}, action = {}) => {
  switch (action.type) {
    case 'GET_ALL_RENTALS':
      return {
        ...state,
        allRentals: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case 'RENTAL_DETAIL':
      return {
        ...state,
        rentalDetail: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case 'RENTAL_TRANSACTIONS':
      return {
        ...state,
        rentalTransactions: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case 'TRANSACTION_DETAIL':
      return {
        ...state,
        transactionDetail: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case 'UPDATE_RENTAL':
      return {
        ...state,
        updatedUserData: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case 'ADD_RENTAL':
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case 'CHANGE_RENTAL_STATE':
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case 'UPDATE_RENTAL_TRANSITION':
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case 'UPDATE_RENTAL_TRANSITION_STATE':
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case 'CLEAR_RENTAL_RESPONSE':
      return {
        resStatus: false,
        resMessage: ''
      }
    default:
      return state
  }
}
