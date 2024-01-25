import {
  MORE_LIST,
  CONTEST_SLUG_DETAILS,
  GET_SCORE_POINTS,
  GET_OFFER_LIST,
  CLEAR_SCORE_POINTS,
  CLEAR_OFFER_LIST,
  CLEAR_CONTEST_SLUG_MESSAGE,
  CLEAR_MORE_LIST,
  MATCH_TIPS_DETAILS
} from '../constants'

export default (state = {}, action) => {
  switch (action.type) {
    case MORE_LIST:
      return {
        ...state,
        resMessage: action.payload.resMessage,
        moreContentList: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case CONTEST_SLUG_DETAILS:
      return {
        ...state,
        resMessage: action.payload.resMessage,
        contestSlugDetails: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case MATCH_TIPS_DETAILS:
      return {
        ...state,
        resMessage: action.payload.resMessage,
        matchTipsDetails: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case GET_SCORE_POINTS:
      return {
        ...state,
        resMessage: action.payload.resMessage,
        scorePoints: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case GET_OFFER_LIST:
      return {
        ...state,
        resMessage: action.payload.resMessage,
        offerList: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case CLEAR_SCORE_POINTS:
      return {
        ...state,
        scorePoints: '',
        resMessage: ''
      }
    case CLEAR_OFFER_LIST:
      return {
        ...state,
        offerList: '',
        resMessage: ''
      }
    case CLEAR_CONTEST_SLUG_MESSAGE:
      return {
        ...state,
        contestSlugDetails: '',
        matchTipsDetails: '',
        resMessage: '',
        resStatus: null
      }
    case CLEAR_MORE_LIST:
      return {
        ...state,
        resMessage: '',
        moreContentList: ''
      }
    default:
      return state
  }
}
