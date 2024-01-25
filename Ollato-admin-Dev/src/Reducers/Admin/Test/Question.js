import constants from '../../../Shared/Types/constants'

/* initial state */
const initialQuestionState = {
  resStatus: null,
  resMessage: null,
  questionList: {},
  testCategoryList: [],
  testSubCategoryList: [],
  resData: {},
  isQuestionAdded: null,
  isQuestionEdited: null,
  questionCount: null,
  isLoading: false
}

export default (state = initialQuestionState, action) => {
  switch (action.type) {
    case constants.GET_ALL_QUESTION_DATA:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        questionList: action.payload.questionList,
        questionCount: action.payload.questionCount,
        isLoading: false
      }
    case constants.CLEAR_GET_ALL_QUESTION_DATA:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        questionCount: null,
        isLoading: true
      }
    case constants.ADD_TEST_CATEGORY_DATA:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        testCategoryList: action.payload.testCategoryList
      }
    case constants.CLEAR_ADD_TEST_CATEGORY_DATA:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        testCategoryList: []
      }
    case constants.ADD_TEST_SUB_CATEGORY_DATA:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        testSubCategoryList: action.payload.testSubCategoryList
      }
    case constants.CLEAR_ADD_TEST_SUB_CATEGORY_DATA:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        testSubCategoryList: []
      }
    case constants.ADD_QUESTION_DATA:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isQuestionAdded: action.payload.isQuestionAdded
      }
    case constants.CLEAR_ADD_QUESTION_DATA:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isQuestionAdded: null
      }
    case constants.GET_SPECIFIC_QUESTION:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        resData: action.payload.resData
      }
    case constants.CLEAR_GET_SPECIFIC_QUESTION:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        resData: {}
      }
    case constants.EDIT_SPECIFIC_QUESTION:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isQuestionEdited: action.payload.isQuestionEdited
      }
    case constants.CLEAR_EDIT_SPECIFIC_QUESTION:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isQuestionEdited: null
      }
    case constants.DELETE_QUESTION:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isDeleted: action.payload.isDeleted
      }
    case constants.CLEAR_DELETE_QUESTION:
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
