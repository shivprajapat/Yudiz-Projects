import axios from 'shared/libs/axios'
import { apiPaths } from 'shared/constants/apiPaths'
import { setParamsForGetRequest } from 'shared/utils'

export const listApiUsersData = async (payload = {}) => {
  return await axios.get(`${apiPaths.apiUserBase}${setParamsForGetRequest(payload)}`)
}

export const createApiUserData = async (payload) => {
  return await axios.post(apiPaths.apiUserBase, payload)
}

export const getApiUserById = async (id) => {
  return await axios.get(`${apiPaths.apiUserBase}/${id}`)
}

export const updateApiUserData = async (payload, id) => {
  return await axios.put(`${apiPaths.apiUserBase}/${id}`, payload)
}

export const deleteApiUserData = async (id) => {
  return await axios.delete(`${apiPaths.apiUserBase}/${id}`)
}
