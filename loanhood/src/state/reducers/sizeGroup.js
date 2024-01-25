export default (state = {}, action = {}) => {
  switch (action.type) {
    case 'GET_SIZE_GROUPS':
      return {
        ...state,
        sizeGroups: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case 'GET_ALL_SIZE_GROUPS':
      return {
        ...state,
        allSizeGroups: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case 'SIZE_GROUPS_DETAIL':
      return {
        ...state,
        sizeGroupsDetail: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case 'UPDATE_SIZE_GROUPS':
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case 'ADD_SIZE_GROUPS':
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case 'DELETE_SIZE_GROUPS':
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case 'CLEAR_SIZE_GROUPS_RESPONSE':
      return {
        resStatus: false,
        resMessage: ''
      }
    default:
      return state
  }
}
