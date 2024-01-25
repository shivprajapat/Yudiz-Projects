import {
  GET_URL
} from '../constants'

export default (state = {}, action) => {
  switch (action.type) {
    case GET_URL:
      return {
        getUrl: action.payload.media,
        getKycUrl: action.payload.kyc
      }
    default:
      return state
  }
}
