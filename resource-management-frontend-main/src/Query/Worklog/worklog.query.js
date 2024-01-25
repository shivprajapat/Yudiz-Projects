import { addQueryParams } from 'helpers'
import Axios from '../../axios'

export function getWorklogList(query = {}) {
  return Axios.get(`/api/worklogs/v2?${addQueryParams(query)}`)
}
export function getWorklog(id) {
  return Axios.get(`/api/worklogs/${id}/v1`)
}
export function getLoggedInUserProjects(query = {}) {
  return Axios.get(`/api/employeeProjects?${addQueryParams(query)}`)
}
export function getWorklogTags(query = {}) {
  return Axios.get(`/api/worklogstags/v1?${addQueryParams(query)}`)
}
export function getWorklogCr(id, query = {}) {
  return Axios.get(`/api/projectcrs/${id}/v1?${addQueryParams(query)}`)
}
