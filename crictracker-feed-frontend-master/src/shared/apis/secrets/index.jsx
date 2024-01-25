import axios from '../axios'

export function getSecretsDetail() {
  const response = axios.put('/api/v1/client/regenerate-token')
  return response
}
