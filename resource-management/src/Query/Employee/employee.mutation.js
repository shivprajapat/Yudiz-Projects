  import Axios from '../../axios'

export async function addEmployee(data) {
  const response = await Axios.post('/api/employee/CreateEmployee', data)
  return response
}

export async function updateEmployee(data) {
  const response = await Axios.put('/api/employee/EmployeeUpdate/' + data.id, data.empData)
  return response
}
export async function deleteEmployee(id) {
  const response = await Axios.delete('/api/employee/EmployeeDelete/' + id)
  return response
}
