import constants from '../../Shared/Types/constants'

/* initial state */
const initialAuthState = {
  resStatus: null,
  resMessage: null,
  counsellorList: null,
  count: null,
  timeSlotData: null,
  isAvailability: false,
  availableData: [],
  isAvailableEdited: null,
  isAvailableDeleted: null,
  isCounsellorAvailable: null,
  centers: null
}

export default (state = initialAuthState, action) => {
  switch (action.type) {
    case constants.GET_ALL_COUNSELLOR_LIST:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        counsellorList: action.payload.counsellorList,
        count: action.payload.count
      }
    case constants.CLEAR_GET_ALL_COUNSELLOR_LIST:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        counsellorList: null,
        count: null
      }
    case constants.GET_ALL_TIMESLOTS:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        timeSlotData: action.payload.timeSlotData
      }
    case constants.CLEAR_GET_ALL_TIMESLOTS:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        timeSlotData: null
      }
    case constants.SET_AVAILABILITY:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isAvailability: action.payload.isAvailability
      }
    case constants.CLEAR_SET_AVAILABILITY:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isAvailability: null
      }
    case constants.GET_AVAILABLE_BY_ID:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        availableData: action.payload.availableData,
        isCounsellorAvailable: action.payload.isCounsellorAvailable
      }
    case constants.CLEAR_GET_AVAILABLE_BY_ID:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isCounsellorAvailable: null
      }
    case constants.EDIT_AVAILABILITY:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isAvailableEdited: action.payload.isAvailableEdited
      }
    case constants.CLEAR_EDIT_AVAILABILITY:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isAvailableEdited: null
      }
    case constants.DELETE_AVAILABILITY:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isAvailableDeleted: action.payload.isAvailableDeleted
      }
    case constants.CLEAR_DELETE_AVAILABILITY:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isAvailableDeleted: null
      }

    default:
      return state
  }
}
