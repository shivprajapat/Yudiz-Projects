import axios from '../../axios'

export async function profile() {
  return await axios.get('/profile/view')
}

export async function UpdateProfile(profileData) {
  return await axios.put('/profile/update', profileData)
}
