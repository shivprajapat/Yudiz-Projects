import { addQueryParams } from 'helpers'
import Axios from '../../axios'

export function getSkillList(query) {
  return Axios.get(`/api/skills/v1?${addQueryParams(query)}`)
}

export function getSkillById(id) {
  return Axios.get(`api/skills/${id}/v1`)
}
