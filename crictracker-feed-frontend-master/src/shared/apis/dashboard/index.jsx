import axios from '../axios'

export function getSubscriptionDetail() {
  const response = axios.get('/api/v1/subscription/active')
  return response
}
