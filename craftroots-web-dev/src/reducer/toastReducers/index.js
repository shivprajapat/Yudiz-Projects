import { constants } from '@/actions/type'

const initialState = {
  show: false,
  message: '',
  error: false,
}

export const toast = (state = initialState, action) => {
  switch (action.type) {
    case constants.SET_TOAST_SHOW:
      return { ...state, show: action.payload }
    case constants.SET_TOAST_ERROR:
      return { ...state, error: action.payload }
    case constants.SET_TOAST_DATA:
      return {
        show: action.payload.show,
        error: action.payload.error || false,
        message: action.payload.message,
      }
    default:
      return state
  }
}
