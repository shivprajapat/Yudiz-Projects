import constants from '../../Shared/Types/constants'

/* initial state */
const initialAuthState = {
  resStatus: null,
  resMessage: null,
  isGradeAdded: null,
  gradesList: null,
  gradeCount: null,
  specificGradeData: null,
  isGradeEdited: null,
  isDeleted: null,
  isSchoolAdded: null,
  schoolDataArray: null,
  schoolCount: null,
  specificSchoolData: null,
  isSchoolEdited: null,
  isSchoolDeleted: null,
  isLoading: false
}

export default (state = initialAuthState, action) => {
  switch (action.type) {
    case constants.ADD_SCHOOL_DATA:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isSchoolAdded: action.payload.isSchoolAdded
      }
    case constants.CLEAR_ADD_SCHOOL_DATA:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isSchoolAdded: null
      }
    case constants.GET_ALL_SCHOOL_DATA:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        schoolDataArray: action.payload.schoolDataArray,
        schoolCount: action.payload.schoolCount,
        isLoading: false
      }
    case constants.CLEAR_GET_ALL_SCHOOL_DATA:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        schoolDataArray: null,
        schoolCount: null,
        isLoading: true
      }
    case constants.GET_SPECIFIC_SCHOOL:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        specificSchoolData: action.payload.specificSchoolData
      }
    case constants.CLEAR_GET_SPECIFIC_SCHOOL:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        specificSchoolData: null
      }
    case constants.EDIT_SPECIFIC_SCHOOL:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isSchoolEdited: action.payload.isSchoolEdited
      }
    case constants.CLEAR_EDIT_SPECIFIC_SCHOOL:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isSchoolEdited: null
      }
    case constants.DELETE_SCHOOL:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isSchoolDeleted: action.payload.isSchoolDeleted
      }
    case constants.CLEAR_DELETE_SCHOOL:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isSchoolDeleted: null
      }
    default:
      return state
  }
}
