import Axios from '../../axios'

export async function addEmployee(data) {
  return Axios.put('/v1/employee/add', data)
}

export async function updateEmployee({ id, newData }) {
  return Axios.patch(`/v1/employee/edit/${id}`, newData)
}

export function deleteEmployee(id) {
  return Axios.delete(`/v1/employee/delete/${id}`)
}