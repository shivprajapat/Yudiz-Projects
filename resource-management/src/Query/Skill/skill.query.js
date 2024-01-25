import { addQueryParams } from 'helpers/helper'
import Axios from '../../axios'

export async function getSkillList(query) {
  const response = await Axios.get(`/api/skills/v1?${addQueryParams(query)}`)
  return response
}
