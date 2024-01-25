import {
  CLEAR_CREATE_POST_RESPONSE,
  CLEAR_DELETE_POST_RESPONSE,
  CLEAR_GET_MY_POSTS_RESPONSE,
  CLEAR_GET_POSTS_RESPONSE,
  CLEAR_GET_POST_DETAILS_RESPONSE,
  CLEAR_UPDATE_POST_RESPONSE,
  CLEAR_UPLOAD_BLOG_CONTENT_RESPONSE,
  CREATE_POST,
  DELETE_POST,
  GET_MY_POSTS,
  GET_POSTS,
  GET_POST_DETAILS,
  UPDATE_POST,
  UPLOAD_BLOG_CONTENT
} from './action'

export const post = (state = {}, action = {}) => {
  switch (action.type) {
    case CREATE_POST:
      return {
        ...state,
        createPost: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        resError: action.payload.resError
      }
    case CLEAR_CREATE_POST_RESPONSE:
      return {
        createPost: null,
        resStatus: false,
        resMessage: '',
        resError: null
      }
    case UPLOAD_BLOG_CONTENT:
      return {
        ...state,
        uploadBlogContent: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case CLEAR_UPLOAD_BLOG_CONTENT_RESPONSE:
      return {
        uploadBlogContent: null,
        resStatus: false,
        resMessage: ''
      }
    case UPDATE_POST:
      return {
        ...state,
        updatePost: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        resError: action.payload.resError
      }
    case CLEAR_UPDATE_POST_RESPONSE:
      return {
        updatePost: null,
        resStatus: false,
        resMessage: '',
        resError: null
      }
    case GET_POSTS:
      return {
        ...state,
        posts: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case CLEAR_GET_POSTS_RESPONSE:
      return {
        posts: null,
        resStatus: false,
        resMessage: ''
      }
    case GET_MY_POSTS:
      return {
        ...state,
        myPosts: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case CLEAR_GET_MY_POSTS_RESPONSE:
      return {
        myPosts: null,
        resStatus: false,
        resMessage: ''
      }
    case GET_POST_DETAILS:
      return {
        ...state,
        postDetails: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case CLEAR_GET_POST_DETAILS_RESPONSE:
      return {
        postDetails: null,
        resStatus: false,
        resMessage: ''
      }
    case DELETE_POST:
      return {
        ...state,
        deletePost: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        resError: action.payload.resError
      }
    case CLEAR_DELETE_POST_RESPONSE:
      return {
        deletePost: null,
        resStatus: false,
        resMessage: '',
        resError: null
      }
    default:
      return state
  }
}
