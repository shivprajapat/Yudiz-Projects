import {
  ADD_CARD,
  CLEAR_ADD_CARD_RESPONSE,
  CLEAR_DELETE_CARD_RESPONSE,
  CLEAR_GET_CARD_RESPONSE,
  CLEAR_UPDATE_CARD_RESPONSE,
  DELETE_CARD,
  GET_CARD,
  UPDATE_CARD
} from './action'

export const card = (state = {}, action = {}) => {
  switch (action.type) {
    case GET_CARD:
      return {
        ...state,
        getCard: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case CLEAR_GET_CARD_RESPONSE:
      return {
        ...state,
        getCard: {},
        resStatus: false,
        resMessage: ''
      }
    case ADD_CARD:
      return {
        ...state,
        addCard: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case CLEAR_ADD_CARD_RESPONSE:
      return {
        ...state,
        addCard: {},
        resStatus: false,
        resMessage: ''
      }
    case UPDATE_CARD:
      return {
        ...state,
        updateCard: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case CLEAR_UPDATE_CARD_RESPONSE:
      return {
        ...state,
        updateCard: {},
        resStatus: false,
        resMessage: ''
      }
    case DELETE_CARD:
      return {
        ...state,
        deleteCard: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case CLEAR_DELETE_CARD_RESPONSE:
      return {
        ...state,
        deleteCard: {},
        resStatus: false,
        resMessage: ''
      }

    default:
      return state
  }
}
