import { ADD_COMMENT, CLEAR_ADD_COMMENT_RESPONSE, CLEAR_GET_COMMENTS_RESPONSE, DELETE_COMMENT, GET_COMMENTS } from './action'

export const comments = (state = {}, action = {}) => {
  switch (action.type) {
    case GET_COMMENTS:
      return {
        ...state,
        getComments: (() => {
          if (action.payload.parentId) {
            return {
              metaData: state.getComments.metaData,
              communityAssetComment: state?.getComments?.communityAssetComment?.map((item) => {
                if (item.id === action.payload.parentId) {
                  return {
                    ...item,
                    replies: (() => {
                      if (action.payload.data.metaData.currentPage === 1) {
                        return [...action.payload.data.communityAssetComment]
                      } else return [...item.replies, ...action.payload.data.communityAssetComment]
                    })()
                  }
                } else {
                  return item
                }
              })
            }
          } else if (state?.getComments?.communityAssetComment?.length > 0) {
            return {
              communityAssetComment: [...state.getComments.communityAssetComment, ...action.payload.data.communityAssetComment],
              metaData: action.payload.data.metaData
            }
          } else return action.payload.data
        })(),
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case ADD_COMMENT:
      return {
        ...state,
        addComment: action.payload.data,
        getComments: (() => {
          if (action.payload.resStatus) {
            if (action.payload.isReply) {
              return {
                communityAssetComment: state?.getComments?.communityAssetComment?.map((item) => {
                  if (item.id === action.payload.data.communityAssetComment.parentId) {
                    return {
                      ...item,
                      replies: [action.payload.data.communityAssetComment, ...item.replies]
                    }
                  } else {
                    return item
                  }
                })
              }
            } else if (state?.getComments?.communityAssetComment?.length > 0) {
              return {
                communityAssetComment: [action.payload.data.communityAssetComment, ...state.getComments.communityAssetComment],
                metaData: { ...state.getComments.metaData }
              }
            } else {
              return { communityAssetComment: [action.payload.data.communityAssetComment] }
            }
          }
        })(),
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        resError: action.payload.resError
      }
    case CLEAR_ADD_COMMENT_RESPONSE:
      return {
        ...state,
        addComment: null,
        resStatus: '',
        resMessage: '',
        resError: null,
        isReply: null
      }
    case CLEAR_GET_COMMENTS_RESPONSE:
      return {
        ...state,
        getComments: null,
        resStatus: '',
        resMessage: ''
      }
    case DELETE_COMMENT:
      return {
        ...state,
        getComments: (() => {
          if (action.payload.resStatus) {
            if (action.payload.isReply) {
              return {
                communityAssetComment: state?.getComments?.communityAssetComment?.map((item) => {
                  if (item.id === action.payload.parentId) {
                    return {
                      ...item,
                      replies: item.replies.filter(reply => reply.id !== action.payload.id)
                    }
                  } else {
                    return item
                  }
                })
              }
            } else {
              return {
                communityAssetComment: state?.getComments?.communityAssetComment?.filter(comment => comment.id !== action.payload.id),
                metaData: { ...state.getComments.metaData }
              }
            }
          }
        })(),
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        resError: action.payload.resError
      }
    default:
      return state
  }
}
