import Axios from '../../axios'

export function getAllCurrencies() {
  return Axios.get(`/api/globcurrency/v1`)
}
