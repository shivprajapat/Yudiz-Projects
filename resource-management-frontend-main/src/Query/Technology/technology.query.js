import { addQueryParams } from 'helpers'
import Axios from '../../axios'

export function getTechnologyList(query = {}) {
  return Axios.get(`/api/technologies/v1?${addQueryParams(query)}`)
}

export function getTechnologyByID(id) {
  return Axios.get(`/api/technologies/${id}/v1`)
}
