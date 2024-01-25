import axios from 'shared/libs/axios'
import { apiPaths } from 'shared/constants/apiPaths'
import { setParamsForGetRequest } from 'shared/utils'

export const listTransactionsData = async (payload) => {
  return await axios.get(`${apiPaths.getTransactionList}${setParamsForGetRequest(payload)}`)
}

export const getTransactionById = async (id) => {
  return await axios.get(`${apiPaths.getTransactionById(id)}`)
}
