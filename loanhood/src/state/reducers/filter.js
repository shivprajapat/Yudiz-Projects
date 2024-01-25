export default (state = {}, action = {}) => {
  switch (action.type) {
    case 'GET_ALL_CATEGORIES':
      return {
        ...state,
        allCategories: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case 'GET_ALL_BRANDS':
      return {
        ...state,
        allBrands: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case 'GET_ALL_MATERIALS':
      return {
        ...state,
        allMaterials: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case 'GET_ALL_COLORS':
      return {
        ...state,
        allColors: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case 'GET_ALL_USERS':
      return {
        ...state,
        allUsers: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case 'CLEAR_FILTER_RESPONSE':
      return {
        resStatus: false,
        resMessage: ''
      }
    default:
      return state
  }
}
