import { CLEAR_RESPONSE_MESSAGE, LEADERSHIP_BOARD, LEADERSHIP_BOARD_ADD_SEASON, LEADER_BOARD, SEASON_IDS } from '../actions/constants'

export default (state = { }, action = {}) => {
  switch (action.type) {
    case LEADERSHIP_BOARD:
      return {
        ...state,
        leaderBoardData: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case LEADER_BOARD:
      return {
        ...state,
        calculatedLeaderBoardData: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case SEASON_IDS:
      return {
        ...state,
        seasonIds: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case LEADERSHIP_BOARD_ADD_SEASON:
      return {
        ...state,
        resMessage: action.payload.resMessage,
        resStatus: action.payload.resStatus
      }
    case CLEAR_RESPONSE_MESSAGE:
      return {
        ...state,
        resMessage: ''
      }
    default:
      return state
  }
}
