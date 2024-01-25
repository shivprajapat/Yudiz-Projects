import {
  CLEAR_ERROR_MESSAGE,
  GET_USER_DATA_BEGIN,
  GET_USER_DATA_FAILURE,
  GET_USER_DATA_SUCCESS,
  LOGIN_BEGIN,
  LOGIN_FAILURE,
  LOGIN_SUCCESS,
  LOGOUT_BEGIN,
  LOGOUT_FAILURE,
  LOGOUT_SUCCESS
} from '../../actions/constants'

const userData = JSON.parse(localStorage.getItem('userData'))

// **  Initial State
const initialState = userData ? { loading: false, userData, viewUserData: {} } : { loading: false, userData: null }

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case CLEAR_ERROR_MESSAGE:
      return {
        ...state,
        error: null,
        loading: false
      }
    case LOGIN_BEGIN:
      return {
        ...state,
        loading: true
      }
    case LOGIN_SUCCESS:
      return {
        ...state,
        userData: action.payload,
        loading: false,
        error: null
      }
    case LOGIN_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      }

    case GET_USER_DATA_BEGIN:
      return {
        ...state,
        loading: true,
        viewUserData: null
      }
    case GET_USER_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        viewUserData: action?.payload,
        error: action.payload
      }
    case GET_USER_DATA_FAILURE:
      return {
        ...state,
        loading: false,
        error: action?.payload
      }
    case LOGOUT_BEGIN:
      return {
        ...state,
        loading: true
      }
    case LOGOUT_SUCCESS:
      return {
        ...state,
        userData: null,
        loading: false
      }
    case LOGOUT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action?.payload
      }
    default:
      return state
  }
}
