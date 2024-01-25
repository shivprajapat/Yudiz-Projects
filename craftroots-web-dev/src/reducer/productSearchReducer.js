import { constants } from '@/actions/type'

const initialState = {
  searchActive: false,
  searchOverlayActive: false,
}

export const productSearchReducer = (state = initialState, action) => {
  switch (action.type) {
    case constants.SET_SEARCH_ACTIVE:
      return { ...state, searchActive: action.payload }
    case constants.SET_SEARCH_OVERLAY_ACTIVE:
      return { ...state, searchOverlayActive: action.payload }
    default:
      return state
  }
}
