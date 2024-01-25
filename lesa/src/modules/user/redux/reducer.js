import {
  CLEAR_PROFILE_UPDATE_RESPONSE,
  CLEAR_USER_ASSETS_RESPONSE,
  CLEAR_USER_OWNED_ASSETS_RESPONSE,
  CLEAR_USER_RESPONSE,
  GET_USER,
  GET_USER_ASSETS,
  GET_USER_OWNED_ASSETS,
  PROFILE_UPDATE
} from './action'

export const user = (state = {}, action = {}) => {
  switch (action.type) {
    case GET_USER:
      return {
        ...state,
        user: action.payload.data.users,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case GET_USER_ASSETS:
      return {
        ...state,
        userAssets: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case GET_USER_OWNED_ASSETS:
      return {
        ...state,
        userOwnedAssets: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case PROFILE_UPDATE:
      return {
        ...state,
        user: action.payload.data.user,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case CLEAR_PROFILE_UPDATE_RESPONSE:
      return {
        ...state,
        resStatus: false,
        resMessage: ''
      }
    case CLEAR_USER_OWNED_ASSETS_RESPONSE:
      return {
        ...state,
        userOwnedAssets: null,
        resStatus: false,
        resMessage: ''
      }
    case CLEAR_USER_RESPONSE:
      return {
        user: null,
        resStatus: false,
        resMessage: ''
      }
    case CLEAR_USER_ASSETS_RESPONSE:
      return {
        resStatus: false,
        resMessage: ''
      }
    default:
      return state
  }
}
