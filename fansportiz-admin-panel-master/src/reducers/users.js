import { ADD_BANK_DETAILS, GET_RECOMMANDED_LIST, ADD_USER_DEPOSIT, ADD_USER_WITHDRAW, CITIES_LIST, CLEAR_USERS_MESSAGE, EMAIL_TEMPLATE_DETAILS, EMAIL_TEMPLATE_LIST, GET_BALANCE_DETAILS, GET_BANK_DETAILS, GET_PREFERENCE_DETAILS, IMAGE_EMAIL_TEMPLATE, STATES_LIST, UPDATE_BANK_DETAILS, UPDATE_EMAIL_TEMPLATE, UPDATE_PREFERENCE_DETAILS, UPDATE_USER_DETAILS, USER_DETAIL_LIST, USER_LIST, USERS_TOTAL_COUNT, TDS_LIST, UPDATE_TDS, TDS_TOTAL_COUNT, GET_REFERRALS_LIST } from '../actions/constants'
import { commonReducer } from '../helpers/helper'

export default (state = {}, action = {}) => {
  switch (action.type) {
    case USER_LIST:
      return {
        ...state,
        usersList: action.payload.data,
        resStatus: action.payload.resStatus,
        isFullResponse: action.payload.isFullResponse
      }
    case UPDATE_USER_DETAILS:
      return commonReducer(state, action)
    case USER_DETAIL_LIST:
      return {
        ...state,
        usersDetails: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case GET_RECOMMANDED_LIST:
      return {
        ...state,
        recommendedList: action.payload.data,
        isSendId: action.payload.isSendId,
        resStatus: action.payload.resStatus
      }
    case ADD_USER_DEPOSIT:
      return commonReducer(state, action)
    case ADD_USER_WITHDRAW:
      return commonReducer(state, action)
    case GET_BANK_DETAILS:
      return {
        ...state,
        bankDetails: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case GET_BALANCE_DETAILS:
      return {
        ...state,
        balanceDetails: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case GET_PREFERENCE_DETAILS:
      return {
        ...state,
        preferenceDetails: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case ADD_BANK_DETAILS:
      return commonReducer(state, action)
    case UPDATE_BANK_DETAILS:
      return commonReducer(state, action)
    case UPDATE_PREFERENCE_DETAILS:
      return commonReducer(state, action)
    case STATES_LIST:
      return {
        ...state,
        stateList: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case CITIES_LIST:
      return {
        ...state,
        citiesList: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case EMAIL_TEMPLATE_LIST:
      return {
        ...state,
        EmailTemplateList: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case EMAIL_TEMPLATE_DETAILS:
      return {
        ...state,
        EmailTemplateDetails: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case UPDATE_EMAIL_TEMPLATE:
      return commonReducer(state, action)
    case IMAGE_EMAIL_TEMPLATE:
      return commonReducer(state, action)
    case 'ADD_SYSTEM_USER':
      return commonReducer(state, action)
    case USERS_TOTAL_COUNT:
      return {
        ...state,
        usersTotalCount: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case TDS_LIST:
      return {
        ...state,
        tdsList: action.payload.data,
        resMessage: action.payload.resMessage,
        isFullResponse: action.payload.isFullResponse,
        resStatus: action.payload.resStatus
      }
    case TDS_TOTAL_COUNT:
      return {
        ...state,
        tdsTotalCount: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case UPDATE_TDS:
      return {
        ...state,
        resMessage: action.payload.resMessage,
        resStatus: action.payload.resStatus
      }
    case GET_REFERRALS_LIST:
      return {
        ...state,
        referredList: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case CLEAR_USERS_MESSAGE:
      return {
        ...state,
        resMessage: '',
        isFullResponse: false
      }
    default:
      return state
  }
}
