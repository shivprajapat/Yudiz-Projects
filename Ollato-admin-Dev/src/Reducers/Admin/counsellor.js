import constants from '../../Shared/Types/constants'

const initialAuthState = {
  resStatus: null,
  resMessage: null,
  isCounsellorAdded: null,
  counsellorList: null,
  counsellorCount: null,
  resData: null,
  isCounsellorEdited: null,
  isDeleted: null,
  isLoading: false,
  exportedData: null
}

export default (state = initialAuthState, action) => {
  switch (action.type) {
    case constants.ADD_COUNSELLOR_DATA:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isCounsellorAdded: action.payload.isCounsellorAdded,
        isLoading: false
      }
    case constants.CLEAR_ADD_COUNSELLOR_DATA:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isCounsellorAdded: null,
        isLoading: true
      }
    case constants.GET_ALL_COUNSELLOR_DATA:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        counsellorList: action.payload.counsellorList,
        counsellorCount: action.payload.counsellorCount,
        isLoading: false
      }
    case constants.CLEAR_GET_ALL_COUNSELLOR_DATA:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        counsellorCount: null,
        isLoading: true
      }
    case constants.GET_SPECIFIC_COUNSELLOR:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        resData: action.payload.resData
      }
    case constants.CLEAR_GET_SPECIFIC_COUNSELLOR:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        resData: {}
      }
    case constants.EDIT_SPECIFIC_COUNSELLOR:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isCounsellorEdited: action.payload.isCounsellorEdited
      }
    case constants.CLEAR_EDIT_SPECIFIC_COUNSELLOR:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isCounsellorEdited: null
      }
    case constants.DELETE_COUNSELLOR:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isDeleted: action.payload.isDeleted
      }
    case constants.CLEAR_DELETE_COUNSELLOR:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isDeleted: null
      }
    case constants.CLEAR_GET_ALL_CENTERS:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        centers: null
      }
    case constants.GET_ALL_CENTERS:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        centers: action.payload.centers
      }
    case constants.CLEAR_EXPORT_COUNSELLORS:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        exportedData: null
      }
    case constants.EXPORT_COUNSELLORS:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        exportedData: action.payload.exportedData
      }
    default:
      return state
  }
}
