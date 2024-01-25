import { addQueryParams } from 'helpers/helper'
import Axios from '../../axios'

export async function jobProfileList() {
  const response = await Axios.get('/api/job-profile/v1?page=0&limit=11')
  return response
}
export async function departmentList(query) {
  const response = await Axios.get(`/api/departments/v1?${addQueryParams(query)}`)
  return response
}
export async function skillList() {
  const response = await Axios.get('/api/skills/v1')
  return response
}

export async function getSpecificEmployee(id) {
  const response = await Axios.get('/api/employee/EmployeeDetail/' + id)
  return response
}

export async function getEmployeeList(query) {
  const response = await Axios.get(`/api/employee/EmployeeDetails?${addQueryParams(query)}`)
  return response
}
