import { addQueryParams } from 'helpers'
import Axios from '../../axios'

export function getInterviewList(query) {
  return Axios.get(`/api/interviews/v1?${addQueryParams(query)}`)
}

export function getSpecificInterview(id) {
  return Axios.get(`/api/interview/${id}/v1`)
}

export function TechnologyList(query) {
  return Axios.get(`/api/technologies/v1?${addQueryParams(query)}`)
}

export function EmployeeList() {
  return Axios.get('/api/employeeList/v1')
}

export function ProjectList() {
  return Axios.get('/api/projectList/v1')
}
