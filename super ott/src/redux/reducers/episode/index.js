import {
  ADD_EPISODE_BEGIN,
  ADD_EPISODE_FAILURE,
  ADD_EPISODE_SUCCESS,
  EPISODE_DETAIL_BEGIN,
  EPISODE_DETAIL_FAILURE,
  EPISODE_DETAIL_SUCCESS,
  EPISODE_LIST_BEGIN,
  EPISODE_LIST_FAILURE,
  EPISODE_LIST_SUCCESS
} from '../../actions/constants'

const initialState = {
  totalEpisodes: 0,
  allEpisodes: [],
  loading: false,
  error: null
}

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_EPISODE_BEGIN:
      return {
        ...state,
        loading: true,
        error: null
      }
    case ADD_EPISODE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action?.payload
      }
    case ADD_EPISODE_SUCCESS:
      return {
        ...state,
        loading: false,
        allEpisodes: [action?.payload?.data, ...state.allEpisodes]
      }

    case EPISODE_LIST_BEGIN:
      return {
        ...state,
        loading: true,
        error: null
      }
    case EPISODE_LIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action?.payload
      }
    case EPISODE_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        allEpisodes: action?.payload?.data?.length ? action?.payload?.data[0].episode : [],
        totalEpisodes: action?.payload?.data?.length ? action?.payload?.data[0].count?.total : '0'
      }
    case EPISODE_DETAIL_BEGIN:
      return {
        ...state,
        loading: true,
        getEpisodeById: null
      }
    case EPISODE_DETAIL_SUCCESS:
      return {
        ...state,
        loading: false,
        getEpisodeById: action?.payload?.data
      }
    case EPISODE_DETAIL_FAILURE:
      return {
        ...state,
        loading: false,
        error: action?.payload
      }
    default:
      return state
  }
}
