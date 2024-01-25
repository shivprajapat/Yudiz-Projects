export default (state = {}, action = {}) => {
  switch (action.type) {
    case 'GET_SPLASH_SCREEN':
      return {
        ...state,
        splashScreens: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case 'SPLASH_SCREEN_DETAIL':
      return {
        ...state,
        splashScreenDetail: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case 'UPDATE_SPLASH_SCREEN':
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case 'ADD_SPLASH_SCREEN':
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case 'DELETE_SPLASH_SCREEN':
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case 'CLEAR_SPLASH_SCREEN_RESPONSE':
      return {
        resStatus: false,
        resMessage: ''
      }
    default:
      return state
  }
}
