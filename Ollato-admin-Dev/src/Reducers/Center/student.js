import constants from '../../Shared/Types/constants'

const initialAuthState = {
  resStatus: null,
  resMessage: null,
  isStudentAdded: null,
  studentList: null,
  studentCount: null,
  resData: null,
  isStudentEdited: null,
  isDeleted: null,
  isLooading: false
}

export default (state = initialAuthState, action) => {
  switch (action.type) {
    case constants.ADD_STUDENT_DATA_CEN:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isStudentAdded: action.payload.isStudentAdded
      }
    case constants.CLEAR_ADD_STUDENT_DATA_CEN:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isStudentAdded: null
      }
    case constants.GET_ALL_STUDENT_DATA_CEN:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        studentList: action.payload.studentList,
        studentCount: action.payload.studentCount,
        isLoading: false
      }
    case constants.CLEAR_GET_ALL_STUDENT_DATA_CEN:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        studentCount: null,
        isLoading: true
      }
    case constants.ADD_SPECIFIC_CSVFILE_CENTER:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isFileAdded: action.payload.isFileAdded
      }
    case constants.CLEAR_ADD_SPECIFIC_CSVFILE:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isFileAdded: null
      }
    case constants.GET_SPECIFIC_STUDENT_CEN:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        resData: action.payload.resData
      }
    case constants.CLEAR_GET_SPECIFIC_STUDENT_CEN:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        resData: {}
      }
    case constants.EDIT_SPECIFIC_STUDENT_CEN:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isStudentEdited: action.payload.isStudentEdited
      }
    case constants.CLEAR_EDIT_SPECIFIC_STUDENT_CEN:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isStudentEdited: null
      }
    case constants.DELETE_STUDENT_CEN:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isDeleted: action.payload.isDeleted
      }
    case constants.CLEAR_DELETE_STUDENT_CEN:
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
