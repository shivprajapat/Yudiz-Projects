import { CLEAR_PASSBOOK_MESSAGE, PASSBOOK_DETAILS, PASSBOOK_LIST, STATISTIC_DETAILS, SYSTEM_USER_PASSBOOK_DETAILS, SYSTEM_USER_STATISTIC_DETAILS, TRANSACTIONS_TOTAL_COUNT } from '../actions/constants'

export default (state = { }, action = {}) => {
  switch (action.type) {
    case PASSBOOK_LIST:
      return {
        ...state,
        passbookList: action.payload.data,
        resStatus: action.payload.resStatus,
        isFullResponse: action.payload.isFullResponse
      }
    case PASSBOOK_DETAILS:
      return {
        ...state,
        passbookDetails: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case STATISTIC_DETAILS:
      return {
        ...state,
        statisticDetails: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case SYSTEM_USER_PASSBOOK_DETAILS:
      return {
        ...state,
        systemUserPassbookDetails: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case SYSTEM_USER_STATISTIC_DETAILS:
      return {
        ...state,
        systemUserStatisticDetails: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case TRANSACTIONS_TOTAL_COUNT:
      return {
        ...state,
        transactionsTotalCount: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case CLEAR_PASSBOOK_MESSAGE:
      return {
        resMessage: '',
        isFullResponse: false
      }
    default:
      return state
  }
}
