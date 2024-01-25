import constants from '../Shared/Types/constants'

/* initial state */
const initialAuthState = {
  resStatus: null,
  resMessage: null,
  availableSlots: null,
  sessionsData: null,
  counsellorData: null,
  counsellorDetails: null,
  counsellorAvailableSlots: null,
  isSessionBooked: null,
  sessionDetails: null,
  isReschedule: null,
  isReported: null,
  isRated: null
}

export default (state = initialAuthState, action) => {
  switch (action.type) {
    case constants.GET_ALL_AVAILABLE_SLOTS:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        availableSlots: action.payload.availableSlots
      }
    case constants.CLEAR_GET_ALL_AVAILABLE_SLOTS:
      return {
        ...state,
        resStatus: null,
        resMessage: null
      }
    case constants.GET_ALL_FILTERED_COUNSELLOR:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        counsellorData: action.payload.counsellorData
      }
    case constants.CLEAR_GET_ALL_FILTERED_COUNSELLOR:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        counsellorData: null
      }
    case constants.GET_ALL_SESSION_HISTORY:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        sessionHistoryData: action.payload.sessionHistoryData
      }
    case constants.CLEAR_GET_ALL_SESSION_HISTORY:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        sessionHistoryData: null
      }
    case constants.GET_ALL_COUNSELLOR_DETAILS:
      return {
        ...state,
        // resStatus: action.payload.resStatus,
        // resMessage: action.payload.resMessage,
        counsellorDetails: action.payload.counsellorDetails
      }
    case constants.CLEAR_GET_ALL_COUNSELLOR_DETAILS:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        counsellorDetails: null
      }
    case constants.GET_ALL_COUNSELLOR_AVAILABLE_SLOTS:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        counsellorAvailableSlots: action.payload.counsellorAvailableSlots
      }
    case constants.CLEAR_GET_ALL_COUNSELLOR_AVAILABLE_SLOTS:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        counsellorAvailableSlots: null
      }
    case constants.BOOK_SESSION:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isSessionBooked: action.payload.isSessionBooked
      }
    case constants.CLEAR_BOOK_SESSION:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isSessionBooked: null
      }
    case constants.SESSION_DETAILS:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        // resMessage: action.payload.resMessage,
        sessionDetails: action.payload.sessionDetails
      }
    case constants.CLEAR_SESSION_DETAILS:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        sessionDetails: null
      }
    case constants.COUNSELLOR_RESCHEDULE:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isReschedule: action.payload.isReschedule
      }
    case constants.CLEAR_COUNSELLOR_RESCHEDULE:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isReschedule: null
      }
    case constants.CANCEL_SESSION:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isCancel: action.payload.isCancel
      }
    case constants.CLEAR_CANCEL_SESSION:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isCancel: null
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
    case constants.RATINGS:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isRated: action.payload.isRated
      }
    case constants.CLEAR_RATINGS:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isRated: null
      }
    default:
      return state
  }
}
