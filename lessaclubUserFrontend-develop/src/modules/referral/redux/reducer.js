const { GET_REFERRAL_CODE, CLEAR_REFERRAL_RESPONSE } = require('./action')

export const referral = (state = {}, action = {}) => {
  switch (action.type) {
    case GET_REFERRAL_CODE: {
      return {
        ...state,
        referral: action?.payload?.data,
        resStatus: action?.payload?.resStatus,
        resMessage: action?.payload?.resMessage
      }
    }
    case CLEAR_REFERRAL_RESPONSE: {
      return {
        ...state,
        referral: null,
        resStatus: false,
        resMessage: ''
      }
    }
    default:
      return state
  }
}
