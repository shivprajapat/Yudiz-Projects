import { constants } from '../type'

export const showToastAction = (payload) => async (dispatch) => {
  try {
    dispatch({
      type: constants.SET_TOAST_SHOW,
      payload,
    })
  } catch (error) {
    console.log(error)
    return error
  }
}
export const setToastErrorAction = (payload) => async (dispatch) => {
  try {
    dispatch({
      type: constants.SET_TOAST_ERROR,
      payload,
    })
  } catch (error) {
    console.log(error)
    return error
  }
}

/**
 *
 * @param {object} payload
 * @param {boolean} payload.show
 * @param {boolean} payload.error Enables error type design
 * @param {string} payload.message Toast message
 * @returns
 */
export const setToastDataAction = (payload) => async (dispatch) => {
  try {
    dispatch({
      type: constants.SET_TOAST_DATA,
      payload,
    })
  } catch (error) {
    console.log(error)
    return error
  }
}
