import { constants } from './type'

export const setSearchActive = (payload) => async (dispatch) => {
  try {
    dispatch({
      type: constants.SET_SEARCH_ACTIVE,
      payload: payload,
    })
  } catch (error) {
    console.log(error)
    return error
  }
}
export const setSearchOverlayActive = (payload) => async (dispatch) => {
  try {
    dispatch({
      type: constants.SET_SEARCH_OVERLAY_ACTIVE,
      payload: payload,
    })
  } catch (error) {
    console.log(error)
    return error
  }
}
