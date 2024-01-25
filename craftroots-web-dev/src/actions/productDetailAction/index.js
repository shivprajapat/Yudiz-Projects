import { setToastDataAction } from '../toastAction'
import { constants } from '../type'
import { SOMETHING_WENT_WRONG } from '@/helper/constant'

function dispatchToast() {
  dispatch(
    setToastDataAction({
      show: true,
      message: SOMETHING_WENT_WRONG,
      error: true,
    })
  )
}
export const productDetailsAction = (payload) => async (dispatch) => {
  try {
    if (payload) {
      dispatch({
        type: constants.SET_PRODUCT_DETAILS_DATA,
        payload: payload,
      })
    }
  } catch (error) {
    console.log(error)
    return error
  }
}

export const productColorChangeAction = (payload) => async (dispatch) => {
  try {
    if (payload) {
      dispatch({
        type: constants.SET_PRODUCT_COLOR,
        payload: payload,
      })
    }
  } catch (error) {
    console.log(error)
    return error
  }
}
/* export const productSelectedImageAction = (payload) => async (dispatch) => {
  try {
    if (payload) {
      dispatch({
        type: constants.SET_SELECTED_IMAGE,
        payload: payload,
      })
    }
  } catch (error) {
    console.log(error)
    if (error) {
      ;<Toast title="Something went wrong" />
    }
    return error
  }
} */
export const productSelectedSizeAction = (payload) => async (dispatch) => {
  try {
    if (payload) {
      dispatch({
        type: constants.SET_SELECTED_SIZE,
        payload: payload,
      })
    }
  } catch (error) {
    console.log(error)
    if (error) {
      dispatchToast()
    }
    return error
  }
}
export const productVariantAction = (payload) => async (dispatch) => {
  try {
    if (payload) {
      dispatch({
        type: constants.SET_PRODUCT_VARIANT,
        payload: payload,
      })
    }
  } catch (error) {
    console.log(error)
    if (error) {
      dispatchToast()
    }
    return error
  }
}

export const relatedProductAction = (payload) => async (dispatch) => {
  try {
    if (payload) {
      dispatch({
        type: constants.SET_RELATED_PRODUCT,
        payload: payload,
      })
    }
  } catch (error) {
    console.log(error)
    if (error) {
      dispatchToast()
    }
    return error
  }
}

export const resetProductDetails = () => (dispatch) => {
  dispatch({
    type: constants.RESET_PRODUCT_DETAILS,
    payload: '',
  })
}
