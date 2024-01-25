import {
  CLEAR_SCORECARD_MESSAGE,
  GET_FETCH_LIVE_INNING, GET_FULL_SCORED, CLEAR_GET_FULL_SCORED, CLEAR_GET_FETCH_LIVE_INNING, GET_SCORECARD, CLEAR_SCORE_CARD
} from '../constants'

export default (state = {}, action) => {
  switch (action.type) {
    case GET_FULL_SCORED:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        fullScoreData: action.payload.data,
        isFetchFullScored: action.payload.isFetchFullScored
      }
    case GET_FETCH_LIVE_INNING:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        fullLiveInning: action.payload.data,
        isFetchLiveInning: action.payload.isFetchLiveInning
      }
    case GET_SCORECARD:
      return {
        ...state,
        scoreCard: action.payload.data,
        resMessage: action.payload.resMessage,
        resStatus: action.payload.resStatus
      }
    case CLEAR_SCORE_CARD:
      return {
        ...state,
        scoreCard: null,
        resMessage: ''
      }
    case CLEAR_SCORECARD_MESSAGE:
      return {
        ...state,
        resMessage: '',
        nOtpSend: null
      }
    case CLEAR_GET_FULL_SCORED:
      return {
        fullScoreData: null,
        isFetchFullScored: null
      }
    case CLEAR_GET_FETCH_LIVE_INNING:
      return {
        fullScoreData: null,
        isFetchLiveInning: null
      }
    default:
      return state
  }
}
