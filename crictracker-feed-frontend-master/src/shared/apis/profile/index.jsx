import axios from '../axios'

export function getClientProfile() {
  const response = axios.get('/api/v1/client')
  return response
}
export function updateClientProfile(data) {
  const response = axios.put('/api/v1/client/update-client', data)
  return response
}
