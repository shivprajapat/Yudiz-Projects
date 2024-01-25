import { GET_ACTIVE_SPORTS } from '../constants'

export default (state = {}, action = {}) => {
  switch (action.type) {
    case GET_ACTIVE_SPORTS:
      return {
        ...state,
        resMessage: action.payload.resMessage,
        activeSports: action.payload.data,
        resStatus: action.payload.resStatus
      }
    default:
      return state
  }
}
