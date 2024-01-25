import Axios from '../../axios'
import { addQueryParams } from 'helpers/helper'

export async function getProjectList(query) {
  const response = await Axios.get(`/api/projects/v1?${addQueryParams(query)}`)
  return response
}
