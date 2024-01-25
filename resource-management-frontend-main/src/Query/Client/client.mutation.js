import Axios from '../../axios'

export function deleteClient(id) {
  return Axios.delete(`/api/client/${id}/v1`)
}

export function addClient(data) {
  return Axios.post('/api/client/v1', data)
}

export function updateClient(data) {
  return Axios.put(`/api/client/${data.id}/v1`, data.clientData)
}
