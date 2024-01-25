import constants from '../../../../Shared/Types/constants'

/* initial state */
const initialTestTimeNormsState = {
  resStatus: null,
  resMessage: null,
  testTimeNormsList: [],
  testTimeNormsCount: null,
  gradeList: null,
  isTestTimeNormsAdded: null,
  isLoading: false
}

export default (state = initialTestTimeNormsState, action) => {
  switch (action.type) {
    case constants.GET_ALL_TEST_TIME_NORMS_DATA:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        testTimeNormsList: action.payload.testTimeNormsList,
        testTimeNormsCount: action.payload.testTimeNormsCount,
        isLoading: false
      }
    case constants.CLEAR_GET_ALL_TEST_TIME_NORMS_DATA:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        testTimeNormsCount: null,
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
    case constants.ADD_TEST_TIME_NORMS_DATA:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isTestTimeNormsAdded: action.payload.isTestTimeNormsAdded
      }
    case constants.CLEAR_ADD_TEST_TIME_NORMS_DATA:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isTestTimeNormsAdded: null
      }
    case constants.GET_SPECIFIC_TEST_TIME_NORMS:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        resData: action.payload.resData
      }
    case constants.CLEAR_GET_SPECIFIC_TEST_TIME_NORMS:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        resData: {}
      }
    case constants.EDIT_SPECIFIC_TEST_TIME_NORMS:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isTestTimeNormsEdited: action.payload.isTestTimeNormsEdited
      }
    case constants.CLEAR_EDIT_SPECIFIC_TEST_TIME_NORMS:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isTestTimeNormsEdited: null
      }
    case constants.DELETE_TEST_TIME_NORMS:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isDeleted: action.payload.isDeleted
      }
    case constants.CLEAR_DELETE_TEST_TIME_NORMS:
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
