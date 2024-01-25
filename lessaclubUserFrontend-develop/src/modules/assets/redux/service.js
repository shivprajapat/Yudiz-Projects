import axios from 'shared/libs/axios'
import { apiPaths } from 'shared/constants/apiPaths'
import {
  CLEAR_ASSET_DETAILS_RESPONSE,
  CLEAR_ASSET_UPLOAD_RESPONSE,
  CLEAR_CREATED_ASSET_DETAILS_RESPONSE,
  CLEAR_CREATE_ASSET_RESPONSE,
  CLEAR_CREATOR_ASSETS_RESPONSE,
  CLEAR_OWNED_ASSET_DETAILS_RESPONSE,
  CLEAR_TRENDING_NFTS_RESPONSE,
  GET_ASSET_DETAILS,
  GET_ASSET_UPLOAD,
  GET_ASSET_THUMBNAIL_UPLOAD,
  GET_CREATED_ASSET_DETAILS,
  GET_CREATE_ASSET,
  GET_CREATOR_ASSETS,
  GET_OWNED_ASSET_DETAILS,
  GET_TRENDING_NFTS,
  CLEAR_ASSET_THUMBNAIL_UPLOAD_RESPONSE,
  CLEAR_DELIST_FROM_RESALE_RESPONSE,
  SET_DELIST_FROM_RESALE_RESPONSE,
  CLEAR_ASSET_DETAILS_FOR_ADMIN_RESPONSE,
  GET_ASSET_DETAILS_FOR_ADMIN,
  CLEAR_GET_OWNED_ASSET_INDEX_SEARCH_RESPONSE,
  GET_OWNED_ASSET_INDEX_SEARCH,
  CLEAR_GET_ASSET_SHOW_RESPONSE,
  GET_ASSET_SHOW,
  CLEAR_THREED_ASSET_UPLOAD_RESPONSE,
  GET_THREED_ASSET_UPLOAD,
  CLEAR_ASSET_ON_SALE_DATA,
  GET_ASSET_ON_SALE_DATA,
  CLEAR_DELIST_AUCTION_FROM_RESALE_RESPONSE,
  SET_DELIST_AUCTION_FROM_RESALE_RESPONSE
} from './action'
import {
  CLEAR_ORDER_PAYMENT_RESPONSE,
  CLEAR_ORDER_CREATION_RESPONSE,
  CLEAR_ORDER_UPDATE_RESPONSE,
  CLEAR_PENDING_ORDER_RESPONSE
} from 'modules/checkout/redux/action'
import { setParamsForGetRequest } from 'shared/utils'
import { CLEAR_AUCTION_BIDS_RESPONSE } from 'modules/auction/redux/action'

const errMsg = 'Server is unavailable.'

export const createAsset = (payload, callback) => (dispatch) => {
  dispatch({ type: CLEAR_CREATE_ASSET_RESPONSE })
  axios
    .post(apiPaths.asset, payload)
    .then(({ data }) => {
      dispatch({
        type: GET_CREATE_ASSET,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true
        }
      })
      callback && callback()
    })
    .catch((error) => {
      dispatch({
        type: GET_CREATE_ASSET,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const uploadAsset = (payload) => (dispatch) => {
  dispatch({ type: CLEAR_ASSET_UPLOAD_RESPONSE })
  axios
    .post(apiPaths.assetUpload, payload)
    .then(({ data }) => {
      dispatch({
        type: GET_ASSET_UPLOAD,
        payload: {
          data: data.result,
          resMessage: '',
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: GET_ASSET_UPLOAD,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const uploadThreeDAsset = (payload) => async (dispatch) => {
  dispatch({ type: CLEAR_THREED_ASSET_UPLOAD_RESPONSE })
  try {
    const threeDPreviewResponse = await axios.post(apiPaths.assetUpload, payload.threeDPreview)
    const threeDOriginalResponse = await axios.post(apiPaths.assetUpload, payload.threeDOriginal)
    if (threeDPreviewResponse?.status === 200 && threeDOriginalResponse?.status === 200) {
      dispatch({
        type: GET_THREED_ASSET_UPLOAD,
        payload: {
          data: [
            { field: 'threeDPreview', file: threeDPreviewResponse?.data?.result },
            { field: 'threeDOriginal', file: threeDOriginalResponse?.data?.result }
          ],
          resMessage: '',
          resStatus: true
        }
      })
    }
  } catch (error) {
    dispatch({
      type: GET_THREED_ASSET_UPLOAD,
      payload: {
        resStatus: false,
        resMessage: error.response ? error.response.data.message : errMsg
      }
    })
  }
}

export const uploadThumbnailAsset = (payload) => (dispatch) => {
  dispatch({ type: CLEAR_ASSET_THUMBNAIL_UPLOAD_RESPONSE })
  axios
    .post(apiPaths.assetUpload, payload)
    .then(({ data }) => {
      dispatch({
        type: GET_ASSET_THUMBNAIL_UPLOAD,
        payload: {
          data: data.result,
          resMessage: '',
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: GET_ASSET_THUMBNAIL_UPLOAD,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const getAssetDetails = (id, payload) => (dispatch) => {
  dispatch({ type: CLEAR_ASSET_DETAILS_RESPONSE })
  dispatch({ type: CLEAR_ORDER_CREATION_RESPONSE })
  dispatch({ type: CLEAR_ORDER_UPDATE_RESPONSE })
  dispatch({ type: CLEAR_ORDER_PAYMENT_RESPONSE })
  dispatch({ type: CLEAR_PENDING_ORDER_RESPONSE })
  dispatch({ type: CLEAR_AUCTION_BIDS_RESPONSE })

  axios
    .get(`${apiPaths.assetOnSaleListing}/${id}${setParamsForGetRequest(payload)}`)
    .then(({ data }) => {
      dispatch({
        type: GET_ASSET_DETAILS,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: GET_ASSET_DETAILS,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const getAssetDetailsForAdmin = (id) => (dispatch) => {
  dispatch({ type: CLEAR_ASSET_DETAILS_FOR_ADMIN_RESPONSE })

  axios
    .get(`${apiPaths.assetListing}/${id}`)
    .then(({ data }) => {
      dispatch({
        type: GET_ASSET_DETAILS_FOR_ADMIN,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: GET_ASSET_DETAILS_FOR_ADMIN,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const getAssetShow = (id) => (dispatch) => {
  dispatch({ type: CLEAR_GET_ASSET_SHOW_RESPONSE })

  axios
    .get(`${apiPaths.assetListing}/${id}`)
    .then(({ data }) => {
      dispatch({
        type: GET_ASSET_SHOW,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: GET_ASSET_SHOW,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const getCreatorAssets = (payload) => (dispatch) => {
  dispatch({ type: CLEAR_CREATOR_ASSETS_RESPONSE })
  axios
    .get(`${apiPaths.assetOnSaleListing}${setParamsForGetRequest(payload)}`)
    .then(({ data }) => {
      dispatch({
        type: GET_CREATOR_ASSETS,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: GET_CREATOR_ASSETS,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const getOwnedAssetDetails = (id, payload) => (dispatch) => {
  dispatch({ type: CLEAR_OWNED_ASSET_DETAILS_RESPONSE })
  dispatch({ type: CLEAR_AUCTION_BIDS_RESPONSE })

  axios
    .get(`${apiPaths.ownedAssets}/${id}${setParamsForGetRequest(payload)}`)
    .then(({ data }) => {
      dispatch({
        type: GET_OWNED_ASSET_DETAILS,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: GET_OWNED_ASSET_DETAILS,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const getOwnedAssetIndexSearch = (payload) => (dispatch) => {
  dispatch({ type: CLEAR_GET_OWNED_ASSET_INDEX_SEARCH_RESPONSE })

  axios
    .get(`${apiPaths.ownedAssets}${setParamsForGetRequest(payload)}`)
    .then(({ data }) => {
      dispatch({
        type: GET_OWNED_ASSET_INDEX_SEARCH,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: GET_OWNED_ASSET_INDEX_SEARCH,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const getCreatedAssetDetails = (payload) => (dispatch) => {
  dispatch({ type: CLEAR_CREATED_ASSET_DETAILS_RESPONSE })
  dispatch({ type: CLEAR_AUCTION_BIDS_RESPONSE })

  axios
    .get(`${apiPaths.assetOnSaleCreatorShow}${setParamsForGetRequest(payload)}`)
    .then(({ data }) => {
      dispatch({
        type: GET_CREATED_ASSET_DETAILS,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: GET_CREATED_ASSET_DETAILS,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const getTrendingNfts = (payload) => (dispatch) => {
  dispatch({ type: CLEAR_TRENDING_NFTS_RESPONSE })
  axios
    .get(`${apiPaths.asset}${setParamsForGetRequest(payload)}`)
    .then(({ data }) => {
      dispatch({
        type: GET_TRENDING_NFTS,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: GET_TRENDING_NFTS,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const assetDelistFromResale = (payload) => (dispatch) => {
  dispatch({ type: CLEAR_DELIST_FROM_RESALE_RESPONSE })
  axios
    .post(apiPaths.assetDelistFromResale, payload)
    .then(({ data }) => {
      dispatch({
        type: SET_DELIST_FROM_RESALE_RESPONSE,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: SET_DELIST_FROM_RESALE_RESPONSE,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const auctionDelistFromResale = (payload) => (dispatch) => {
  dispatch({ type: CLEAR_DELIST_AUCTION_FROM_RESALE_RESPONSE })
  axios
    .post(apiPaths.auctionDelistFromResale, payload)
    .then(({ data }) => {
      console.log(data)
      dispatch({
        type: SET_DELIST_AUCTION_FROM_RESALE_RESPONSE,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: SET_DELIST_AUCTION_FROM_RESALE_RESPONSE,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const toggleAssetVisibility = (payload) => async (dispatch) => {
  return await axios.put(apiPaths.toggleAssetVisibility(payload.assetId), { isPrivate: !payload.isPrivate })
}

export const getPrivateAssetsData = (payload) => async (dispatch) => {
  return await axios.get(`${apiPaths.ownedAssets}${setParamsForGetRequest(payload)}`)
}

export const getAssetOnSale = (payload) => (dispatch) => {
  dispatch({ type: CLEAR_ASSET_ON_SALE_DATA })
  axios
    .get(`${apiPaths.assetOnSaleListing}${setParamsForGetRequest(payload)}`)
    .then(({ data }) => {
      dispatch({
        type: GET_ASSET_ON_SALE_DATA,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: GET_ASSET_ON_SALE_DATA,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const createAssetReview = async (payload) => {
  return await axios.post(apiPaths.assetReviewBase, payload)
}

export const updateAssetReview = async (payload, commentId) => {
  return await axios.put(`${apiPaths.assetReviewBase}/${commentId}`, payload)
}

export const deleteAssetReview = async (commentId, payload) => {
  try {
    const response = await axios.delete(`${apiPaths.assetReviewBase}/${commentId}`, { data: payload })
    if (response?.status === 200) {
      return response
    }
  } catch (error) {
    console.log('deleteAssetReview error', error)
  }
}

export const listAssetReview = async (id) => {
  try {
    const response = await axios.get(`${apiPaths.assetReviewBase}${setParamsForGetRequest({ assetId: id })}`)
    if (response?.status === 200) {
      return response
    }
  } catch (error) {
    console.log('listAssetReview error', error)
  }
}
