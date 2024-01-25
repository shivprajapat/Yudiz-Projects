import { GET_AUCTION_BIDS, CLEAR_AUCTION_BIDS_RESPONSE } from './action'

export const auction = (state = {}, action = {}) => {
  switch (action.type) {
    case GET_AUCTION_BIDS:
      return {
        ...state,
        auctionBids: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case CLEAR_AUCTION_BIDS_RESPONSE:
      return {
        ...state,
        auctionBids: null,
        resStatus: false,
        resMessage: ''
      }
    default:
      return state
  }
}
