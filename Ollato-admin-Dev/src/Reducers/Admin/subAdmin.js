import constants from '../../Shared/Types/constants'

const initialAuthState = {
  resStatus: null,
  resMessage: null,
  isSubAdminAdded: null,
  subAdminList: null,
  subAdminCount: null,
  resData: null,
  isSubAdminEdited: null,
  isDeleted: null,
  isLoading: false
}

export default (state = initialAuthState, action) => {
  switch (action.type) {
    case constants.ADD_SUBADMIN_DATA:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isSubAdminAdded: action.payload.isSubAdminAdded
      }
    case constants.CLEAR_ADD_SUBADMIN_DATA:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isSubAdminAdded: null
      }
    case constants.GET_ALL_SUBADMIN_DATA:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        subAdminList: action.payload.subAdminList,
        subAdminCount: action.payload.subAdminCount,
        isLoading: false
      }
    case constants.CLEAR_GET_ALL_SUBADMIN_DATA:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        subAdminCount: null,
        isLoading: true
      }
    case constants.GET_ALL_ROLE_SELECT:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        roleData: action.payload.roleData
      }
    case constants.CLEAR_GET_ALL_ROLE_SELECT:
      return {
        ...state,
        resStatus: null
      }
    case constants.GET_SPECIFIC_SUBADMIN:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        resData: action.payload.resData
      }
    case constants.CLEAR_GET_SPECIFIC_SUBADMIN:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        resData: {}
      }
    case constants.EDIT_SPECIFIC_SUBADMIN:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isSubAdminEdited: action.payload.isSubAdminEdited
      }
    case constants.CLEAR_EDIT_SPECIFIC_SUBADMIN:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isSubAdminEdited: null
      }
    case constants.DELETE_SUBADMIN:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isDeleted: action.payload.isDeleted
      }
    case constants.CLEAR_DELETE_SUBADMIN:
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
