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
  isLoading: false
}

export default (state = initialAuthState, action) => {
  switch (action.type) {
    case constants.ADD_GRADE_DATA:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isGradeAdded: action.payload.isGradeAdded
      }
    case constants.CLEAR_ADD_GRADE_DATA:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isGradeAdded: null
      }
    case constants.GET_ALL_GRADE_DATA:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        gradeList: action.payload.gradeList,
        gradeCount: action.payload.gradeCount,
        isLoading: false
      }
    case constants.CLEAR_GET_ALL_GRADE_DATA:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        gradeCount: null,
        isLoading: true
      }
    case constants.GET_SPECIFIC_GRADE:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        specificGradeData: action.payload.specificGradeData
      }
    case constants.CLEAR_GET_SPECIFIC_GRADE:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        specificGradeData: null
      }
    case constants.EDIT_SPECIFIC_GRADE:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isGradeEdited: action.payload.isGradeEdited
      }
    case constants.CLEAR_EDIT_SPECIFIC_GRADE:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isGradeEdited: null
      }
    case constants.DELETE_GRADE:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isDeleted: action.payload.isDeleted
      }
    case constants.CLEAR_DELETE_GRADE:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isDeleted: null
      }
    default:
      return state
  }
}
