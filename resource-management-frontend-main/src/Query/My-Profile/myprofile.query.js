import { addQueryParams } from 'helpers'
import Axios from '../../axios'

export function getMyProfile() {
  return Axios.get('api/user/profile/v1')
}

export function getProfileProjects(query = {}) {
  return Axios.get(`api/user/profile/getUserProjects/v1?${addQueryParams(query)}`)
}
