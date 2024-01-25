import { addQueryParams } from 'helpers/helper'
import Axios from '../../axios'

export async function getMyProfile() {
  const response = await Axios.get('api/user/profile/v1')
  return response
}

export async function getProfileProjects(query = {}) {
  const response = await Axios.get(`api/user/profile/getUserProjects/v1?${addQueryParams(query)}`)
  return response
}
