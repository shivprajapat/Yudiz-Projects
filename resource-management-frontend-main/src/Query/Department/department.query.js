import { addQueryParams } from 'helpers'
import Axios from '../../axios'

export function getDepartmentList(query) {
  return Axios.get(`/api/departments/v1?${addQueryParams(query)}`)
}

export function getEmployeeData(query) {
  return Axios.get(`/api/employee/employeeDetails/v1?${addQueryParams(query)}`)
}

export function getDepartmentSummery(id) {
  return Axios.get(`api/department/summery/${id}/v1`)
}

export function getDepartmentSummeryEmployee(id, query) {
  return Axios.get(`/api/department/summery/employee/${id}?${addQueryParams(query)}`)
}