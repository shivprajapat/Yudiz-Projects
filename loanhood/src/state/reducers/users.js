export default (state = {}, action = {}) => {
  switch (action.type) {
    case 'GET_USERS':
      return {
        ...state,
        users: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case 'USER_DETAIL':
      return {
        ...state,
        userDetail: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case 'UPDATE_USER':
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case 'CREATE_USER':
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case 'USER_RENTALS':
      return {
        ...state,
        userRentals: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case 'USER_LOAN_RENTALS':
      return {
        ...state,
        userLoanRentals: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case 'USER_BORROWER_RENTALS':
      return {
        ...state,
        userBorrowerRentals: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case 'USER_DELETE':
      return {
        ...state,
        users: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case 'CLEAR_USERS_RESPONSE':
      return {
        resStatus: false,
        resMessage: ''
      }
    case 'GET_PRE_SIGNED_URL':
      return {
        ...state,
        preSignedUrl: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    default:
      return state
  }
}
