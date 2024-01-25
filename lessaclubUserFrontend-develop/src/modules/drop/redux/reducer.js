import {
  CLEAR_CREATE_DROP_RESPONSE,
  CLEAR_GET_DROP_LIST_RESPONSE,
  CLEAR_UPDATE_DROP_RESPONSE,
  CREATE_DROP,
  GET_DROP_LIST,
  UPDATE_DROP
} from './action'

export const drop = (state = {}, action = {}) => {
  switch (action.type) {
    case GET_DROP_LIST:
      return {
        ...state,
        getDrops: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case CREATE_DROP:
      return {
        ...state,
        createDrop: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case CLEAR_CREATE_DROP_RESPONSE:
      return {
        ...state,
        createDrop: {},
        resStatus: '',
        resMessage: ''
      }
    case UPDATE_DROP:
      return {
        ...state,
        updateDrop: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case CLEAR_UPDATE_DROP_RESPONSE:
      return {
        ...state,
        updateDrop: {},
        resStatus: '',
        resMessage: ''
      }
    case CLEAR_GET_DROP_LIST_RESPONSE:
      return {
        ...state,
        getDrops: {},
        resStatus: '',
        resMessage: ''
      }
    default:
      return state
  }
}
