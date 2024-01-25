import axios from 'shared/libs/axios'
import { apiPaths } from 'shared/constants/apiPaths'
import { setParamsForGetRequest } from 'shared/utils'

export const listDonationsData = async (payload) => {
  return await axios.get(`${apiPaths.donatePurchaseCreate}${setParamsForGetRequest(payload)}`)
}

export const updateDonationsData = async (id, payload) => {
  return await axios.put(`${apiPaths.donationPayout}/${id}`, payload)
}
