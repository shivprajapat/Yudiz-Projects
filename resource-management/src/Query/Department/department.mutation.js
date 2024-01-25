import { removeSpaces } from 'helpers/helper'
import Axios from '../../axios'

export async function deleteDepartment(id) {
  const response = await Axios.delete(`/api/departments/${id}/v1`)
  return response
}

export async function updateDepartment({ id, sName }) {
  const response = await Axios.patch(`/api/departments/${id}/v1`, { sName: removeSpaces(sName) })
  return response
}

export async function addDepartment(sName) {
  const response = await Axios.post('/api/departments/v1', { sName: removeSpaces(sName) })
  return response
}
