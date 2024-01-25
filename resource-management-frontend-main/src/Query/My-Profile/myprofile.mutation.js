import Axios from '../../axios'

export function updateMyProfile(data) {
  return Axios.put('/api/user/profile/update/v1', data)
}
