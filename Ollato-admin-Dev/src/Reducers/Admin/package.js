import constants from '../../Shared/Types/constants'

/* initial state */
const initialPackageState = {
  resStatus: null,
  resMessage: null,
  packageList: [],
  packageCount: null,
  isPackageAdded: null,
  resData: {},
  isPackageEdited: false,
  isLoading: false
  //   isDeleted: null,
}

export default (state = initialPackageState, action) => {
  switch (action.type) {
    case constants.GET_ALL_PACKAGE_DATA:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        packageList: action.payload.packageList,
        packageCount: action.payload.packageCount,
        isLoading: false
      }
    case constants.CLEAR_GET_ALL_PACKAGE_DATA:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        packageCount: null,
        packageList: [],
        isLoading: true
      }
    case constants.ADD_PACKAGE_DATA:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isPackageAdded: action.payload.isPackageAdded
      }
    case constants.CLEAR_ADD_PACKAGE_DATA:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isPackageAdded: null
      }
    case constants.GET_SPECIFIC_PACKAGE:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        resData: action.payload.resData
      }
    case constants.CLEAR_GET_SPECIFIC_PACKAGE:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        resData: {}
      }
    case constants.EDIT_SPECIFIC_PACKAGE:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isPackageEdited: action.payload.isPackageEdited
      }
    case constants.CLEAR_EDIT_SPECIFIC_PACKAGE:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isPackageEdited: null
      }
    case constants.DELETE_PACKAGE:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isDeleted: action.payload.isDeleted
      }
    case constants.CLEAR_DELETE_PACKAGE:
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
