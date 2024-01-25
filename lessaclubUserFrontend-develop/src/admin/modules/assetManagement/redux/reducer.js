import { ADMIN_BLOCK_UNBLOCK_ASSET, ADMIN_CLEAR_BLOCK_UNBLOCK_ASSET, ADMIN_CLEAR_GET_ASSETS, ADMIN_GET_ASSETS } from './action'

export const adminAssetManagement = (state = {}, action = {}) => {
  switch (action.type) {
    case ADMIN_GET_ASSETS:
      return {
        ...state,
        getAdminAssets: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case ADMIN_CLEAR_GET_ASSETS:
      return {
        ...state,
        getAdminAssets: {},
        resStatus: false,
        resMessage: ''
      }
    case ADMIN_BLOCK_UNBLOCK_ASSET:
      return {
        ...state,
        asset: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case ADMIN_CLEAR_BLOCK_UNBLOCK_ASSET:
      return {
        ...state,
        asset: {},
        resStatus: false,
        resMessage: ''
      }

    default:
      return state
  }
}
