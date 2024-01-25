import constants from '../../Shared/Types/constants'

/* initial state */
const initialAuthState = {
  resStatus: null,
  resMessage: null,
  dashboardData: null,
  counsellorData: null,
  isPasswordChanged: null,
  isReportDownloaded: false,
  downloadReportLink: null,
  getIssueCategory: null,
  isQueryReported: null,
  isProfileUpdated: null,
  allSlotsData: null
}

export default (state = initialAuthState, action) => {
  switch (action.type) {
    case constants.GET_COUNSELLOR_DASHBOARD:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        dashboardData: action.payload.dashboardData
      }
    case constants.CLEAR_GET_COUNSELLOR_DASHBOARD:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        dashboardData: null
      }
    case constants.VIEW_COUNSELLOR_DETAILS:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        counsellorData: action.payload.counsellorData
      }
    case constants.CLEAR_VIEW_COUNSELLOR_DETAILS:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        counsellorData: null
      }
    case constants.COUNSELLOR_CHANGE_PASSWORD:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isPasswordChanged: action.payload.isPasswordChanged
      }
    case constants.CLEAR_COUNSELLOR_CHANGE_PASSWORD:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isPasswordChanged: null
      }
    case constants.COUNSELLOR_DOWNLOAD_REPORT:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        downloadReportLink: action.payload.downloadReportLink,
        isReportDownloaded: action.payload.isReportDownloaded
      }
    case constants.CLEAR_COUNSELLOR_DOWNLOAD_REPORT:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        downloadReportLink: null,
        isReportDownloaded: true
      }
    case constants.GET_ISSUE_CATEGORY:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        getIssueCategory: action.payload.getIssueCategory
      }
    case constants.CLEAR_GET_ISSUE_CATEGORY:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        getIssueCategory: null
      }
    case constants.SUPPORT:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isQueryReported: action.payload.isQueryReported
      }
    case constants.CLEAR_SUPPORT:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isQueryReported: null
      }
    case constants.EDIT_COUNSELLOR_PROFILE:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isProfileUpdated: action.payload.isProfileUpdated
      }
    case constants.CLEAR_EDIT_COUNSELLOR_PROFILE:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isProfileUpdated: null
      }
    case constants.GET_ALL_SLOTS_DATA:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        allSlotsData: action.payload.allSlotsData
      }
    case constants.CLEAR_GET_ALL_SLOTS_DATA:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        allSlotsData: null
      }
    default:
      return state
  }
}
