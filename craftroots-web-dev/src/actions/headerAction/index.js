import { constants } from '../type'
import { fetchNavigationData, storeHeaderDetailsData } from '@/helper'

export const storeConfigAction = (payload) => {
  try {
    return {
      type: constants.SET_STORE_CONFIG_DATA,
      payload: {
        storeConfig: payload.storeConfig,
      },
    }
  } catch (error) {
    console.log(error)
    return error
  }
}
export const navigationDataAction =
  ({ rootCategoryId }) =>
    async (dispatch) => {
      try {
        const { navData } = await fetchNavigationData({ rootCategoryId })
        const storeHeaderDetails = await storeHeaderDetailsData()
        dispatch({
          type: constants.SET_NAVIGATION_DATA,
          payload: {
            navData,
            storeHeaderDetails,
          },
        })
      } catch (error) {
        console.error('navigationDataAction: ', error)
        return error
      }
    }
export const setPromotionBarData = (payload) => {
  try {
    if (payload) {
      return {
        type: constants.SET_PROMOTION_DATA,
        payload: payload,
      }
    }
  } catch (error) {
    return error
  }
}
