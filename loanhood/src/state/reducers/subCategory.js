export default (state = {}, action = {}) => {
  switch (action.type) {
    case 'GET_SUB_CATEGORIES':
      return {
        ...state,
        subCategories: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case 'SUB_CATEGORY_DETAIL':
      return {
        ...state,
        subCategoryDetail: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case 'UPDATE_SUB_CATEGORY':
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case 'ADD_SUB_CATEGORY':
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case 'DELETE_SUB_CATEGORY':
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case 'CLEAR_SUB_CATEGORY_RESPONSE':
      return {
        resStatus: false,
        resMessage: ''
      }
    default:
      return state
  }
}
