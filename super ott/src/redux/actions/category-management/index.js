import axios from 'axios'
import { FailureToastNotification, SuccessToastNotification } from '../../../components/ToastNotification'
import {
  ADD_CATEGORY_BEGIN,
  ADD_CATEGORY_FAILURE,
  ADD_CATEGORY_SUCCESS,
  CATEGORY_LIST_BEGIN,
  CATEGORY_LIST_FAILURE,
  CATEGORY_LIST_SUCCESS,
  DELETE_CATEGORY_BEGIN,
  DELETE_CATEGORY_SUCCESS,
  DELETE_SUB_CATEGORY_BEGIN,
  DELETE_SUB_CATEGORY_SUCCESS,
  SUB_CATEGORY_LIST_BEGIN,
  SUB_CATEGORY_LIST_FAILURE,
  SUB_CATEGORY_LIST_SUCCESS,
  UPDATE_CATEGORY_BEGIN,
  UPDATE_CATEGORY_SUCCESS,
  UPDATE_CATEGORY_FAILURE,
  UPDATE_SUB_CATEGORY_BEGIN,
  UPDATE_SUB_CATEGORY_SUCCESS,
  UPDATE_SUB_CATEGORY_FAILURE,
  CATEGORY_DETAIL_BEGIN,
  CATEGORY_DETAIL_SUCCESS,
  CATEGORY_DETAIL_FAILURE,
  SUB_CATEGORY_DETAIL_BEGIN,
  SUB_CATEGORY_DETAIL_SUCCESS,
  SUB_CATEGORY_DETAIL_FAILURE,
  MAIN_CATEGORY_IN_SUB_CATEGORY_DETAIL_BEGIN,
  MAIN_CATEGORY_IN_SUB_CATEGORY_DETAIL_SUCCESS,
  MAIN_CATEGORY_IN_SUB_CATEGORY_DETAIL_FAILURE,
  SUB_CATEGORY_DROPDOWN_BEGIN,
  SUB_CATEGORY_DROPDOWN_SUCCESS,
  SUB_CATEGORY_DROPDOWN_FAILURE
} from '../constants'

const token = `Bearer ${localStorage.getItem('adminAuthToken')}`

export const categoryListBegin = () => ({
  type: CATEGORY_LIST_BEGIN
})

export const categoryListSuccess = (payload) => ({
  type: CATEGORY_LIST_SUCCESS,
  payload
})

export const categoryListFailure = (payload) => ({
  type: CATEGORY_LIST_FAILURE,
  payload
})

export const getCategoryList = (payload, callback) => (dispatch) => {
  dispatch(categoryListBegin())
  return axios
    .get(
      `${process.env.REACT_APP_AUTH_URL}/category/list?size=${payload.size}&search=${payload.search}&sort=${payload.sort}&orderBy=${payload.orderBy}&pageNumber=${payload.pageNumber}&eStatus=${payload.eStatus}&startDate=${payload.startDate}&endDate=${payload.endDate}`,
      {
        headers: {
          Authorization: `${token}`
        }
      },
      payload
    )
    .then(({ data }) => {
      dispatch(categoryListSuccess(data))
      callback && callback(data)
    })
    .catch((error) => {
      FailureToastNotification(error?.response?.data?.message)
      dispatch(categoryListFailure(error?.response?.data?.message))
    })
}

export const addCategoryBegin = () => ({
  type: ADD_CATEGORY_BEGIN
})

export const addCategorySuccess = () => ({
  type: ADD_CATEGORY_SUCCESS
})

export const addCategoryFailure = (payload) => ({
  type: ADD_CATEGORY_FAILURE,
  payload
})

export const addCategory = (payload, callBack) => {
  return (dispatch) => {
    dispatch(addCategoryBegin())
    return axios
      .post(`${process.env.REACT_APP_AUTH_URL}/category/add`, payload, {
        headers: {
          Authorization: `${token}`
        }
      })
      .then(({ data }) => {
        SuccessToastNotification(data.message)
        dispatch(addCategorySuccess())
        callBack && callBack()
      })
      .catch((error) => {
        FailureToastNotification(error?.response?.data?.message)
        dispatch(addCategoryFailure(error?.response?.data?.message))
      })
  }
}

export const deleteCategoryRequest = () => ({
  type: DELETE_CATEGORY_BEGIN
})
export const deleteCategorySuccess = (payload) => {
  return {
    type: DELETE_CATEGORY_SUCCESS,
    payload
  }
}

export const deleteCategoryAction = (payload, callBack) => {
  return async (dispatch) => {
    dispatch(deleteCategoryRequest())
    return axios
      .delete(
        `${process.env.REACT_APP_AUTH_URL}/category/${payload}`,

        {
          headers: {
            Authorization: `${token}`
          }
        }
      )
      .then(({ data }) => {
        dispatch(deleteCategorySuccess(payload))
        SuccessToastNotification(data?.message)
        callBack && callBack(data?.data)
      })
      .catch((error) => {
        FailureToastNotification(error?.message)
      })
  }
}

// ** sub-category

export const addSubCategoryBegin = () => ({
  type: ADD_CATEGORY_BEGIN
})

export const addSubCategorySuccess = (payload) => ({
  type: ADD_CATEGORY_SUCCESS,
  payload
})

export const addSubCategoryFailure = (payload) => ({
  type: ADD_CATEGORY_FAILURE,
  payload
})

export const addSubCategory = (payload, callBack) => {
  return (dispatch) => {
    dispatch(addSubCategoryBegin())
    return axios
      .post(`${process.env.REACT_APP_AUTH_URL}/subCategory/add`, payload, {
        headers: {
          Authorization: `${token}`
        }
      })
      .then(({ data }) => {
        dispatch(addSubCategorySuccess())
        SuccessToastNotification(data.message)
        callBack && callBack()
      })
      .catch((error) => {
        FailureToastNotification(error?.response?.data?.message)
        dispatch(addSubCategoryFailure(error?.response?.data?.message))
      })
  }
}

export const subCategoryListBegin = () => ({
  type: SUB_CATEGORY_LIST_BEGIN
})

export const subCategoryListSuccess = (payload) => ({
  type: SUB_CATEGORY_LIST_SUCCESS,
  payload
})

export const subCategoryListFailure = (payload) => ({
  type: SUB_CATEGORY_LIST_FAILURE,
  payload
})

export const getSubCategoryList = (payload, callBack) => {
  return async (dispatch) => {
    dispatch(subCategoryListBegin())
    return axios
      .get(
        `${process.env.REACT_APP_AUTH_URL}/subCategory/list?size=${payload.size}&search=${payload.search}&sort=${payload.sort}&orderBy=${payload.orderBy}&pageNumber=${payload.pageNumber}&eStatus=${payload.eStatus}&startDate=${payload.startDate}&endDate=${payload.endDate}`,
        {
          headers: {
            Authorization: `${token}`
          }
        },
        payload
      )
      .then(({ data }) => {
        dispatch(subCategoryListSuccess(data))
        callBack && callBack(data?.data)
      })
      .catch((error) => {
        FailureToastNotification(error?.response?.data?.message)
        dispatch(subCategoryListFailure(error?.response?.data?.message))
      })
  }
}

// ** delete-sub-category

export const deleteSubCategoryRequest = () => ({
  type: DELETE_SUB_CATEGORY_BEGIN
})
export const deleteSubCategorySuccess = (payload) => {
  return {
    type: DELETE_SUB_CATEGORY_SUCCESS,
    payload
  }
}

export const deleteSubCategoryAction = (payload, callBack) => {
  return (dispatch) => {
    dispatch(deleteSubCategoryRequest())
    return axios
      .delete(
        `${process.env.REACT_APP_AUTH_URL}/subCategory/${payload}`,

        {
          headers: {
            Authorization: `${token}`
          }
        }
      )
      .then(({ data }) => {
        dispatch(deleteSubCategorySuccess(payload))
        SuccessToastNotification(data?.message)
        callBack && callBack(data?.data)
      })
      .catch((error) => {
        FailureToastNotification(error?.message)
      })
  }
}

export const UpdateCategoryBegin = () => ({
  type: UPDATE_CATEGORY_BEGIN
})

export const UpdateCategorySuccess = (payload) => ({
  type: UPDATE_CATEGORY_SUCCESS,
  payload
})

export const UpdateCategoryFailure = (payload) => ({
  type: UPDATE_CATEGORY_FAILURE,
  payload
})

export const categoryUpdate = (id, payload, callBack) => (dispatch) => {
  dispatch(UpdateCategoryBegin())
  axios
    .put(`${process.env.REACT_APP_AUTH_URL}/category/edit/${id}`, payload, {
      headers: {
        Authorization: `${token}`
      }
    })
    .then(({ data }) => {
      dispatch(UpdateCategorySuccess(data))
      callBack && callBack()
      SuccessToastNotification(data.message)
    })
    .catch((error) => {
      FailureToastNotification(error?.response?.data?.message)
      dispatch(UpdateCategoryFailure(error?.response?.data?.message))
    })
}

export const UpdateSubCategoryBegin = () => ({
  type: UPDATE_SUB_CATEGORY_BEGIN
})

export const UpdateSubCategorySuccess = (payload) => ({
  type: UPDATE_SUB_CATEGORY_SUCCESS,
  payload
})

export const UpdateSubCategoryFailure = (payload) => ({
  type: UPDATE_SUB_CATEGORY_FAILURE,
  payload
})

export const subCategoryUpdate = (id, payload, callBack) => (dispatch) => {
  dispatch(UpdateSubCategoryBegin())
  axios
    .put(`${process.env.REACT_APP_AUTH_URL}/subCategory/edit/${id}`, payload, {
      headers: {
        Authorization: `${token}`
      }
    })
    .then(({ data }) => {
      dispatch(UpdateSubCategorySuccess(data))
      SuccessToastNotification(data.message)
      callBack && callBack()
    })
    .catch((error) => {
      FailureToastNotification(error?.response?.data?.message)
      dispatch(UpdateSubCategoryFailure(error?.response?.data?.message))
    })
}

export const categoryDetailBegin = () => ({
  type: CATEGORY_DETAIL_BEGIN
})

export const categoryDetailSuccess = (payload) => ({
  type: CATEGORY_DETAIL_SUCCESS,
  payload
})

export const categoryDetailFailure = (payload) => ({
  type: CATEGORY_DETAIL_FAILURE,
  payload
})

export const getCategoryById = (id) => (dispatch) => {
  dispatch(categoryDetailBegin())
  axios
    .get(`${process.env.REACT_APP_AUTH_URL}/category/view/${id}`, {
      headers: {
        Authorization: `${token}`
      }
    })
    .then(({ data }) => {
      dispatch(categoryDetailSuccess(data))
    })
    .catch((error) => {
      FailureToastNotification(error?.response?.data?.message)
      dispatch(categoryDetailFailure(error?.response?.data?.message))
    })
}

export const subCategoryDetailBegin = () => ({
  type: SUB_CATEGORY_DETAIL_BEGIN
})

export const subCategoryDetailSuccess = (payload) => ({
  type: SUB_CATEGORY_DETAIL_SUCCESS,
  payload
})

export const subCategoryDetailFailure = (payload) => ({
  type: SUB_CATEGORY_DETAIL_FAILURE,
  payload
})

export const getSubCategoryById = (id) => (dispatch) => {
  dispatch(subCategoryDetailBegin())
  axios
    .get(`${process.env.REACT_APP_AUTH_URL}/subCategory/view/${id}`, {
      headers: {
        Authorization: `${token}`
      }
    })
    .then(({ data }) => {
      dispatch(subCategoryDetailSuccess(data))
    })
    .catch((error) => {
      FailureToastNotification(error?.message)
      dispatch(subCategoryDetailFailure(error?.message))
    })
}

export const mainCategoryInSubCategoryBegin = () => ({
  type: MAIN_CATEGORY_IN_SUB_CATEGORY_DETAIL_BEGIN
})

export const mainCategoryInSubCategorySuccess = (payload) => ({
  type: MAIN_CATEGORY_IN_SUB_CATEGORY_DETAIL_SUCCESS,
  payload
})

export const mainCategoryInSubCategoryFailure = (payload) => ({
  type: MAIN_CATEGORY_IN_SUB_CATEGORY_DETAIL_FAILURE,
  payload
})

export const getCategoriesDropDown = () => (dispatch) => {
  dispatch(mainCategoryInSubCategoryBegin())
  axios
    .get(`${process.env.REACT_APP_AUTH_URL}/dropDown/category`, {
      headers: {
        Authorization: `${token}`
      }
    })
    .then(({ data }) => {
      dispatch(mainCategoryInSubCategorySuccess(data))
    })
    .catch((error) => {
      FailureToastNotification(error?.message)
      dispatch(mainCategoryInSubCategoryFailure(error?.message))
    })
}

export const subCategoriesDropDownBegin = () => ({
  type: SUB_CATEGORY_DROPDOWN_BEGIN
})

export const subCategoriesDropDownSuccess = (payload) => ({
  type: SUB_CATEGORY_DROPDOWN_SUCCESS,
  payload
})

export const subCategoriesDropDownFailure = (payload) => ({
  type: SUB_CATEGORY_DROPDOWN_FAILURE,
  payload
})

export const getSubCategoriesDropDown = (payload) => (dispatch) => {
  dispatch(subCategoriesDropDownBegin())
  axios
    .post(`${process.env.REACT_APP_AUTH_URL}/dropDown/subCategory`, payload, {
      headers: {
        Authorization: `${token}`
      }
    })
    .then(({ data }) => {
      dispatch(subCategoriesDropDownSuccess(data))
    })
    .catch((error) => {
      FailureToastNotification(error?.message)
      dispatch(subCategoriesDropDownFailure(error?.message))
    })
}
