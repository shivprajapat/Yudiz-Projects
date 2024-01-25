import {
  ADD_CATEGORY_BEGIN,
  ADD_CATEGORY_FAILURE,
  ADD_CATEGORY_SUCCESS,
  ADD_SUB_CATEGORY_BEGIN,
  ADD_SUB_CATEGORY_FAILURE,
  ADD_SUB_CATEGORY_SUCCESS,
  CATEGORY_DETAIL_BEGIN,
  CATEGORY_DETAIL_FAILURE,
  CATEGORY_DETAIL_SUCCESS,
  CATEGORY_LIST_BEGIN,
  CATEGORY_LIST_FAILURE,
  CATEGORY_LIST_SUCCESS,
  MAIN_CATEGORY_IN_SUB_CATEGORY_DETAIL_BEGIN,
  MAIN_CATEGORY_IN_SUB_CATEGORY_DETAIL_FAILURE,
  MAIN_CATEGORY_IN_SUB_CATEGORY_DETAIL_SUCCESS,
  SUB_CATEGORY_DETAIL_BEGIN,
  SUB_CATEGORY_DETAIL_FAILURE,
  SUB_CATEGORY_DETAIL_SUCCESS,
  SUB_CATEGORY_DROPDOWN_BEGIN,
  SUB_CATEGORY_DROPDOWN_FAILURE,
  SUB_CATEGORY_DROPDOWN_SUCCESS,
  SUB_CATEGORY_LIST_BEGIN,
  SUB_CATEGORY_LIST_FAILURE,
  SUB_CATEGORY_LIST_SUCCESS
} from '../../actions/constants'

const initialState = {
  totalCategories: 0,
  allCategories: [],
  totalSubCategories: 0,
  allSubCategories: [],
  getCategoryById: {},
  loading: false,
  error: null
}

export default (state = initialState, action) => {
  switch (action.type) {
    case CATEGORY_LIST_BEGIN:
      return {
        ...state,
        loading: true,
        error: null
      }
    case CATEGORY_LIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action?.payload
      }
    case CATEGORY_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        allCategories: action?.payload?.data[0]?.categories,
        totalCategories: action?.payload?.data[0]?.count?.total
      }
    case ADD_CATEGORY_BEGIN:
      return {
        ...state,
        loading: true,
        error: null
      }
    case ADD_CATEGORY_FAILURE:
      return {
        ...state,
        loading: false,
        error: action?.payload
      }
    case ADD_CATEGORY_SUCCESS:
      return {
        ...state,
        loading: false
      }

    case ADD_SUB_CATEGORY_BEGIN:
      return {
        ...state,
        loading: true,
        error: null
      }
    case ADD_SUB_CATEGORY_FAILURE:
      return {
        ...state,
        loading: false,
        error: action?.payload
      }
    case ADD_SUB_CATEGORY_SUCCESS:
      return {
        ...state,
        loading: false,
        allSubCategories: [action?.payload?.data, ...state.allSubCategories]
      }

    case SUB_CATEGORY_LIST_BEGIN:
      return {
        ...state,
        loading: true,
        error: null
      }
    case SUB_CATEGORY_LIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action?.payload
      }
    case SUB_CATEGORY_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        allSubCategories: action?.payload?.data[0]?.SubCatetories,
        totalSubCategories: action?.payload?.data[0]?.count?.total
      }

    case CATEGORY_DETAIL_BEGIN:
      return {
        ...state,
        loading: true,
        getCategoryById: null
      }
    case CATEGORY_DETAIL_SUCCESS:
      return {
        ...state,
        loading: false,
        getCategoryById: action?.payload?.data
      }
    case CATEGORY_DETAIL_FAILURE:
      return {
        ...state,
        loading: false,
        error: action?.payload
      }
    case SUB_CATEGORY_DETAIL_BEGIN:
      return {
        ...state,
        loading: true,
        getSubCategoryById: null
      }
    case SUB_CATEGORY_DETAIL_SUCCESS:
      return {
        ...state,
        loading: false,
        getSubCategoryById: action?.payload?.data
      }
    case SUB_CATEGORY_DETAIL_FAILURE:
      return {
        ...state,
        loading: false,
        error: action?.payload
      }
    case MAIN_CATEGORY_IN_SUB_CATEGORY_DETAIL_BEGIN:
      return {
        ...state,
        loading: true,
        mainCategoryInSubCategory: null
      }
    case MAIN_CATEGORY_IN_SUB_CATEGORY_DETAIL_SUCCESS:
      return {
        ...state,
        loading: true,
        mainCategoryInSubCategory: action?.payload?.data
      }
    case MAIN_CATEGORY_IN_SUB_CATEGORY_DETAIL_FAILURE:
      return {
        ...state,
        loading: false
      }
    case SUB_CATEGORY_DROPDOWN_BEGIN:
      return {
        ...state,
        loading: true,
        subCategoriesDropDown: null
      }
    case SUB_CATEGORY_DROPDOWN_SUCCESS:
      return {
        ...state,
        loading: true,
        subCategoriesDropDown: action?.payload?.data
      }
    case SUB_CATEGORY_DROPDOWN_FAILURE:
      return {
        ...state,
        loading: false
      }
    default:
      return state
  }
}
