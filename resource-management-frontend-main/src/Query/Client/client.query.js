import { addQueryParams } from 'helpers'
import Axios from '../../axios'

export function getClientList(query = {}) {
  const response = Axios.get(`/api/clients/v1?${addQueryParams(query)}`)
  return response
}

export function getSpecificClient(id) {
  const response = Axios.get(`/api/client/${id}/v1`)
  return response
}

export function getSpecificClientProjects(id, query) {
  const response = Axios.get(`/api/client/${id}/projects?${addQueryParams(query)}`)
  return response
}
