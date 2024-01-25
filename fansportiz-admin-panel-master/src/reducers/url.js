import { GET_KYC_URL, GET_URL, KYC_URL } from '../actions/constants'

export default (state = {}, action = {}) => {
  switch (action.type) {
    case GET_URL:
      return {
        getUrl: action.payload.data
      }
    case GET_KYC_URL:
      return {
        getKycUrl: action.payload.data
      }
    case KYC_URL:
      return {
        kycUrl: action.payload.data
      }
    default:
      return state
  }
}
