import { SHOW_TOAST } from './action'

export const toast = (state = {}, action = {}) => {
  switch (action.type) {
    case SHOW_TOAST:
      return {
        ...state,
        message: action.payload.message,
        type: action.payload.type,
        btnTxt: action.payload.btnTxt
      }

    default:
      return state
  }
}
