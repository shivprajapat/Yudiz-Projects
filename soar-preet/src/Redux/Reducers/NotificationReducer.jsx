import { SET_NOTIFICATION } from 'Redux/Actions/ActionTypes'

const initialState = {
  isNotification: false
}

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_NOTIFICATION:
      return {
        ...state,
        isNotification: action.payload
      }
    default:
      return state
  }
}

export default notificationReducer
