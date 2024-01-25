import Axios from 'shared/apis/axios'

export function getCategoriesForSubscription() {
  const response = Axios.get(`/api/v1/categories/list-for-subscription?nSkip=${0}&nLimit=${50}&sSearch=`)
  return response
}
export function getCategoriesById(data) {
  const response = Axios.post('/api/v1/categories/categories-list', data)
  return response
}
