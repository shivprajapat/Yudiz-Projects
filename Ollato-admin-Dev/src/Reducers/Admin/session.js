import constants from '../../Shared/Types/constants'

/* initial state */
const initialAuthState = {
  resStatus: null,
  resMessage: null,
  isDeleted: null,
  isSchoolAdded: null,
  sessionDataArray: null,
  sessionCount: null,
  sessionDetails: null,
  isSchoolEdited: null,
  isSchoolDeleted: null,
  isLoading: false
}

export default (state = initialAuthState, action) => {
  switch (action.type) {
    case constants.GET_ALL_SESSION_DATA_ADMIN:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        sessionDataArray: action.payload.sessionDataArray,
        sessionCount: action.payload.sessionCount,
        isLoading: false
      }
    case constants.CLEAR_GET_ALL_SESSION_DATA_ADMIN:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        sessionDataArray: null,
        sessionCount: null,
        isLoading: true
      }
    case constants.GET_DETAILED_VIEW_SESSION_ADMIN:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        sessionDetails: action.payload.sessionDetails
      }
    case constants.CLEAR_GET_DETAILED_VIEW_SESSION_ADMIN:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        sessionDetails: null
      }

    default:
      return state
  }
}
