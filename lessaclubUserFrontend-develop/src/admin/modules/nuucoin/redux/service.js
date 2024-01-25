import axios from 'shared/libs/axios'
import { apiPaths } from 'shared/constants/apiPaths'

export const listNuuCoinsData = async () => {
  return await axios.get(`${apiPaths.nuuCoinModule}`)
}

export const createNuuCoinData = async (payload) => {
  return await axios.post(apiPaths.nuuCoinModule, payload)
}

export const updateNuuCoinData = async (payload, id) => {
  return await axios.put(`${apiPaths.nuuCoinModule}/${id}`, payload)
}
