import constants from '../../Shared/Types/constants'

/* initial state */
const initialStateState = {
  resStatus: null,
  stateList: null,
  resMessage: null,
  stateCount: null,
  isDeleted: null,
  isStateEdited: null,
  resData: null,
  isLoading: false
}

export default (state = initialStateState, action) => {
  switch (action.type) {
    case constants.GET_ALL_STATE_DATA:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        stateList: action.payload.stateList,
        stateCount: action.payload.stateCount,
        isLoading: false
      }
    case constants.CLEAR_GET_ALL_STATE_DATA:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        stateCount: null,
        isLoading: true
      }
    case constants.ADD_STATE_DATA:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isStateAdded: action.payload.isStateAdded
      }
    case constants.CLEAR_ADD_STATE_DATA:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isStateAdded: null
      }
    case constants.DELETE_STATE:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isDeleted: action.payload.isDeleted
      }
    case constants.CLEAR_DELETE_STATE:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isDeleted: null
      }
    case constants.GET_SPECIFIC_STATE:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        resData: action.payload.resData
      }
    case constants.CLEAR_GET_SPECIFIC_STATE:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        resData: {}
      }
    case constants.EDIT_SPECIFIC_STATE:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isStateEdited: action.payload.isStateEdited
      }
    case constants.CLEAR_EDIT_SPECIFIC_STATE:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isStateEdited: null
      }
    default:
      return state
  }
}
