import { addQueryParams } from 'helpers/helper'
import Axios from '../../axios'

export async function getInterviewList(query) {
  const response = await Axios.get(`/api/interviews/v1?${addQueryParams(query)}`)
  return response
}

export async function getSpecificInterview(id) {
  const response = await Axios.get(`/api/interview/${id}/v1`)
  return response
}

export async function TechnologyList() {
  const response = await Axios.get('/api/technologies/v1?page=0&limit=50')
  return response
}

export async function EmployeeList() {
  const response = await Axios.get('/api/employeeList/v1')
  return response
}

export async function ProjectList() {
  const response = await Axios.get('/api/projectList/v1')
  return response
}
