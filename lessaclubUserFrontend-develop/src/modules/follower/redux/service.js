import { getAllCommunities, getPopularCommunities } from 'modules/communities/redux/service'
import { SHOW_TOAST } from 'modules/toast/redux/action'
import { TOAST_TYPE } from 'shared/constants'
import { apiPaths } from 'shared/constants/apiPaths'
import axios from 'shared/libs/axios'
import { setParamsForGetRequest } from 'shared/utils'
import {
  CLEAR_FOLLOW_COMMUNITY_RESPONSE,
  CLEAR_GET_COMMUNITY_FOLLOWER_RESPONSE,
  CLEAR_GET_FOLLOWED_COMMUNITY_RESPONSE,
  CLEAR_UN_FOLLOW_COMMUNITY_RESPONSE,
  FOLLOW_COMMUNITY,
  GET_COMMUNITY_FOLLOWER,
  GET_FOLLOWED_COMMUNITY,
  UN_FOLLOW_COMMUNITY
} from './action'

const errMsg = 'Server is unavailable.'

export const getCommunityFollower = (payload) => (dispatch) => {
  dispatch({ type: CLEAR_GET_COMMUNITY_FOLLOWER_RESPONSE })
  axios
    .get(`${apiPaths.communityFollowers}${setParamsForGetRequest(payload)}`)
    .then(({ data }) => {
      dispatch({
        type: GET_COMMUNITY_FOLLOWER,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: GET_COMMUNITY_FOLLOWER,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const getFollowedCommunity = (payload) => (dispatch) => {
  dispatch({ type: CLEAR_GET_FOLLOWED_COMMUNITY_RESPONSE })
  axios
    .get(`${apiPaths.communityFollowers}${setParamsForGetRequest(payload)}`)
    .then(({ data }) => {
      dispatch({
        type: GET_FOLLOWED_COMMUNITY,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: GET_FOLLOWED_COMMUNITY,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const followCommunity = (payload, isDetailPage) => (dispatch) => {
  dispatch({ type: CLEAR_FOLLOW_COMMUNITY_RESPONSE })
  axios
    .post(apiPaths.communityFollowers, payload)
    .then(({ data }) => {
      dispatch({
        type: FOLLOW_COMMUNITY,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true
        }
      })
      if (isDetailPage) {
        dispatch(getPopularCommunities({ page: 1, perPage: 5, sortColumn: 'followerCount', sortOrder: -1 }))
        dispatch(getAllCommunities({ page: 1, perPage: 5 }))
      }

      dispatch({
        type: SHOW_TOAST,
        payload: {
          message: data.message,
          type: TOAST_TYPE.Success
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: FOLLOW_COMMUNITY,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const unFollowCommunity = (id, isDetailPage) => (dispatch) => {
  dispatch({ type: CLEAR_UN_FOLLOW_COMMUNITY_RESPONSE })
  axios
    .delete(apiPaths.communityFollowers + '/' + id)
    .then(({ data }) => {
      dispatch({
        type: UN_FOLLOW_COMMUNITY,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true
        }
      })
      if (isDetailPage) {
        dispatch(getPopularCommunities({ page: 1, perPage: 5, sortColumn: 'followerCount', sortOrder: -1 }))
        dispatch(getAllCommunities({ page: 1, perPage: 5 }))
      }
      dispatch({
        type: SHOW_TOAST,
        payload: {
          message: data.message,
          type: TOAST_TYPE.Success
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: UN_FOLLOW_COMMUNITY,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}
