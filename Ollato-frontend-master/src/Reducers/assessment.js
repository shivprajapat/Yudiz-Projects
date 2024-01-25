import constants from '../Shared/Types/constants'

/* initial state */
const initialAuthState = {
  resStatus: null,
  resMessage: null,
  completedTestData: null,
  assessmentData: null,
  totalTest: null,
  isReportDownloaded: false,
  graphData: null
}

export default (state = initialAuthState, action) => {
  switch (action.type) {
    case constants.GET_ALL_COMPLETED_TEST:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        completedTestData: action.payload.completedTestData,
        totalTest: action.payload.totalTest
      }
    case constants.CLEAR_GET_ALL_COMPLETED_TEST:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        completedTestData: null,
        totalTest: null
      }
    case constants.GET_ASSESSMENT_DATA:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        assessmentData: action.payload.assessmentData
      }
    case constants.CLEAR_GET_ASSESSMENT_DATA:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        assessmentData: null
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
    case constants.GET_GRAPH_DATA:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        graphData: action.payload.graphData
      }
    case constants.CLEAR_GET_GRAPH_DATA:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        graphData: null
      }
    default:
      return state
  }
}
