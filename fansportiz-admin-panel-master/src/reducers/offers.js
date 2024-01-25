import { ADD_OFFER, CLEAR_OFFER_MESSAGE, CLEAR_OFFER_PROPS, DELETE_OFFER, OFFER_DETAILS, OFFER_LIST, UPDATE_OFFER } from '../actions/constants'
import { commonReducer } from '../helpers/helper'

export default (state = { }, action = {}) => {
  switch (action.type) {
    case OFFER_LIST:
      return {
        ...state,
        offerList: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case ADD_OFFER:
      return commonReducer(state, action)
    case OFFER_DETAILS:
      return {
        ...state,
        offerDetails: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case UPDATE_OFFER:
      return commonReducer(state, action)
    case DELETE_OFFER:
      return commonReducer(state, action)
    case CLEAR_OFFER_MESSAGE:
      return {
        resMessage: ''
      }
    case CLEAR_OFFER_PROPS:
      return {
        offerList: [],
        offerDetails: {},
        resStatus: false
      }
    default:
      return state
  }
}
