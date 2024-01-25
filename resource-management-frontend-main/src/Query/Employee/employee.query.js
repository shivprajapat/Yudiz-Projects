import { addQueryParams } from 'helpers'
import Axios from '../../axios'

export function jobProfileList(query = { page: 0, limit: 50 }) {
  return Axios.get(`/api/job-profile/v1?${addQueryParams(query)}`)
}
export function departmentList(query = { page: 0, limit: 50 }) {
  return Axios.get(`/api/departments/v1?${addQueryParams(query)}`)
}
export function skillList(query = { page: 0, limit: 50 }) {
  return Axios.get(`/api/skills/v1?${addQueryParams(query)}`)
}
export function roleList(query = { page: 0, limit: 50 }) {
  return Axios.get(`/api/role/v1?${addQueryParams(query)}`)
}
export function getSpecificEmployee(id) {
  return Axios.get('/api/employee/EmployeeDetail/' + id)
}
export function orgBranchList(query = { page: 0, limit: 50 }) {
  return Axios.get(`/api/orgbranch/v1?${addQueryParams(query)}`)
}

export function getEmployeeList(query) {
  return Axios.get(`/api/employee/employeeDetails/v1?${addQueryParams(query, { except: [''] })}`)
}
export function permissionList(query = { page: 0, limit: 50 }) {
  return Axios.get(`/api/permission/v1?${addQueryParams(query)}`)
}

export function getProjectsOfEmployee(id, query = { page: 0, limit: 50 }) {
  return Axios.get(`/api/project/${id}/employees/v1?${addQueryParams(query)}`)
}

export function getReviewsOfEmployee(id, query = { page: 0, limit: 50 }){
  return Axios.get(`/api/review/${id}/employees/v1?${addQueryParams(query)}`)
}

export function getEmployeeSpecificCurrency(query) {
  return Axios.get(`/api/employeeCurrency/v1?${addQueryParams(query)}`)
} 