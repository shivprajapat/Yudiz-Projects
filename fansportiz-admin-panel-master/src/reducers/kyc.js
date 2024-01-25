import { ADD_AADHAAR_DETAILS, ADD_PAN_DETAILS, CLEAR_KYC_MESSAGE, GET_KYC_INFO, KYC_DETAILS, KYC_LIST, PENDING_KYC_COUNT, UPDATE_AADHAAR_DETAILS, UPDATE_KYC_STATUS, UPDATE_PAN_DETAILS } from '../actions/constants'
import { commonReducer } from '../helpers/helper'

export default (state = {}, action = {}) => {
  switch (action.type) {
    case KYC_LIST:
      return {
        ...state,
        kycList: action.payload.data,
        resMessage: action.payload.resMessage,
        resStatus: action.payload.resStatus,
        isFullResponse: action.payload.isFullResponse
      }
    case KYC_DETAILS:
      return {
        ...state,
        kycDetails: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case GET_KYC_INFO:
      return {
        ...state,
        kycInfo: action.payload.data
      }
    case CLEAR_KYC_MESSAGE:
      return {
        resMessage: '',
        isFullResponse: false
      }
    case UPDATE_PAN_DETAILS:
      return commonReducer(state, action)
    case ADD_PAN_DETAILS:
      return commonReducer(state, action)
    case UPDATE_AADHAAR_DETAILS:
      return commonReducer(state, action)
    case ADD_AADHAAR_DETAILS:
      return commonReducer(state, action)
    case UPDATE_KYC_STATUS:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        updatedKyc: action.payload.updatedKyc
      }
    case PENDING_KYC_COUNT:
      return {
        ...state,
        pendingKycCount: action.payload.data,
        resStatus: action.payload.resStatus
      }
    default:
      return state
  }
}
