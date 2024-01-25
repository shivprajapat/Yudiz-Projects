import Axios from '../../axios'

export async function updateMyProfile(data) {
    const response = await Axios.put('/api/user/profile/update/v1', data)
    return response
  }