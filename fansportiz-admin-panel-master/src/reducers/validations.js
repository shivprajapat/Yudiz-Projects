import { CLEAR_VALIDATION_MESSAGE, UPDATE_VALIDATION, VALIDATION_DETAILS, VALIDATION_LIST } from '../actions/constants'
import { commonReducer } from '../helpers/helper'

export default (state = { }, action = {}) => {
  switch (action.type) {
    case VALIDATION_LIST:
      return {
        ...state,
        validationsList: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case VALIDATION_DETAILS:
      return {
        ...state,
        validationDetails: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case UPDATE_VALIDATION:
      return commonReducer(state, action)
    case CLEAR_VALIDATION_MESSAGE:
      return {
        resMessage: ''
      }
    default:
      return state
  }
}
