import axios from '../axios'

export function getClientDetails(id) {
  const response = axios.get(`/api/v1/client/details/${id}`)
  return response
}
export function addClientData(data) {
  const response = axios.post('/api/v1/client', data)
  return response
}

export function updateClientData(data, id) {
  const response = axios.put(`/api/v1/client/details/${id}`, data)
  return response
}

export function updateClientStatus(data, id) {
  const response = axios.put(`/api/v1/client/status/${id}`, data)
  return response
}

export function getClientList({ nSkip, nLimit, sSearch }) {
  const response = axios.get(`/api/v1/client/list?nSkip=${(nSkip - 1) * nLimit}&nLimit=${nLimit}&sSearch=${sSearch}`)
  return response
}
