import constants from '../../Shared/Types/constants'

/* initial state */
const initialAuthState = {
  resStatus: null,
  resMessage: null,
  // sessionList: null,
  count: null,
  isAcceptReject: null,
  sessionDetails: null,
  isSessionReschdule: null,
  isSessionCancel: null,
  isReported: null
}

export default (state = initialAuthState, action) => {
  switch (action.type) {
    case constants.GET_ALL_SESSIONS:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        sessionList: action.payload.sessionList,
        count: action.payload.count
      }
    case constants.CLEAR_GET_ALL_SESSIONS:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        sessionList: null,
        count: null
      }
    case constants.ACCEPTREJECTSESSION:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isAcceptReject: action.payload.isAcceptReject
      }
    case constants.CLEAR_ACCEPTREJECTSESSION:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isAcceptReject: null
      }
    case constants.GET_DETAILED_VIEW_SESSION:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        sessionDetails: action.payload.sessionDetails
      }
    case constants.CLEAR_GET_DETAILED_VIEW_SESSION:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        sessionDetails: null
      }
    case constants.COUNSELLOR_RESCHEDULE_SESSION:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isSessionReschdule: action.payload.isSessionReschdule
      }
    case constants.CLEAR_COUNSELLOR_RESCHEDULE_SESSION:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isSessionReschdule: null
      }
    case constants.COUNSELLOR_CANCEL_SESSION:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isSessionCancel: action.payload.isSessionCancel
      }
    case constants.CLEAR_COUNSELLOR_CANCEL_SESSION:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isSessionCancel: null
      }
    case constants.REPORT_SESSION:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isReported: action.payload.isReported
      }
    case constants.CLEAR_REPORT_SESSION:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isReported: null
      }
    case constants.COMPLETED_SESSION:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isCompleted: action.payload.isCompleted
      }
    case constants.CLEAR_COMPLETED_SESSION:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isCompleted: null
      }
    default:
      return state
  }
}
