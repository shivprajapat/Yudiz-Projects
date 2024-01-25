import {
  CLEAR_CREATE_ASSET_RESPONSE,
  GET_CREATE_ASSET,
  GET_ASSET_THUMBNAIL_UPLOAD,
  CLEAR_ASSET_THUMBNAIL_UPLOAD_RESPONSE,
  GET_ASSET_UPLOAD,
  CLEAR_ASSET_UPLOAD_RESPONSE,
  GET_ASSET_DETAILS,
  CLEAR_ASSET_DETAILS_RESPONSE,
  GET_CREATOR_ASSETS,
  CLEAR_CREATOR_ASSETS_RESPONSE,
  GET_OWNED_ASSET_DETAILS,
  CLEAR_OWNED_ASSET_DETAILS_RESPONSE,
  GET_OWNED_ASSET_INDEX_SEARCH,
  CLEAR_GET_OWNED_ASSET_INDEX_SEARCH_RESPONSE,
  GET_CREATED_ASSET_DETAILS,
  CLEAR_CREATED_ASSET_DETAILS_RESPONSE,
  GET_TRENDING_NFTS,
  CLEAR_TRENDING_NFTS_RESPONSE,
  SET_DELIST_FROM_RESALE_RESPONSE,
  CLEAR_DELIST_FROM_RESALE_RESPONSE,
  GET_ASSET_DETAILS_FOR_ADMIN,
  CLEAR_ASSET_DETAILS_FOR_ADMIN_RESPONSE,
  GET_ASSET_SHOW,
  CLEAR_GET_ASSET_SHOW_RESPONSE,
  GET_THREED_ASSET_UPLOAD,
  CLEAR_ASSET_ON_SALE_DATA,
  GET_ASSET_ON_SALE_DATA,
  CLEAR_DELIST_AUCTION_FROM_RESALE_RESPONSE,
  SET_DELIST_AUCTION_FROM_RESALE_RESPONSE
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
    case GET_THREED_ASSET_UPLOAD:
      return {
        ...state,
        threeDAssetUpload: action.payload,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case GET_ASSET_THUMBNAIL_UPLOAD:
      return {
        ...state,
        thumbnailUpload: action.payload.data,
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
    case GET_OWNED_ASSET_INDEX_SEARCH:
      return {
        ...state,
        ownedAssetSearchIndex: action.payload.data,
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
    case CLEAR_ASSET_THUMBNAIL_UPLOAD_RESPONSE:
      return {
        ...state,
        thumbnailUpload: null,
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
    case CLEAR_GET_OWNED_ASSET_INDEX_SEARCH_RESPONSE:
      return {
        ...state,
        ownedAssetIndexSearch: null,
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
    case GET_TRENDING_NFTS:
      return {
        ...state,
        trendingNfts: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case CLEAR_TRENDING_NFTS_RESPONSE:
      return {
        ...state,
        trendingNfts: null,
        resStatus: '',
        resMessage: ''
      }
    case CLEAR_DELIST_FROM_RESALE_RESPONSE:
      return {
        ...state,
        delistFromResale: null,
        resStatus: '',
        resMessage: ''
      }
    case SET_DELIST_FROM_RESALE_RESPONSE:
      return {
        ...state,
        delistFromResale: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case CLEAR_DELIST_AUCTION_FROM_RESALE_RESPONSE:
      return {
        ...state,
        delistAuctionFromResale: null,
        resStatus: '',
        resMessage: ''
      }
    case SET_DELIST_AUCTION_FROM_RESALE_RESPONSE:
      return {
        ...state,
        delistAuctionFromResale: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case GET_ASSET_DETAILS_FOR_ADMIN:
      return {
        ...state,
        assetDetailsForAdmin: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case CLEAR_ASSET_DETAILS_FOR_ADMIN_RESPONSE:
      return {
        ...state,
        assetDetailsForAdmin: {},
        resStatus: '',
        resMessage: ''
      }
    case GET_ASSET_SHOW:
      return {
        ...state,
        assetShow: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case CLEAR_GET_ASSET_SHOW_RESPONSE:
      return {
        ...state,
        assetShow: {},
        resStatus: '',
        resMessage: ''
      }
    case GET_ASSET_ON_SALE_DATA:
      return {
        ...state,
        assetOnSale: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case CLEAR_ASSET_ON_SALE_DATA:
      return {
        ...state,
        assetOnSale: {},
        resStatus: '',
        resMessage: ''
      }
    default:
      return state
  }
}
