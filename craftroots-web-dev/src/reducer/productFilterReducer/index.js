import { constants } from '@/actions/type'

const initialState = {
  data: null,
  isLoading: null,
  total_count: 0,
  mainCatFilters: null,
  subCatFilters: null,
  isFilterLoading: null,
}

export const productFilterReducer = (state = initialState, action) => {
  switch (action.type) {
    case constants.CLEAR_INITIAL_DATA:
      return {
        ...state,
        data: null,
        isLoading: true,
      }
    case constants.ADD_INITIAL_DATA:
      return {
        ...state,
        data: action.payload,
        isLoading: false,
        total_count: action.total_count,
      }
    case constants.ADD_FILTER_DATA:
      return {
        ...state,
        data: action.payload,
        isLoading: false,
        total_count: action.total_count,
      }
    case constants.CLEAR_ADD_LOADMORE__DATA:
      return {
        ...state,
        isLoading: true,
      }
    case constants.ADD_LOADMORE_DATA:
      return {
        ...state,
        data:
          action?.payload?.length > 0
            ? [...state.data, ...action.payload]
            : [...state?.data],
        isLoading: false,
        total_count: action?.total_count
          ? action.total_count
          : state.data.length,
      }
    case constants.CLEAR_MAIN_CAT_FILTERS:
      return {
        ...state,
        isFilterLoading: true,
        mainCatFilters: null,
        subCatFilters: null,
      }
    case constants.ADD_MAIN_CAT_FILTERS:
      return {
        ...state,
        isFilterLoading: false,
        mainCatFilters: action.mainCatFilters,
        subCatFilters: action.subCatFilters,
      }
    default:
      return state
  }
}
