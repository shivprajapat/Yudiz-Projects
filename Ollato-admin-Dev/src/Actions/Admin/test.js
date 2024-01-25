import axios from 'axios'
import constants from '../../Shared/Types/constants'

/* Add Test Category Functionality */
export const addTestAction = (testData, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_ADD_TEST_CATEGORY_DATA })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/test/test-category/create`, testData, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.ADD_TEST_CATEGORY_DATA,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        isTestCategoryAdded: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.ADD_TEST_CATEGORY_DATA,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        isTestCategoryAdded: false
      }
    })
  })
}

/* Get All Grade Functionality */
export const getAllTestListAction = (start, limit, sort, order, search, token) => (dispatch) => {
  const data = {
    start,
    limit,
    sort,
    order,
    search
  }
  dispatch({ type: constants.CLEAR_GET_ALL_TEST_CATEGORY_DATA })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/test/test-category/get-all`, data, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.GET_ALL_TEST_CATEGORY_DATA,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        testList: response.data.data,
        testCount: response.data.total
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.GET_ALL_TEST_CATEGORY_DATA,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message
      }
    })
  })
}

/* View Test Category Functionality */
export const viewTestCategoryAction = (testData, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_VIEW_TEST_CATEGORY_DATA })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/test/test-category/get-by-id`, testData, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.VIEW_TEST_CATEGORY_DATA,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        testCategoryDataById: response.data.data
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.VIEW_TEST_CATEGORY_DATA,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message
      }
    })
  })
}

/* Edit Test Category Functionality */
export const editTestCategoryAction = (testData, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_EDIT_TEST_CATEGORY_DATA })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/test/test-category/update`, testData, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.EDIT_TEST_CATEGORY_DATA,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        isTestCategoryUpdated: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.EDIT_TEST_CATEGORY_DATA,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        isTestCategoryUpdated: false
      }
    })
  })
}

/* Delete Test Category Functionality */
export const deleteTestCategoryAction = (testData, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_DELETE_TEST_CATEGORY_DATA })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/test/test-category/delete`, testData, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.DELETE_TEST_CATEGORY_DATA,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        isTestCategoryDeleted: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.DELETE_TEST_CATEGORY_DATA,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        isTestCategoryDeleted: false
      }
    })
  })
}

/* SubCategory Module */

/* Get Test Category Functionality */
export const getAllTestSubCategoryAction = (start, limit, sort, order, search, token) => (dispatch) => {
  const data = {
    start,
    limit,
    sort,
    order,
    search
  }
  dispatch({ type: constants.CLEAR_GET_ALL_TEST_SUBCATEGORY_DATA })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/test/test-sub-category/get-all`, data, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.GET_ALL_TEST_SUBCATEGORY_DATA,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        subCategoryData: response.data.data,
        total: response.data.total
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.GET_ALL_TEST_SUBCATEGORY_DATA,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message
      }
    })
  })
}

/* View Test Category Functionality */
export const viewTestSubCategoryAction = (testData, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_VIEW_TEST_SUBCATEGORY_DATA })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/test/test-sub-category/get-by-id`, testData, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.VIEW_TEST_SUBCATEGORY_DATA,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        testSubCategoryDataById: response.data.data
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.VIEW_TEST_SUBCATEGORY_DATA,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message
      }
    })
  })
}

/* Get Test Category Functionality */
export const getCategoryAction = (data, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_GET_ALL_CATEGORIES_DATA })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/test/test-sub-category/get-all-test-sub-category`, data, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.GET_ALL_CATEGORIES_DATA,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        categories: response.data.data
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.GET_ALL_CATEGORIES_DATA,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message
      }
    })
  })
}

/* Delete Test Category Functionality */
export const deleteTestSubCategoryAction = (testData, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_DELETE_TEST_SUBCATEGORY_DATA })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/test/test-sub-category/delete`, testData, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.DELETE_TEST_SUBCATEGORY_DATA,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        isCategoryDeleted: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.DELETE_TEST_SUBCATEGORY_DATA,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        isCategoryDeleted: false
      }
    })
  })
}

/* Get All Main Test Category Functionality */
export const getAllMainCategoriesDataAction = (token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_GET_ALL_MAIN_CATEGORIES_DATA })
  axios.get(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/test/test-category/get-all-test-category`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.GET_ALL_MAIN_CATEGORIES_DATA,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        mainCategoryData: response.data.data
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.GET_ALL_MAIN_CATEGORIES_DATA,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message
      }
    })
  })
}

/* Add Test Sub Category Functionality */
export const addSubCategoryTestAction = (testData, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_ADD_SUBCATEGORY })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/test/test-sub-category/create`, testData, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.ADD_SUBCATEGORY,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        isSubCategoryAdded: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.ADD_SUBCATEGORY,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        isSubCategoryAdded: false
      }
    })
  })
}

/* Add Test Sub Category Functionality */
export const updateSubCategoryTestAction = (testData, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_EDIT_TEST_SUBCATEGORY })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/test/test-sub-category/update`, testData, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.EDIT_TEST_SUBCATEGORY,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        isSubCategoryEdited: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.EDIT_TEST_SUBCATEGORY,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        isSubCategoryEdited: false
      }
    })
  })
}
