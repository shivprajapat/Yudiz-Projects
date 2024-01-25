import { GIFT_CREATION, CLEAR_GIFT_CREATION_RESPONSE } from './action'

export const gift = (state = {}, action = {}) => {
  switch (action.type) {
    case GIFT_CREATION:
      return {
        ...state,
        giftCreation: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        giftCreated: true
      }
    case CLEAR_GIFT_CREATION_RESPONSE:
      return {
        ...state,
        giftCreation: {},
        resStatus: false,
        resMessage: '',
        giftCreated: false
      }
    default:
      return state
  }
}
