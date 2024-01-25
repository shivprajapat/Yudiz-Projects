import constants from '../Shared/Types/constants'

/* initial state */
const initialAuthState = {
  resStatus: null,
  resMessage: null,
  testProcessTest: null,
  testProcessCategoryByID: null,
  interestTestData: null
}

export default (state = initialAuthState, action) => {
  switch (action.type) {
    case constants.GET_ALL_TEST_PROCESS_DATA:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        testProcessTest: action.payload.testProcessTest
      }
    case constants.CLEAR_GET_ALL_TEST_PROCESS_DATA:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        testProcessTest: null
      }
    case constants.GET_TEST_CATEGORY_BY_ID_DATA:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        testProcessCategoryByID: action.payload.testProcessCategoryByID
      }
    case constants.CLEAR_GET_TEST_CATEGORY_BY_ID_DATA:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        testProcessCategoryByID: null
      }
    case constants.GET_INTEREST_TEST_DETAILS:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        interestTestData: action.payload.interestTestData
      }
    case constants.CLEAR_GET_INTEREST_TEST_DETAILS:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        interestTestData: null
      }
    default:
      return state
  }
}
