import Axios from '../../axios'
import { addQueryParams } from 'helpers'

export function getProjectList(query) {
  return Axios.get(`/api/projects/v1?${addQueryParams(query)}`)
}

export function getProjectDetail(id) {
  return Axios.get(`/api/project/${id}/v1`)
}

export function getProjectTags(query) {
  return Axios.get(`api/projectTags/v1?${addQueryParams(query)}`)
}
export function getEmployeeDetail(data) {
  return Axios.put(`api/projectEmployee/v1`, data)
}

export function getBA(query = { page: 0, limit: 50 }) {
  return Axios.get(`api/getBaEmployee/v1?${addQueryParams(query)}`)
}

export function getBDE(query = {page: 0, limit: 50 }) {
  return Axios.get(`api/getBdeEmployee/v1?${addQueryParams(query)}`)
}

export function getPM(query = {page: 0, limit: 50}) {
  return Axios.get(`api/getPmEmployee/v1?${addQueryParams(query)}`)
}