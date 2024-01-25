import {
  ADD_WEB_SERIES_BEGIN,
  ADD_WEB_SERIES_FAILURE,
  ADD_WEB_SERIES_SUCCESS,
  WEB_SERIES_DETAIL_BEGIN,
  WEB_SERIES_DETAIL_FAILURE,
  WEB_SERIES_DETAIL_SUCCESS,
  WEB_SERIES_LIST_BEGIN,
  WEB_SERIES_LIST_FAILURE,
  WEB_SERIES_LIST_SUCCESS
} from '../../actions/constants'

const initialState = {
  totalWebSeries: 0,
  allWebSeries: [],
  loading: false,
  error: null
}

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_WEB_SERIES_BEGIN:
      return {
        ...state,
        loading: true,
        error: null
      }
    case ADD_WEB_SERIES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action?.payload
      }
    case ADD_WEB_SERIES_SUCCESS:
      return {
        ...state,
        loading: false,
        allWebSeries: [action?.payload?.data, ...state.allWebSeries]
      }

    case WEB_SERIES_LIST_BEGIN:
      return {
        ...state,
        loading: true,
        error: null
      }
    case WEB_SERIES_LIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action?.payload
      }
    case WEB_SERIES_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        allWebSeries: action?.payload?.data?.length ? action?.payload?.data[0].webSeries : [],
        totalWebSeries: action?.payload?.data?.length ? action?.payload?.data[0].count?.total : '0'
      }
    case WEB_SERIES_DETAIL_BEGIN:
      return {
        ...state,
        loading: true,
        getWebSeriesById: null
      }
    case WEB_SERIES_DETAIL_SUCCESS:
      return {
        ...state,
        loading: false,
        getWebSeriesById: action?.payload?.data
      }
    case WEB_SERIES_DETAIL_FAILURE:
      return {
        ...state,
        loading: false,
        error: action?.payload
      }
    default:
      return state
  }
}
