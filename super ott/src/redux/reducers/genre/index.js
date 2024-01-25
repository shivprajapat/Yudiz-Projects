import {
  ADD_GENRE_BEGIN,
  ADD_GENRE_FAILURE,
  ADD_GENRE_SUCCESS,
  GENRE_DETAIL_BEGIN,
  GENRE_DETAIL_FAILURE,
  GENRE_DETAIL_SUCCESS,
  GENRE_DROPDOWN_BEGIN,
  GENRE_DROPDOWN_FAILURE,
  GENRE_DROPDOWN_SUCCESS,
  GENRE_LIST_BEGIN,
  GENRE_LIST_FAILURE,
  GENRE_LIST_SUCCESS
} from '../../actions/constants'

// ** Initial State
const initialState = {
  totalGenres: 0,
  allGenres: [],
  loading: false,
  error: null
}

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_GENRE_BEGIN:
      return {
        ...state,
        loading: true,
        error: null
      }
    case ADD_GENRE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action?.payload
      }
    case ADD_GENRE_SUCCESS:
      return {
        ...state,
        loading: false,
        allGenres: [action?.payload?.data, ...state.allGenres]
      }

    case GENRE_LIST_BEGIN:
      return {
        ...state,
        loading: true,
        error: null
      }
    case GENRE_LIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action?.payload
      }
    case GENRE_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        allGenres: action?.payload?.data?.length ? action?.payload?.data[0].genre : [],
        totalGenres: action?.payload?.data?.length ? action?.payload?.data[0].count?.total : '0'
      }
    case GENRE_DETAIL_BEGIN:
      return {
        ...state,
        loading: true,
        getGenreById: null
      }
    case GENRE_DETAIL_SUCCESS:
      return {
        ...state,
        loading: false,
        getGenreById: action?.payload?.data
      }
    case GENRE_DETAIL_FAILURE:
      return {
        ...state,
        loading: false,
        error: action?.payload
      }
    case GENRE_DROPDOWN_BEGIN:
      return {
        ...state,
        loading: true,
        genreDropDown: null
      }
    case GENRE_DROPDOWN_SUCCESS:
      return {
        ...state,
        loading: true,
        genreDropDown: action?.payload?.data
      }
    case GENRE_DROPDOWN_FAILURE:
      return {
        ...state,
        loading: false
      }
    default:
      return state
  }
}
