import {
  ADD_MOVIE_BEGIN,
  ADD_MOVIE_FAILURE,
  ADD_MOVIE_SUCCESS,
  MOVIE_DETAIL_BEGIN,
  MOVIE_DETAIL_FAILURE,
  MOVIE_DETAIL_SUCCESS,
  MOVIE_LIST_BEGIN,
  MOVIE_LIST_FAILURE,
  MOVIE_LIST_SUCCESS
} from '../../actions/constants'

const initialState = {
  totalMovies: 0,
  allMovies: [],
  loading: false,
  error: null
}

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_MOVIE_BEGIN:
      return {
        ...state,
        loading: true,
        error: null
      }
    case ADD_MOVIE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action?.payload
      }
    case ADD_MOVIE_SUCCESS:
      return {
        ...state,
        loading: false,
        allMovies: [action?.payload?.data, ...state.allMovies]
      }

    case MOVIE_LIST_BEGIN:
      return {
        ...state,
        loading: true,
        error: null
      }
    case MOVIE_LIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action?.payload
      }
    case MOVIE_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        allMovies: action?.payload?.data?.length ? action?.payload?.data[0].movie : [],
        totalMovies: action?.payload?.data?.length ? action?.payload?.data[0].count?.total : '0'
      }
    case MOVIE_DETAIL_BEGIN:
      return {
        ...state,
        loading: true,
        getMovieById: null
      }
    case MOVIE_DETAIL_SUCCESS:
      return {
        ...state,
        loading: false,
        getMovieById: action?.payload?.data[0]
      }
    case MOVIE_DETAIL_FAILURE:
      return {
        ...state,
        loading: false,
        error: action?.payload
      }
    default:
      return state
  }
}
