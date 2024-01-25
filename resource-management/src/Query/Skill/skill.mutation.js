import { removeSpaces } from 'helpers/helper'
import Axios from '../../axios'

export async function deleteSkill({ id }) {
  const response = await Axios.delete(`/api/skills/${id}/v1`)
  return response
}
export async function updateSkill({ id, sName }) {
  const response = await Axios.patch(`/api/skills/${id}/v1`, { sName: removeSpaces(sName) })
  return response
}
export async function addSkill(sName) {
  const response = await Axios.post(`/api/skills/v1`, { sName: removeSpaces(sName) })
  return response
}
