import { addQueryParams } from 'helpers'
import Axios from '../../axios'

export function getCrList(query = {}) {
  return Axios.get(`/api/cr/v1?${addQueryParams(query)}`)
}
export function getCrDetails(id) {
  return Axios.get(`/api/changerequest/${id}/v1`)
}
export function getProjectDepartments(id) {
  return Axios.get(`/api/projectDepartments?${addQueryParams({ id })}`)
}
