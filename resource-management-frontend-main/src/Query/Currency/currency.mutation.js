import { removeSpaces } from 'helpers'
import Axios from '../../axios'

export function deleteSkill({ id }) {
  return Axios.delete(`/api/skills/${id}/v1`)
}
export function updateSkill({ id, sName }) {
  return Axios.put(`/api/skills/${id}/v1`, { sName: removeSpaces(sName) })
}
export function addSkill(sName) {
  return Axios.post(`/api/skills/v1`, { sName: removeSpaces(sName) })
}
