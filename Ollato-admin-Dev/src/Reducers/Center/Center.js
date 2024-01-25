import constants from '../../Shared/Types/constants'

/* initial state */
const initialAuthState = {
  resStatus: null,
  resMessage: null,
  centerDashData: null,
  profileData: null,
  isProfileEdited: null
}

export default (state = initialAuthState, action) => {
  switch (action.type) {
    case constants.GET_ALL_CENTER_DASHBOARD_DATA:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        centerDashData: action.payload.centerDashData
      }
    case constants.CLEAR_GET_ALL_CENTER_DASHBOARD_DATA:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        centerDashData: null
      }
    case constants.CLEAR_VIEW_CENTER_PROFILE:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        profileData: null
      }
    case constants.VIEW_CENTER_PROFILE:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        profileData: action.payload.profileData
      }
    case constants.CLEAR_UPDATE_CENTER_PROFILE:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isProfileEdited: null
      }
    case constants.UPDATE_CENTER_PROFILE:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isProfileEdited: action.payload.isProfileEdited
      }
    // case constants.GET_ALL_TIMESLOTS:
    //   return {
    //     ...state,
    //     resStatus: action.payload.resStatus,
    //     resMessage: action.payload.resMessage,
    //     timeSlotData: action.payload.timeSlotData
    //   }
    // case constants.CLEAR_GET_ALL_TIMESLOTS:
    //   return {
    //     ...state,
    //     resStatus: null,
    //     resMessage: null,
    //     timeSlotData: null
    //   }
    // case constants.SET_AVAILABILITY:
    //   return {
    //     ...state,
    //     resStatus: action.payload.resStatus,
    //     resMessage: action.payload.resMessage,
    //     isAvailability: action.payload.isAvailability
    //   }
    // case constants.CLEAR_SET_AVAILABILITY:
    //   return {
    //     ...state,
    //     resStatus: null,
    //     resMessage: null,
    //     isAvailability: false
    //   }
    default:
      return state
  }
}
