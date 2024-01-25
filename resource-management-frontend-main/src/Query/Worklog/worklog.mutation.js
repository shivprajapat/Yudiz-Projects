import Axios from '../../axios'

export function deleteWorklog(id) {
  return Axios.delete(`/api/worklogs/${id}/v2`)
}
export function updateWorklog({ id, ...data }) {
  return Axios.put(`/api/worklogs/${id}/v2`, data)
}
export function addWorklog(data) {
  return Axios.post(`/api/worklogs/v2`, data)
}
