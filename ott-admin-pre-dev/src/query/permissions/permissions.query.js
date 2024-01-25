import axios from '../../axios'

export async function getUserPermission() {
  return await axios.get(`/profile/permission`)
}
