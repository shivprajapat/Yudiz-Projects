import { CHANGE_BG_IMAGE, CLEAR_SETTING_MESSAGE, CURRENCY_DATA, GET_VALIDATION, SETTING_DETAILS, SETTING_LIST, SIDE_BG_IMAGE, UPDATE_CURRENCY, UPDATE_SETTING } from '../actions/constants'
import { commonReducer } from '../helpers/helper'

export default (state = {}, action = {}) => {
  switch (action.type) {
    case SETTING_LIST:
      return {
        ...state,
        settingList: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case SETTING_DETAILS:
      return {
        ...state,
        settingDetails: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case UPDATE_SETTING:
      return commonReducer(state, action)
    case SIDE_BG_IMAGE:
      return {
        ...state,
        sideBgImage: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case CHANGE_BG_IMAGE:
      return commonReducer(state, action)
    case CURRENCY_DATA:
      return {
        ...state,
        currencyDetails: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case GET_VALIDATION:
      return {
        ...state,
        validation: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case UPDATE_CURRENCY:
      return commonReducer(state, action)
    case CLEAR_SETTING_MESSAGE:
      return {
        resMessage: ''
      }
    default:
      return state
  }
}
