import constants from '../../Shared/Types/constants'

/* initial state */
const initialAuthState = {
  resStatus: null,
  resMessage: null,
  isRoleAdded: null,
  roleCount: null,
  isRoleEdited: null,
  isDeleted: null,
  roleList: null,
  moduleData: null,
  resData: null,
  isLoading: false
}

export default (state = initialAuthState, action) => {
  switch (action.type) {
    case constants.ADD_ROLE:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isRoleAdded: action.payload.isRoleAdded
      }
    case constants.CLEAR_ADD_ROLE:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isRoleAdded: null
      }
    case constants.GET_ALL_ROLE:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        roleList: action.payload.roleList,
        roleCount: action.payload.roleCount,
        isLoading: false
      }
    case constants.CLEAR_GET_ALL_ROLE:
      return {
        ...state,
        resStatus: null,
        roleCount: null,
        isLoading: true
      }
    case constants.GET_ALL_MODULE:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        moduleData: action.payload.moduleData
      }
    case constants.CLEAR_GET_ALL_MODULE:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        moduleData: null
      }
    case constants.GET_SPECIFIC_ROLE:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        resData: action.payload.resData
      }
    case constants.CLEAR_GET_SPECIFIC_ROLE:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        resData: null
      }
    case constants.EDIT_SPECIFIC_ROLE:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isRoleEdited: action.payload.isRoleEdited
      }
    case constants.CLEAR_EDIT_SPECIFIC_ROLE:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isRoleEdited: null
      }
    case constants.DELETE_ROLE:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isDeleted: action.payload.isDeleted
      }
    case constants.CLEAR_DELETE_ROLE:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isDeleted: null
      }
    default:
      return state
  }
}
