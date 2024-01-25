export default (state = {}, action = {}) => {
  switch (action.type) {
    case 'GET_COLORS':
      return {
        ...state,
        colors: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case 'COLOR_DETAIL':
      return {
        ...state,
        colorDetail: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case 'UPDATE_COLORS':
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case 'ADD_COLORS':
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case 'DELETE_COLORS':
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case 'CLEAR_COLORS_RESPONSE':
      return {
        resStatus: false,
        resMessage: ''
      }
    default:
      return state
  }
}
