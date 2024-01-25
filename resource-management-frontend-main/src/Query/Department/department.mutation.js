import Axios from '../../axios'

export function addDepartment(data) {
  return Axios.post('/api/departments/v1', data)
}

export function deleteDepartment(id) {
  return Axios.delete(`/api/departments/${id}/v1`)
}

export function updateDepartment({ id, data }) {
  return Axios.put(`/api/departments/${id}/v1`, data)
}

