import Axios from '../../axios'

export async function addProject(data) {
  const response = await Axios.post('/api/project/v1', data)
  return response
}

export async function updateProject(data) {
  const response = await Axios.put(`/api/project/${data.id}/v1`, data.empData)
  return response
}

export async function deleteProject(id) {
  const response = await Axios.delete(`/api/project/${id}/v1`)
  return response
}
