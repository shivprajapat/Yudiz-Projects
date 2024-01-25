import axios from '../axios'

export function sendQuery(data) {
  const response = axios.post('/api/v1/contact-us/raise-query', data)
  return response
}
export function getQueryList({ nSkip, nLimit, sSearch, dFetchStart, dFetchEnd }) {
  const response = axios.get(`/api/v1/contact-us/query-list?nSkip=${(nSkip - 1) * nLimit}&nLimit=${nLimit}&sSearch=${sSearch}&dFetchStart=${dFetchStart}&dFetchEnd=${dFetchEnd}`)
  return response
}
