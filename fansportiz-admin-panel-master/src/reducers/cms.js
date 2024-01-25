import { ADD_CMS, CLEAR_CMS_MESSAGE, CMS_DETAILS, CMS_LIST, DELETE_CMS, UPDATE_CMS } from '../actions/constants'
import { commonReducer } from '../helpers/helper'

export default (state = { }, action = {}) => {
  switch (action.type) {
    case CMS_LIST:
      return {
        ...state,
        cmsList: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case ADD_CMS:
      return commonReducer(state, action)
    case CMS_DETAILS:
      return {
        ...state,
        cmsDetails: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case UPDATE_CMS:
      return {
        ...state,
        cmsDetails: action.payload.data,
        resMessage: action.payload.resMessage,
        resStatus: action.payload.resStatus
      }
    case DELETE_CMS:
      return commonReducer(state, action)
    case CLEAR_CMS_MESSAGE:
      return {
        resMessage: ''
      }
    default:
      return state
  }
}
