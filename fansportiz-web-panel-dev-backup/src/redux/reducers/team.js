import {
  TEAM_LIST,
  CONTEST_LIST,
  CONTEST_JOIN_LIST,
  USER_TEAM,
  DREAM_TEAM,
  SWITCH_USER_TEAM,
  TEAM_PLAYER_LIST,
  CREATE_TEAM,
  EDIT_TEAM,
  CLEAR_TEAM_LIST,
  CLEAR_CONTEST_LIST,
  CLEAR_CONTEST_JOIN_LIST,
  CLEAR_EDIT_TEAM,
  CLEAR_TEAM_PLAYER_LIST,
  CLEAR_PRIVATE_LEAGUE_VALIDATION,
  PRIVATE_LEAGUE_VALIDATION,
  CLEAR_CREATE_TEAM,
  CLEAR_USER_TEAM,
  CLEAR_TEAM_MESSAGE,
  USER_COMPARE_TEAM,
  CLEAR_JOIN_DETAILS,
  JOIN_DETAILS,
  GET_AUTO_PICK_TEAM,
  CLEAR_AUTO_PICK_TEAM
} from '../constants'

export default (state = {}, action) => {
  switch (action.type) {
    case TEAM_LIST:
      return {
        ...state,
        teamList: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case CONTEST_LIST:
      return {
        ...state,
        contestList: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case CONTEST_JOIN_LIST:
      return {
        ...state,
        contestJoinList: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case USER_TEAM:
      return {
        ...state,
        userTeam: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case DREAM_TEAM:
      return {
        ...state,
        dreamTeam: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case USER_COMPARE_TEAM:
      return {
        ...state,
        userCompareTeam: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case SWITCH_USER_TEAM:
      return {
        ...state,
        resMessage: action.payload.resMessage,
        resStatus: action.payload.resStatus,
        switchTeamSuccess: action.payload.resStatus
      }
    case TEAM_PLAYER_LIST:
      return {
        ...state,
        matchPlayerMatchId: action.payload.matchPlayerMatchId,
        teamPlayerList: action.payload.matchPlayer,
        playerRoles: action.payload.aPlayerRole,
        resMessage: action.payload.resMessage,
        resStatus: action.payload.resStatus
      }
    case CREATE_TEAM:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        createAndJoin: action.payload.createAndJoin,
        createTeamData: action.payload.createTeamData,
        isCreateTeam: action.payload.isCreateTeam
      }
    case EDIT_TEAM:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isEditTeam: action.payload.isEditTeam
      }
    case PRIVATE_LEAGUE_VALIDATION:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        privateLeagueValidation: action.payload.privateLeagueValidation
      }
    case CLEAR_TEAM_LIST:
      return {
        ...state,
        teamList: null,
        resMessage: '',
        resStatus: null,
        dreamTeam: null
      }
    case CLEAR_CONTEST_LIST:
      return {
        ...state,
        contestList: ''
      }
    case CLEAR_CONTEST_JOIN_LIST:
      return {
        ...state,
        contestJoinList: null,
        resStatus: null
      }
    case CLEAR_TEAM_PLAYER_LIST:
      return {
        ...state,
        teamPlayerList: null
      }
    case CLEAR_CREATE_TEAM:
      return {
        ...state,
        isCreateTeam: null
      }
    case CLEAR_EDIT_TEAM:
      return {
        ...state,
        isEditTeam: null
      }
    case CLEAR_USER_TEAM:
      return {
        ...state,
        userTeam: null
      }
    case CLEAR_PRIVATE_LEAGUE_VALIDATION:
      return {
        ...state,
        privateLeagueValidation: null
      }
    case CLEAR_TEAM_MESSAGE:
      return {
        ...state,
        resMessage: '',
        resStatus: null,
        createAndJoin: null
      }
    case JOIN_DETAILS:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        joinDetails: action.payload.data
      }
    case CLEAR_JOIN_DETAILS:
      return {
        ...state,
        joinDetails: null,
        resMessage: ''
      }
    case GET_AUTO_PICK_TEAM:
      return {
        ...state,
        autoPickTeam: action.payload.data,
        resMessage: action.payload.resMessage,
        resStatus: action.payload.resStatus
      }
    case CLEAR_AUTO_PICK_TEAM:
      return {
        ...state,
        autoPickTeam: null
      }
    default:
      return state
  }
}
