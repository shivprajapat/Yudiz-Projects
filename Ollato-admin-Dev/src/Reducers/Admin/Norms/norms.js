import constants from '../../../Shared/Types/constants'

/* initial state */
const initialNormsState = {
  resStatus: null,
  resMessage: null,
  isNormsAdded: null,
  normsList: null,
  normsCount: null,
  isNormsEdited: false,
  isDeleted: null,
  normsFrontList: null,
  resData: {},
  isLoadning: false
}

export default (state = initialNormsState, action) => {
  switch (action.type) {
    case constants.ADD_NORMS_DATA:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isNormsAdded: action.payload.isNormsAdded
      }
    case constants.CLEAR_ADD_NORMS_DATA:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isNormsAdded: null
      }
    case constants.GET_ALL_NORMS_DATA:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        normsList: action.payload.normsList,
        normsCount: action.payload.normsCount,
        isLoadning: false
      }
    case constants.CLEAR_GET_ALL_NORMS_DATA:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        normsCount: null,
        isLoadning: true
      }
    case constants.GET_ALL_NORMS_DATA_LIST:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        normsList: action.payload.normsList
      }
    case constants.CLEAR_GET_ALL_NORMS_DATA_LIST:
      return {
        ...state,
        resStatus: null,
        resMessage: null
      }
    case constants.GET_SPECIFIC_NORMS:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        resData: action.payload.resData
      }
    case constants.CLEAR_GET_SPECIFIC_NORMS:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        resData: {}
      }
    case constants.EDIT_SPECIFIC_NORMS:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isNormsEdited: action.payload.isNormsEdited
      }
    case constants.CLEAR_EDIT_SPECIFIC_NORMS:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isNormsEdited: null
      }
    case constants.DELETE_NORMS:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isDeleted: action.payload.isDeleted
      }
    case constants.CLEAR_DELETE_NORMS:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isDeleted: null
      }
    case constants.ADD_NORMS_FRONTEND_DATA:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        normsFrontList: action.payload.normsFrontList
      }
    case constants.CLEAR_ADD_NORMS_FRONTEND_DATA:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        normsFrontList: null
      }
    default:
      return state
  }
}
