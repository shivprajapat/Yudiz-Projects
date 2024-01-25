import Axios from '../../axios'

export function deleteSkill(id) {
  return Axios.delete(`/api/skills/${id}/v1`)
}
export function updateSkill({ id, data }) {
  return Axios.put(`/api/skills/${id}/v1`, data)
}
export function addSkill(data) {
  return Axios.post(`/api/skills/v1`, data)
}
