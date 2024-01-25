import axios from '../axios'

// for clients only
export function getAPIStats() {
  const response = axios.get('/api/v1/client/get-api-stats')
  return response
}

export function getArticlesData({ nSkip, nLimit, sSearch, isLiveUpdate, dFetchStart, dFetchEnd }) {
  const response = axios.get(`/api/v1/client/articles-fetched?nSkip=${(nSkip - 1) * nLimit}&nLimit=${nLimit}&sSearch=${sSearch}&isLiveUpdate=${isLiveUpdate}&dFetchStart=${dFetchStart}&dFetchEnd=${dFetchEnd}`)
  return response
}

export function getCategoriesData({ nSkip, nLimit, sSearch, isLiveUpdate, dFetchStart, dFetchEnd }) {
  const response = axios.get(`/api/v1/client/category-articles-fetched?nSkip=${(nSkip - 1) * nLimit}&nLimit=${nLimit}&sSearch=${sSearch}&isLiveUpdate=${isLiveUpdate}&dFetchStart=${dFetchStart}&dFetchEnd=${dFetchEnd}`)
  return response
}

// for admin only
export function getAPIStatsOfClient(id) {
  const response = axios.get(`/api/v1/client/admin-get-api-stats/${id}`)
  return response
}

export function getArticlesDetailsOfClient({ nSkip, nLimit, sSearch, isLiveUpdate }, id) {
  const response = axios.get(`api/v1/client/admin-articles-fetched/${id}?nSkip=${(nSkip - 1) * nLimit}&nLimit=${nLimit}&sSearch=${sSearch}&isLiveUpdate=${isLiveUpdate}`)
  return response
}

export function getCategoriesDetailsOfClient({ nSkip, nLimit, sSearch, isLiveUpdate }, id) {
  const response = axios.get(`api/v1/client/admin-category-articles-fetched/${id}?nSkip=${(nSkip - 1) * nLimit}&nLimit=${nLimit}&sSearch=${sSearch}&isLiveUpdate=${isLiveUpdate}`)
  return response
}
