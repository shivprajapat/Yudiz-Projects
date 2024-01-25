import {
  ADD_CAST_BEGIN,
  ADD_CAST_FAILURE,
  ADD_CAST_SUCCESS,
  CAST_DETAIL_BEGIN,
  CAST_DETAIL_FAILURE,
  CAST_DETAIL_SUCCESS,
  CAST_DROPDOWN_BEGIN,
  CAST_DROPDOWN_FAILURE,
  CAST_DROPDOWN_SUCCESS,
  CAST_LIST_BEGIN,
  CAST_LIST_FAILURE,
  CAST_LIST_SUCCESS
} from '../../actions/constants'

// ** Initial State
const initialState = {
  totalCast: 0,
  allCast: [],
  loading: false,
  error: null
}

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_CAST_BEGIN:
      return {
        ...state,
        loading: true,
        error: null
      }
    case ADD_CAST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action?.payload
      }
    case ADD_CAST_SUCCESS:
      return {
        ...state,
        loading: false,
        allCast: [action?.payload?.data, ...state.allCast]
      }

    case CAST_LIST_BEGIN:
      return {
        ...state,
        loading: true,
        error: null
      }
    case CAST_LIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action?.payload
      }
    case CAST_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        allCast: action?.payload?.data?.length ? action?.payload?.data[0].cast : [],
        totalCast: action?.payload?.data?.length ? action?.payload?.data[0]?.count?.total : 0
      }
    case CAST_DETAIL_BEGIN:
      return {
        ...state,
        loading: true,
        getCastById: null
      }
    case CAST_DETAIL_SUCCESS:
      return {
        ...state,
        loading: false,
        getCastById: action?.payload?.data
      }
    case CAST_DETAIL_FAILURE:
      return {
        ...state,
        loading: false,
        error: action?.payload
      }
    case CAST_DROPDOWN_BEGIN:
      return {
        ...state,
        loading: true,
        castDropDown: null
      }
    case CAST_DROPDOWN_SUCCESS:
      return {
        ...state,
        loading: true,
        castDropDown: action?.payload?.data
      }
    case CAST_DROPDOWN_FAILURE:
      return {
        ...state,
        loading: false
      }
    default:
      return state
  }
}
