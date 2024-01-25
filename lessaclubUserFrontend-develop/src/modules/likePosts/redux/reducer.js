import { CLEAR_LIKE_POST_RESPONSE, CLEAR_UN_LIKE_POST_RESPONSE, LIKE_POST, UN_LIKE_POST } from './action'

export const likePosts = (state = {}, action = {}) => {
  switch (action.type) {
    case LIKE_POST:
      return {
        ...state,
        likePost: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case UN_LIKE_POST:
      return {
        ...state,
        unLike: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }

    case CLEAR_LIKE_POST_RESPONSE:
      return {
        ...state,
        likePost: {},
        resStatus: '',
        resMessage: ''
      }
    case CLEAR_UN_LIKE_POST_RESPONSE:
      return {
        unLike: {},
        resStatus: false,
        resMessage: ''
      }
    default:
      return state
  }
}
