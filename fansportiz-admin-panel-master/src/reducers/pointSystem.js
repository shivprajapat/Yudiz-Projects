import { CLEAR_SCORE_POINT_MESSAGE, FETCH_LIST, FETCH_SCORE_POINT, GET_POINT_SYSTEM, UPDATE_SCORE_POINTS } from '../actions/constants'

export default (state = {}, action = {}) => {
  switch (action.type) {
    case GET_POINT_SYSTEM:
      return {
        ...state,
        getPointSystemList: action.payload.data,
        resMessage: action.payload.resMessage,
        resStatus: action.payload.resStatus
      }
    case FETCH_LIST:
      return {
        ...state,
        getFormatsList: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case FETCH_SCORE_POINT:
      return {
        ...state,
        scorePointDetails: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case UPDATE_SCORE_POINTS:
      return {
        ...state,
        resMessage: action.payload.resMessage,
        resStatus: action.payload.resStatus
      }
    case CLEAR_SCORE_POINT_MESSAGE:
      return {
        getFormatsList: state.getFormatsList,
        resMessage: ''
      }
    default:
      return state
  }
}
