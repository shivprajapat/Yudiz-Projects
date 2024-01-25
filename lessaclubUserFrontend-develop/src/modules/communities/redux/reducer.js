import {
  CLEAR_CREATE_COMMUNITY_RESPONSE,
  CLEAR_GET_ALL_COMMUNITIES_RESPONSE,
  CLEAR_GET_COMMUNITY_DETAILS_RESPONSE,
  CLEAR_GET_MY_COMMUNITIES_RESPONSE,
  CLEAR_GET_POPULAR_COMMUNITIES_RESPONSE,
  CLEAR_UPDATE_COMMUNITY_RESPONSE,
  CREATE_COMMUNITY,
  GET_ALL_COMMUNITIES,
  GET_COMMUNITY_DETAILS,
  GET_MY_COMMUNITIES,
  GET_POPULAR_COMMUNITIES,
  UPDATE_COMMUNITY
} from './action'

export const communities = (state = {}, action = {}) => {
  switch (action.type) {
    case CREATE_COMMUNITY:
      return {
        ...state,
        createCommunity: action.payload.data,
        myCommunities: (() => {
          if (action.payload.resStatus) {
            return {
              ...state.myCommunities,
              community: [action?.payload?.data?.community, ...state.myCommunities.community]
            }
          } else {
            return { ...state.myCommunities }
          }
        })(),
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case GET_MY_COMMUNITIES:
      return {
        ...state,
        myCommunities: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case GET_COMMUNITY_DETAILS:
      return {
        ...state,
        communityDetails: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case UPDATE_COMMUNITY:
      return {
        ...state,
        updateCommunity: action.payload.data,
        communityDetails: (() => {
          if (action.payload.resStatus) {
            return (
              state.communityDetails?.community?.id === action.payload.data?.community?.id && {
                community: action.payload.data?.community
              }
            )
          } else {
            return state.communityDetails
          }
        })(),
        myCommunities: (() => {
          if (action.payload.resStatus) {
            return {
              community: state.myCommunities?.community?.map((c) => {
                return c.id === action.payload.data?.community?.id ? action.payload.data?.community : c
              })
            }
          } else {
            return state.myCommunities
          }
        })(),
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case GET_ALL_COMMUNITIES:
      return {
        ...state,
        allCommunities: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case GET_POPULAR_COMMUNITIES:
      return {
        ...state,
        popularCommunities: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case CLEAR_GET_POPULAR_COMMUNITIES_RESPONSE:
      return {
        ...state,
        popularCommunities: null,
        resStatus: '',
        resMessage: ''
      }
    case CLEAR_GET_ALL_COMMUNITIES_RESPONSE:
      return {
        ...state,
        allCommunities: null,
        resStatus: false,
        resMessage: ''
      }
    case CLEAR_UPDATE_COMMUNITY_RESPONSE:
      return {
        ...state,
        updateCommunity: null,
        resStatus: false,
        resMessage: ''
      }
    case CLEAR_GET_COMMUNITY_DETAILS_RESPONSE:
      return {
        ...state,
        communityDetails: null,
        resStatus: false,
        resMessage: ''
      }
    case CLEAR_GET_MY_COMMUNITIES_RESPONSE:
      return {
        ...state,
        myCommunities: null,
        resStatus: false,
        resMessage: ''
      }
    case CLEAR_CREATE_COMMUNITY_RESPONSE:
      return {
        ...state,
        createCommunity: null,
        resStatus: false,
        resMessage: ''
      }
    default:
      return state
  }
}
