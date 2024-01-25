import { SET_LOGIN_STATUS } from 'Redux/Actions/ActionTypes'

const initialState = {
  isUserLoggedIn: false
}

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LOGIN_STATUS:
      return {
        ...state,
        isUserLoggedIn: action.payload
      }
    default:
      return state
  }
}

export default authReducer
