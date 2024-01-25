import axios from 'shared/libs/axios'
import { apiPaths } from 'shared/constants/apiPaths'

export const createCustomerSupport = async (payload) => {
  try {
    const response = await axios.post(`${apiPaths.createCustomerSupport}`, payload)
    if (response?.status === 200) {
      return response
    }
  } catch (error) {
    console.log('createCustomerSupport error', error)
  }
}
