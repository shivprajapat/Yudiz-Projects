import { UPDATE_KYC, CLEAR_KYC_RESPONSE } from './action'

export const truliooKyc = (state = {}, action = {}) => {
  switch (action.type) {
    case UPDATE_KYC:
      return {
        ...state,
        kyc: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case CLEAR_KYC_RESPONSE:
      return {
        resStatus: false,
        resMessage: ''
      }
    default:
      return state
  }
}
