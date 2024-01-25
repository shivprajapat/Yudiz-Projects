import constants from '../../Shared/Types/constants'

/* initial state */
const initialSoftwareMetricsState = {
  resStatus: null,
  resMessage: null,
  isSoftwareMetricsAdded: null,
  softwareMetricsList: null,
  softwareMetricsCount: null,
  isSoftwareMetricsEdited: false,
  isDeleted: null,
  resData: {},
  isLoading: false
}

export default (state = initialSoftwareMetricsState, action) => {
  switch (action.type) {
    case constants.ADD_SOFTWARE_METRICS_DATA:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isSoftwareMetricsAdded: action.payload.isSoftwareMetricsAdded
      }
    case constants.CLEAR_ADD_SOFTWARE_METRICS_DATA:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isSoftwareMetricsAdded: null
      }
    case constants.GET_ALL_SOFTWARE_METRICS_DATA:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        softwareMetricsList: action.payload.softwareMetricsList,
        softwareMetricsCount: action.payload.softwareMetricsCount,
        isLoading: false
      }
    case constants.CLEAR_GET_ALL_SOFTWARE_METRICS_DATA:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        softwareMetricsCount: null,
        isLoading: true
      }
    case constants.GET_SPECIFIC_SOFTWARE_METRICS:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        resData: action.payload.resData
      }
    case constants.CLEAR_GET_SPECIFIC_SOFTWARE_METRICS:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        resData: {}
      }
    case constants.EDIT_SPECIFIC_SOFTWARE_METRICS:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isSoftwareMetricsEdited: action.payload.isSoftwareMetricsEdited
      }
    case constants.CLEAR_EDIT_SPECIFIC_SOFTWARE_METRICS:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isSoftwareMetricsEdited: null
      }
    case constants.DELETE_SOFTWARE_METRICS:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isDeleted: action.payload.isDeleted
      }
    case constants.CLEAR_DELETE_SOFTWARE_METRICS:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isDeleted: null
      }
    case constants.DELETE_SOFTWARE_METRICS_DETAIL:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isDeleted: action.payload.isDeleted
      }
    case constants.CLEAR_DELETE_SOFTWARE_METRICS_DETAIL:
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
