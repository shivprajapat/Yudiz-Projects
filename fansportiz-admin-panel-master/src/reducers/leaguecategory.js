import { CLEAR_DELETE_FILTER_CATEGORY, DELETE_FILTER_CATEGORY, ADD_FILTER_CATEGORY, ADD_LEAGUE_CATEGORY, CLEAR_LEAGUE_MESSAGE, FILTER_CATEGORIES_LIST, FILTER_CATEGORY_DETAILS, FILTER_CATEGORY_LIST, LEAGUE_CATEGORIES_LIST, LEAGUE_CATEGORY_DETAILS, LEAGUE_CATEGORY_LIST, UPDATE_FILTER_CATEGORY, UPDATE_LEAGUE_CATEGORY, DELETE_LEAGUE_CATEGORY } from '../actions/constants'
import { commonReducer } from '../helpers/helper'

export default (state = { }, action = {}) => {
  switch (action.type) {
    case LEAGUE_CATEGORY_LIST:
      return {
        ...state,
        LeaguecategoryList: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case DELETE_FILTER_CATEGORY:
      return {
        ...state,
        isDeleted: action.payload.isDeleted,
        resMessage: action.payload.resMessage,
        resStatus: action.payload.resStatus
      }
    case CLEAR_DELETE_FILTER_CATEGORY:
      return {
        isDeleted: null
      }
    case LEAGUE_CATEGORIES_LIST:
      return {
        ...state,
        LeaguecategoriesList: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case FILTER_CATEGORIES_LIST:
      return {
        ...state,
        FiltercategoriesList: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case LEAGUE_CATEGORY_DETAILS:
      return {
        ...state,
        LeagueCategoryDetails: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case FILTER_CATEGORY_LIST:
      return {
        ...state,
        FiltercategoryList: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case FILTER_CATEGORY_DETAILS:
      return {
        ...state,
        FilterCategoryDetails: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case ADD_LEAGUE_CATEGORY:
      return commonReducer(state, action)
    case UPDATE_LEAGUE_CATEGORY:
      return {
        ...state,
        LeagueCategoryDetails: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case ADD_FILTER_CATEGORY:
      return commonReducer(state, action)
    case UPDATE_FILTER_CATEGORY:
      return {
        ...state,
        FilterCategoryDetails: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case DELETE_LEAGUE_CATEGORY:
      return commonReducer(state, action)
    case CLEAR_LEAGUE_MESSAGE:
      return {
        resMessage: ''
      }
    default:
      return state
  }
}
