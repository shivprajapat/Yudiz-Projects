import { CLEAR_RULE_MESSAGE, DELETE_RULE, REWARDS_LIST, RULE_DETAILS, RULE_LIST, UPDATE_RULE } from '../actions/constants'
import { commonReducer } from '../helpers/helper'

export default (state = { }, action = {}) => {
  switch (action.type) {
    case RULE_LIST:
      return {
        ...state,
        ruleList: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case DELETE_RULE:
      return commonReducer(state, action)
    case RULE_DETAILS:
      return {
        ...state,
        ruleDetails: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case UPDATE_RULE:
      return commonReducer(state, action)
    case REWARDS_LIST:
      return {
        ...state,
        rewardsList: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case CLEAR_RULE_MESSAGE:
      return {
        resMessage: ''
      }
    default:
      return state
  }
}
