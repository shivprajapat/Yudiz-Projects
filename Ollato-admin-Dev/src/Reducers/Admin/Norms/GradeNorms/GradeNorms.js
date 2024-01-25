import constants from '../../../../Shared/Types/constants'

/* initial state */
const initialGradeNormsState = {
  resStatus: null,
  resMessage: null,
  gradeNormsList: null,
  gradeNormsCount: null,
  gradeList: null,
  isGradeNormsAdded: null,
  isLoading: false
}

export default (state = initialGradeNormsState, action) => {
  switch (action.type) {
    case constants.GET_ALL_GRADE_NORMS_DATA:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        gradeNormsList: action.payload.gradeNormsList,
        gradeNormsCount: action.payload.gradeNormsCount,
        isLoading: false
      }
    case constants.CLEAR_GET_ALL_GRADE_NORMS_DATA:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        gradeNormsCount: null,
        isLoading: true
      }
    case constants.GET_ALL_GRADE_DATA:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        gradeList: action.payload.gradeList
      }
    case constants.CLEAR_GET_ALL_GRADE_DATA:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        gradeList: null
      }
    case constants.ADD_GRADE_NORMS_DATA:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isGradeNormsAdded: action.payload.isGradeNormsAdded
      }
    case constants.CLEAR_ADD_GRADE_NORMS_DATA:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isGradeNormsAdded: null
      }
    case constants.GET_SPECIFIC_GRADE_NORMS:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        resData: action.payload.resData
      }
    case constants.CLEAR_GET_SPECIFIC_GRADE_NORMS:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        resData: {}
      }
    case constants.EDIT_SPECIFIC_GRADE_NORMS:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isGradeNormsEdited: action.payload.isGradeNormsEdited
      }
    case constants.CLEAR_EDIT_SPECIFIC_GRADE_NORMS:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isGradeNormsEdited: null
      }
    case constants.DELETE_GRADE_NORMS:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isDeleted: action.payload.isDeleted
      }
    case constants.CLEAR_DELETE_GRADE_NORMS:
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
