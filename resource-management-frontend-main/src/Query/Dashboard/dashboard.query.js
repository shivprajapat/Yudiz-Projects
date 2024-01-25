import { addQueryParams } from 'helpers'
import Axios from '../../axios'

export function getDashboard() {
  return Axios.get(`/api/dashboard/v1`)
}
export function getFreeResource(query) {
  return Axios.get(`/api/dashboard/employeeWithProjectNotCompletedOrCancelled/v1?${addQueryParams(query)}`)
}
export function getLatestProjects(query) {
  return Axios.get(`/api/dashboard/latestProjects/v1?${addQueryParams(query)}`)
}
export function getMonthlyProjects(query) {
  return Axios.get(`/api/dashboard/monthlyProjects/v1?${addQueryParams(query)}`)
}
export function getYear() {
  return Axios.get(`api/dashboardProjectYears/v1`)
}
export function getProjectDashboard(query) {
  return Axios.get(`/api/indicator/project/v1?${addQueryParams(query)}`)
}
export function getDeadlineProject(query) {
  return Axios.get(`/api/dashboard/projectLine/v1?${addQueryParams(query)}`)
}
