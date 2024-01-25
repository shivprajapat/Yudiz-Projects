import {
  CLEAR_FOLLOW_COMMUNITY_RESPONSE,
  CLEAR_GET_COMMUNITY_FOLLOWER_RESPONSE,
  CLEAR_GET_FOLLOWED_COMMUNITY_RESPONSE,
  CLEAR_UN_FOLLOW_COMMUNITY_RESPONSE,
  FOLLOW_COMMUNITY,
  GET_COMMUNITY_FOLLOWER,
  GET_FOLLOWED_COMMUNITY,
  UN_FOLLOW_COMMUNITY
} from './action'

export const follower = (state = {}, action = {}) => {
  switch (action.type) {
    case FOLLOW_COMMUNITY:
      return {
        ...state,
        followCommunity: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case UN_FOLLOW_COMMUNITY:
      return {
        ...state,
        unFollowCommunity: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case GET_COMMUNITY_FOLLOWER:
      return {
        ...state,
        getCommunityFollower: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case CLEAR_GET_COMMUNITY_FOLLOWER_RESPONSE:
      return {
        ...state,
        getCommunityFollower: {},
        resStatus: false,
        resMessage: ''
      }
    case CLEAR_UN_FOLLOW_COMMUNITY_RESPONSE:
      return {
        ...state,
        unFollowCommunity: {},
        resStatus: '',
        resMessage: ''
      }
    case CLEAR_FOLLOW_COMMUNITY_RESPONSE:
      return {
        followCommunity: {},
        resStatus: false,
        resMessage: ''
      }
    case GET_FOLLOWED_COMMUNITY:
      return {
        ...state,
        getFollowedCommunity: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case CLEAR_GET_FOLLOWED_COMMUNITY_RESPONSE:
      return {
        ...state,
        getFollowedCommunity: {},
        resStatus: false,
        resMessage: ''
      }
    default:
      return state
  }
}
