import Axios from '../../axios'

export async function deleteClient(id) {
  const response = await Axios.delete(`/api/client/${id}/v1`)
  return response
}

export async function addClient(data) {
  const response = await Axios.post('/api/client/v1', data)
  return response
}

export async function updateClient(data) {
  const response = await Axios.patch(`/api/client/${data.id}/v1`, data.clientData)
  return response
}