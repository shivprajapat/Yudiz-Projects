import { CLEAR_FEEDBACK_MESSAGE, FEEDBACK_DETAILS, FEEDBACK_LIST, UPDATE_FEEDBACK_STATUS } from '../actions/constants'
import { commonReducer } from '../helpers/helper'

export default (state = {}, action = {}) => {
  switch (action.type) {
    case FEEDBACK_LIST:
      return {
        ...state,
        feedbackList: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case FEEDBACK_DETAILS:
      return {
        ...state,
        feedbackDetails: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case UPDATE_FEEDBACK_STATUS:
      return commonReducer(state, action)
    case CLEAR_FEEDBACK_MESSAGE:
      return {
        resMessage: ''
      }
    default:
      return state
  }
}
