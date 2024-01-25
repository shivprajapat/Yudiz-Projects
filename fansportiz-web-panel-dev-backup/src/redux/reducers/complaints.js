import {
  COMPLAINT_LIST,
  COMPLAINT_DETAILS,
  CLEAR_COMPLAINT_LIST,
  CLEAR_COMPLAINT_DETAILS,
  CLEAR_ADD_COMPLAINT,
  ADD_COMPLAINT
} from '../constants'

export default (state = {}, action) => {
  switch (action.type) {
    case COMPLAINT_LIST:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        complaintList: action.payload.data
      }
    case CLEAR_COMPLAINT_LIST:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        complaintList: null
      }
    case COMPLAINT_DETAILS:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        complaintDetails: action.payload.data
      }
    case CLEAR_COMPLAINT_DETAILS:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        complaintDetails: null
      }
    case ADD_COMPLAINT:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        addedComplaint: action.payload.addedComplaint
      }
    case CLEAR_ADD_COMPLAINT:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        complaintDetails: null,
        addedComplaint: null
      }
    default:
      return state
  }
}
