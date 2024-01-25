import { CLEAR_EXPLORE_RESPONSE, GET_EXPLORE_ASSETS } from './action'

export const explore = (state = {}, action = {}) => {
  switch (action.type) {
    case GET_EXPLORE_ASSETS:
      return {
        ...state,
        explore: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case CLEAR_EXPLORE_RESPONSE:
      return {
        resStatus: false,
        resMessage: ''
      }
    default:
      return state
  }
}
