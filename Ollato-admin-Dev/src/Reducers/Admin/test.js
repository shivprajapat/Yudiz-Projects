import constants from '../../Shared/Types/constants'

/* initial state */
const initialAuthState = {
  resStatus: null,
  resMessage: null,
  isTestCategoryAdded: null,
  testList: null,
  testCount: null,
  testCategoryDataById: null,
  isTestCategoryUpdated: null,
  isTestCategoryDeleted: null,
  subCategoryData: null,
  total: null,
  testSubCategoryDataById: null,
  categories: null,
  isCategoryDeleted: null,
  mainCategoryData: null,
  isSubCategoryAdded: null,
  isSubCategoryEdited: null,
  isLoading: false
}

export default (state = initialAuthState, action) => {
  switch (action.type) {
    case constants.ADD_TEST_CATEGORY_DATA:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isTestCategoryAdded: action.payload.isTestCategoryAdded
      }
    case constants.CLEAR_ADD_TEST_CATEGORY_DATA:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isTestCategoryAdded: null
      }
    case constants.GET_ALL_TEST_CATEGORY_DATA:
      return {
        ...state,
        resStatus: action?.payload?.resStatus,
        resMessage: action?.payload?.resMessage,
        testList: action?.payload?.testList,
        testCount: action?.payload?.testCount,
        isLoading: false
      }
    case constants.CLEAR_GET_ALL_TEST_CATEGORY_DATA:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        testCount: null,
        isLoading: true
      }
    case constants.VIEW_TEST_CATEGORY_DATA:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        testCategoryDataById: action.payload.testCategoryDataById
      }
    case constants.CLEAR_VIEW_TEST_CATEGORY_DATA:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        testCategoryDataById: null
      }
    case constants.EDIT_TEST_CATEGORY_DATA:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isTestCategoryUpdated: action.payload.isTestCategoryUpdated
      }
    case constants.CLEAR_EDIT_TEST_CATEGORY_DATA:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isTestCategoryUpdated: null
      }
    case constants.DELETE_TEST_CATEGORY_DATA:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isTestCategoryDeleted: action.payload.isTestCategoryDeleted
      }
    case constants.CLEAR_DELETE_TEST_CATEGORY_DATA:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isTestCategoryDeleted: null
      }
    case constants.GET_ALL_TEST_SUBCATEGORY_DATA:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        subCategoryData: action.payload.subCategoryData,
        total: action.payload.total,
        isLoading: false
      }
    case constants.CLEAR_GET_ALL_TEST_SUBCATEGORY_DATA:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        subCategoryData: null,
        total: null,
        isLoading: true
      }
    case constants.VIEW_TEST_SUBCATEGORY_DATA:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        testSubCategoryDataById: action.payload.testSubCategoryDataById
      }
    case constants.CLEAR_VIEW_TEST_SUBCATEGORY_DATA:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        testSubCategoryDataById: null
      }
    case constants.GET_ALL_CATEGORIES_DATA:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        categories: action.payload.categories
      }
    case constants.CLEAR_GET_ALL_CATEGORIES_DATA:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        categories: null
      }
    case constants.DELETE_TEST_SUBCATEGORY_DATA:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isCategoryDeleted: action.payload.isCategoryDeleted
      }
    case constants.CLEAR_DELETE_TEST_SUBCATEGORY_DATA:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isCategoryDeleted: null
      }
    case constants.GET_ALL_MAIN_CATEGORIES_DATA:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        mainCategoryData: action.payload.mainCategoryData
      }
    case constants.CLEAR_GET_ALL_MAIN_CATEGORIES_DATA:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        mainCategoryData: null
      }
    case constants.ADD_SUBCATEGORY:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isSubCategoryAdded: action.payload.isSubCategoryAdded
      }
    case constants.CLEAR_ADD_SUBCATEGORY:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isSubCategoryAdded: null
      }
    case constants.EDIT_TEST_SUBCATEGORY:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isSubCategoryEdited: action.payload.isSubCategoryEdited
      }
    case constants.CLEAR_EDIT_TEST_SUBCATEGORY:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isSubCategoryEdited: null
      }
    default:
      return state
  }
}
