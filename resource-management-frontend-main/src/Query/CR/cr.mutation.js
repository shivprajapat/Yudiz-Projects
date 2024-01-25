import { addQueryParams } from 'helpers'
import Axios from '../../axios'

export function deleteCr(id) {
  return Axios.delete(`/api/cr/${id}/v1`)
}
export function updateCr({ id, ...data }) {
  data.id = id
  return Axios.put(`/api/cr/${id}/v1`, data)
}
export function addCr(data) {
  return Axios.post(`/api/cr/v1`, data)
}

export function getProjectEmployees({ aDepartmentIds, id, query }) {
  return Axios.post(`/api/projectEmployeeOfDepartment?${addQueryParams(query)}`, { aDepartmentIds, id })
}
