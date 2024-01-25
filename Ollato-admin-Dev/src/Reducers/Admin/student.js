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
  isLoading: false,
  isFileAdded: null,
  exportedData: null
}

export default (state = initialAuthState, action) => {
  switch (action.type) {
    case constants.ADD_STUDENT_DATA:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isStudentAdded: action.payload.isStudentAdded
      }
    case constants.CLEAR_ADD_STUDENT_DATA:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isStudentAdded: null
      }
    case constants.ADD_SPECIFIC_CSVFILE:
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
    case constants.GET_ALL_STUDENT_DATA:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        studentList: action.payload.studentList,
        studentCount: action.payload.studentCount,
        isLoading: false
      }
    case constants.CLEAR_GET_ALL_STUDENT_DATA:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        studentCount: null,
        isLoading: true
      }
    // case constants.GET_ALL_ROLE_SELECT:
    //   return {
    //     ...state,
    //     resStatus: action.payload.resStatus,
    //     roleData: action.payload.roleData
    //   }
    // case constants.CLEAR_GET_ALL_ROLE_SELECT:
    //   return {
    //     ...state,
    //     resStatus: null
    //   }
    case constants.GET_SPECIFIC_STUDENT:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        resData: action.payload.resData
      }
    case constants.CLEAR_GET_SPECIFIC_SUBADMIN:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        resData: {}
      }
    case constants.EDIT_SPECIFIC_STUDENT:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isStudentEdited: action.payload.isStudentEdited
      }
    case constants.CLEAR_EDIT_SPECIFIC_STUDENT:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isStudentEdited: null
      }
    case constants.DELETE_STUDENT:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isDeleted: action.payload.isDeleted
      }
    case constants.CLEAR_DELETE_STUDENT:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isDeleted: null
      }
    case constants.CLEAR_EXPORT_STUDENTS:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        exportedData: null
      }
    case constants.EXPORT_STUDENTS:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        exportedData: action.payload.exportedData
      }
    case constants.GENERATE_REPORT:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        downloadReportLink: action.payload.downloadReportLink,
        isReportDownloaded: action.payload.isReportDownloaded
      }
    case constants.CLEAR_GENERATE_REPORT:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        downloadReportLink: null,
        isReportDownloaded: true
      }
    default:
      return state
  }
}
