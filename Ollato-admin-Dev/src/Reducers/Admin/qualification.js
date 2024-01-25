import constants from '../../Shared/Types/constants'

/* initial state */
const initialQulificationState = {
  resStatus: null,
  resMessage: null,
  isQualificationAdded: null,
  qualificationList: null,
  qualificationCount: null,
  specificQualificationData: null,
  isQualificationDeleted: null,
  isQulificationEdited: false,
  isLoading: false
}

export default (state = initialQulificationState, action) => {
  switch (action.type) {
    case constants.ADD_QUALIFICATION_DATA:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isQualificationAdded: action.payload.isQualificationAdded
      }
    case constants.CLEAR_ADD_QUALIFICATION_DATA:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isQualificationAdded: null
      }
    case constants.GET_ALL_QUALIFICATIONS_DATA:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        qualificationList: action.payload.qualificationData,
        qualificationCount: action.payload.count,
        isLoading: false
      }
    case constants.CLEAR_GET_ALL_QUALIFICATIONS_DATA:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        qualificationList: null,
        qualificationCount: null,
        isLoading: true
      }
    case constants.GET_SPECIFIC_QUALIFICATIONS_DATA:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        specificQualificationData: action.payload.specificQualificationData
      }
    case constants.CLEAR_GET_SPECIFIC_QUALIFICATIONS_DATA:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        specificQualificationData: null
      }
    case constants.EDIT_SPECIFIC_QUALIFICATION_DATA:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isQulificationEdited: action.payload.isQulificationEdited
      }
    case constants.CLEAR_EDIT_SPECIFIC_QUALIFICATION_DATA:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isQulificationEdited: null
      }
    case constants.DELETE_QUALIFICATION:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isQualificationDeleted: action.payload.isDeleted
      }
    case constants.CLEAR_DELETE_QUALIFICATION:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isQualificationDeleted: null
      }
    default:
      return state
  }
}
