import { ADD_TEAM, CLEAR_TEAM_MESSAGE, TEAMS_TOTAL_COUNT, TEAM_DETAILS, TEAM_LIST, TEAM_NAME, UPDATE_TEAM } from '../actions/constants'
import { commonReducer } from '../helpers/helper'

export default (state = {}, action = {}) => {
  switch (action.type) {
    case TEAM_LIST:
      return {
        ...state,
        teamList: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case 'BASEBALL_TEAM_LIST':
      return {
        ...state,
        baseballTeamList: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case ADD_TEAM:
      return commonReducer(state, action)
    case 'ADD_BASEBALL_TEAM':
      return commonReducer(state, action)
    case TEAM_DETAILS:
      return {
        ...state,
        teamDetails: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case 'BASEBALL_TEAM_DETAILS':
      return {
        ...state,
        baseballteamDetails: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case UPDATE_TEAM:
      return {
        ...state,
        teamDetails: action.payload.data,
        resMessage: action.payload.resMessage,
        resStatus: action.payload.resStatus
      }
    case 'UPDATE_BASEBALL_TEAM':
      return commonReducer(state, action)
    case TEAM_NAME:
      return {
        ...state,
        teamName: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case TEAMS_TOTAL_COUNT:
      return {
        ...state,
        teamsTotalCount: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case CLEAR_TEAM_MESSAGE:
      return {
        resMessage: ''
      }
    default:
      return state
  }
}
