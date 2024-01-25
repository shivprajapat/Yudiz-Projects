import axios from 'shared/libs/axios'
import { apiPaths } from 'shared/constants/apiPaths'
import { setParamsForGetRequest } from 'shared/utils'

export const listBannersData = async (payload) => {
  return await axios.get(`${apiPaths.adminBannerManagement}${setParamsForGetRequest(payload)}`)
}

export const createBannerData = async (payload) => {
  return await axios.post('/admin' + apiPaths.adminBannerManagement, payload)
}

export const getBannerById = async (id) => {
  return await axios.get(`${apiPaths.adminBannerManagement}/${id}`)
}

export const updateBannerData = async (payload, id) => {
  return await axios.put(`/admin${apiPaths.adminBannerManagement}/${id}`, payload)
}

export const deleteBannerData = async (id) => {
  return await axios.delete(`/admin${apiPaths.adminBannerManagement}/${id}`)
}
