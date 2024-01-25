import { constants } from '@/actions/type'

const initialState = {
  data: {},
  loading: true,

  promotion: {
    data: {},
  },
}

export const storeReducer = (state = initialState, action) => {
  switch (action.type) {
    case constants.SET_STORE_CONFIG_DATA:
    case constants.SET_NAVIGATION_DATA:
      return {
        ...state,
        data: { ...action.payload, ...state.data },
        loading: false,
      }

    case constants.SET_PROMOTION_DATA:
      return {
        ...state,
        promotion: {
          ...state.promotion,
          data: action.payload,
        },
      }
    default:
      return state
  }
}
