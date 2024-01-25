import axios from '../../axios'

export async function getStatistics() {
  return await axios.get('/dashboard')
}
