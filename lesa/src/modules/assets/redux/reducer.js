import {
  CLEAR_CREATE_ASSET_RESPONSE,
  GET_CREATE_ASSET,
  GET_ASSET_UPLOAD,
  CLEAR_ASSET_UPLOAD_RESPONSE,
  GET_ASSET_DETAILS,
  CLEAR_ASSET_DETAILS_RESPONSE,
  GET_CREATOR_ASSETS,
  CLEAR_CREATOR_ASSETS_RESPONSE,
  GET_OWNED_ASSET_DETAILS,
  CLEAR_OWNED_ASSET_DETAILS_RESPONSE,
  GET_CREATED_ASSET_DETAILS,
  CLEAR_CREATED_ASSET_DETAILS_RESPONSE
} from './action'

export const asset = (state = {}, action = {}) => {
  switch (action.type) {
    case GET_CREATE_ASSET:
      return {
        ...state,
        assetCreate: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case GET_ASSET_UPLOAD:
      return {
        ...state,
        assetUpload: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case GET_CREATOR_ASSETS:
      return {
        ...state,
        creatorAssets: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case GET_OWNED_ASSET_DETAILS:
      return {
        ...state,
        ownedAssetDetails: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case GET_ASSET_DETAILS:
      return {
        ...state,
        assetDetails: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case GET_CREATED_ASSET_DETAILS:
      return {
        ...state,
        createdAssetDetails: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case CLEAR_CREATED_ASSET_DETAILS_RESPONSE:
      return {
        ...state,
        createdAssetDetails: null,
        resStatus: '',
        resMessage: ''
      }
    case CLEAR_ASSET_UPLOAD_RESPONSE:
      return {
        ...state,
        assetUpload: null,
        resStatus: '',
        resMessage: ''
      }
    case CLEAR_OWNED_ASSET_DETAILS_RESPONSE:
      return {
        ...state,
        ownedAssetDetails: null,
        resStatus: '',
        resMessage: ''
      }
    case CLEAR_CREATOR_ASSETS_RESPONSE:
      return {
        ...state,
        creatorAssets: null,
        resStatus: '',
        resMessage: ''
      }
    case CLEAR_ASSET_DETAILS_RESPONSE:
      return {
        ...state,
        assetDetails: null,
        resStatus: '',
        resMessage: ''
      }
    case CLEAR_CREATE_ASSET_RESPONSE:
      return {
        resStatus: false,
        resMessage: ''
      }
    default:
      return state
  }
}
