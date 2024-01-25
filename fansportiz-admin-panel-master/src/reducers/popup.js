import { ADD_POP_UP_AD, CLEAR_POPUP_AD_MESSAGE, DELETE_POP_UP_AD, POP_UP_ADS_LIST, POP_UP_AD_DETAILS, UPDATE_POP_UP_AD } from '../actions/constants'
import { commonReducer } from '../helpers/helper'

export default (state = { }, action = {}) => {
  switch (action.type) {
    case POP_UP_ADS_LIST:
      return {
        ...state,
        popUpAdsList: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case POP_UP_AD_DETAILS:
      return {
        ...state,
        popupAdDetails: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case ADD_POP_UP_AD:
      return commonReducer(state, action)
    case UPDATE_POP_UP_AD:
      return commonReducer(state, action)
    case DELETE_POP_UP_AD:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case CLEAR_POPUP_AD_MESSAGE:
      return {
        resMessage: ''
      }
    default:
      return state
  }
}
