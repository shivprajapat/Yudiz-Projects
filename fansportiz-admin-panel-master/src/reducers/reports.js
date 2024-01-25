import { CLEAR_REPORT_MESSAGE, GET_ALL_REPORTS, GET_DATE_RANGE_WISE_REPORTS, UPDATE_APP_DOWNLOAD_REPORT, UPDATE_CASHBACK_REPORT, UPDATE_CASHBACK_RETURN_REPORT, UPDATE_CREATOR_BONUS_REPORT, UPDATE_CREATOR_BONUS_RETURN_REPORT, UPDATE_GENERALIZE_REPORT, UPDATE_PARTICIPANTS, UPDATE_PLAYED_REPORT, UPDATE_PLAY_RETURN_REPORT, UPDATE_PRIVATELEAGUE, UPDATE_TEAMS, UPDATE_WINS, UPDATE_WIN_RETURN } from '../actions/constants'

export default (state = {}, action = {}) => {
  switch (action.type) {
    case GET_ALL_REPORTS:
      return {
        ...state,
        allReportsList: action.payload.data,
        resMessage: action.payload.resMessage,
        resStatus: action.payload.resStatus
      }
    case GET_DATE_RANGE_WISE_REPORTS:
      return {
        ...state,
        dateRangeWiseReportList: action.payload.data,
        resMessage: action.payload.resMessage,
        resStatus: action.payload.resStatus
      }
    case UPDATE_GENERALIZE_REPORT:
      return {
        ...state,
        updatedGeneralizeData: action.payload.data,
        resMessage: action.payload.resMessage,
        resStatus: action.payload.resStatus
      }
    case UPDATE_TEAMS:
      return {
        ...state,
        updatedTeamData: action.payload.data,
        resMessage: action.payload.resMessage,
        resStatus: action.payload.resStatus
      }
    case UPDATE_PARTICIPANTS:
      return {
        ...state,
        updatedParticipantsData: action.payload.data,
        resMessage: action.payload.resMessage,
        resStatus: action.payload.resStatus
      }
    case UPDATE_WINS:
      return {
        ...state,
        updatedWinsData: action.payload.data,
        resMessage: action.payload.resMessage,
        resStatus: action.payload.resStatus
      }
    case UPDATE_WIN_RETURN:
      return {
        ...state,
        updatedWinReturnData: action.payload.data,
        resMessage: action.payload.resMessage,
        resStatus: action.payload.resStatus
      }
    case UPDATE_PRIVATELEAGUE:
      return {
        ...state,
        updatedPrivateLeagueData: action.payload.data,
        resMessage: action.payload.resMessage,
        resStatus: action.payload.resStatus
      }
    case UPDATE_CASHBACK_REPORT:
      return {
        ...state,
        updatedCashbackData: action.payload.data,
        resMessage: action.payload.resMessage,
        resStatus: action.payload.resStatus
      }
    case UPDATE_CASHBACK_RETURN_REPORT:
      return {
        ...state,
        updatedCashbackReturnData: action.payload.data,
        resMessage: action.payload.resMessage,
        resStatus: action.payload.resStatus
      }
    case UPDATE_PLAYED_REPORT:
      return {
        ...state,
        updatedPlayedData: action.payload.data,
        resMessage: action.payload.resMessage,
        resStatus: action.payload.resStatus
      }
    case UPDATE_PLAY_RETURN_REPORT:
      return {
        ...state,
        updatedPlayReturnData: action.payload.data,
        resMessage: action.payload.resMessage,
        resStatus: action.payload.resStatus
      }
    case UPDATE_CREATOR_BONUS_REPORT:
      return {
        ...state,
        updatedCreatorBonusData: action.payload.data,
        resMessage: action.payload.resMessage,
        resStatus: action.payload.resStatus
      }
    case UPDATE_CREATOR_BONUS_RETURN_REPORT:
      return {
        ...state,
        updatedCreatorBonusReturnData: action.payload.data,
        resMessage: action.payload.resMessage,
        resStatus: action.payload.resStatus
      }
    case UPDATE_APP_DOWNLOAD_REPORT:
      return {
        ...state,
        updatedAppDownloadData: action.payload.data,
        resMessage: action.payload.resMessage,
        resStatus: action.payload.resStatus
      }
    case CLEAR_REPORT_MESSAGE:
      return {
        resMessage: ''
      }
    default:
      return state
  }
}
