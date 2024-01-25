import { addQueryParams } from 'helpers/helper'
import Axios from '../../axios'

export async function getClientList(query) {
  const response = await Axios.get(`/api/clients/v1?${addQueryParams(query)}`)
  return response
}

export async function getSpecificClient(id) {
  const response = await Axios.get(`/api/client/${id}/v1`)
  return response
}

export async function getSpecificClientProjects(id, query) {
  const response = await Axios.get(`/api/client/${id}/projects?${addQueryParams(query)}`)
  return response
}
