import constants from '../../../../Shared/Types/constants'

/* initial state */
const initialTestNormDescriptionState = {
  resStatus: null,
  resMessage: null,
  testNormsDescriptionList: [],
  testNormsDescriptionCount: null,
  gradeList: null,
  isTestNormsDesscriptionAdded: null,
  isLoading: false
}

export default (state = initialTestNormDescriptionState, action) => {
  switch (action.type) {
    case constants.GET_ALL_TEST_NORMS_DESCRIPTION_DATA:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        testNormsDescriptionList: action.payload.testNormsDescriptionList,
        testNormsDescriptionCount: action.payload.testNormsDescriptionCount,
        isLoading: false
      }
    case constants.CLEAR_GET_ALL_TEST_NORMS_DESCRIPTION_DATA:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        testNormsDescriptionCount: null,
        isLoading: true
      }
    case constants.ADD_TEST_NORMS_DESCRIPTION_DATA:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isTestNormsDesscriptionAdded: action.payload.isTestNormsDesscriptionAdded
      }
    case constants.CLEAR_ADD_TEST_NORMS_DESCRIPTION_DATA:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isTestNormsDesscriptionAdded: null
      }
    case constants.GET_SPECIFIC_TEST_NORMS_DESCRIPTION:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        resData: action.payload.resData
      }
    case constants.CLEAR_GET_SPECIFIC_TEST_NORMS_DESCRIPTION:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        resData: {}
      }
    case constants.EDIT_SPECIFIC_TEST_NORMS_DESCRIPTION:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isTestNormsDescriptionEdited: action.payload.isTestNormsDescriptionEdited
      }
    case constants.CLEAR_EDIT_SPECIFIC_TEST_NORMS_DESCRIPTION:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isTestNormsDescriptionEdited: null
      }
    case constants.DELETE_TEST_NORMS_DESCRIPTION:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isDeleted: action.payload.isDeleted
      }
    case constants.CLEAR_DELETE_TEST_NORMS_DESCRIPTION:
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
