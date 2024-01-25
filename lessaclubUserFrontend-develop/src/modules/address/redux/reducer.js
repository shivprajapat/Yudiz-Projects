import {
  ADD_ADDRESS,
  CLEAR_ADD_ADDRESS_RESPONSE,
  CLEAR_DELETE_ADDRESS_RESPONSE,
  CLEAR_GET_ADDRESSES_RESPONSE,
  CLEAR_UPDATE_ADDRESS_RESPONSE,
  DELETE_ADDRESS,
  GET_ADDRESS,
  UPDATE_ADDRESS
} from './action'

export const address = (state = {}, action = {}) => {
  switch (action.type) {
    case GET_ADDRESS:
      return {
        ...state,
        getAddress: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case CLEAR_GET_ADDRESSES_RESPONSE:
      return {
        ...state,
        getAddress: {},
        resStatus: false,
        resMessage: ''
      }
    case ADD_ADDRESS:
      return {
        ...state,
        addAddress: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case CLEAR_ADD_ADDRESS_RESPONSE:
      return {
        ...state,
        addAddress: {},
        resStatus: false,
        resMessage: ''
      }
    case UPDATE_ADDRESS:
      return {
        ...state,
        updateAddress: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case CLEAR_UPDATE_ADDRESS_RESPONSE:
      return {
        ...state,
        updateAddress: {},
        resStatus: false,
        resMessage: ''
      }
    case DELETE_ADDRESS:
      return {
        ...state,
        deleteAddress: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case CLEAR_DELETE_ADDRESS_RESPONSE:
      return {
        ...state,
        deleteAddress: {},
        resStatus: false,
        resMessage: ''
      }

    default:
      return state
  }
}
