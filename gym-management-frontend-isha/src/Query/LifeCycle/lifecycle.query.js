// import { addQueryParams } from 'helpers'
import Axios from '../../axios'

// export function getLifeCycleList(query) {
//   return Axios.get(`/v1/lifecycle/list/all?${addQueryParams(query)}`)
// }
export function getSpecificLifeCycle(id) {
  return Axios.get(`/v1/lifecycle/get?iCustomerId=${id}`)
}