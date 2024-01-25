import { ADMIN_GET_BANNER, ADMIN_CLEAR_GET_BANNER } from './action'

export const bannerManagement = (state = {}, action = {}) => {
  switch (action.type) {
    case ADMIN_GET_BANNER:
      return {
        ...state,
        getBanners: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case ADMIN_CLEAR_GET_BANNER:
      return {
        ...state,
        getBanners: {},
        resStatus: false,
        resMessage: ''
      }

    default:
      return state
  }
}
