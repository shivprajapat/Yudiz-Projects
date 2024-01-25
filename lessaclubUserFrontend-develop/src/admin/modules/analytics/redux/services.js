import axios from 'shared/libs/axios'
import { apiPaths } from 'shared/constants/apiPaths'
import { setParamsForGetRequest } from 'shared/utils'

export const getNumberOfAssetAnalyticsData = async (payload) => {
  return await axios.get(`${apiPaths.getNumberOfAssetAnalyticsData}${setParamsForGetRequest(payload)}`)
}

export const getNumberOfOrderAnalyticsData = async (payload) => {
  return await axios.get(`${apiPaths.getNumberOfOrderAnalyticsData}${setParamsForGetRequest(payload)}`)
}

export const getAmountOfOrderAnalyticsData = async (payload) => {
  return await axios.get(`${apiPaths.getAmountOfOrderAnalyticsData}${setParamsForGetRequest(payload)}`)
}

export const getAmountOfAssetsAnalyticsData = async (payload) => {
  return await axios.get(`${apiPaths.getAmountOfAssetsAnalyticsData}${setParamsForGetRequest(payload)}`)
}

export const getNumberOfUsersAnalyticsData = async (payload) => {
  return await axios.get(`${apiPaths.getNumberOfUsersAnalyticsData}${setParamsForGetRequest(payload)}`)
}
