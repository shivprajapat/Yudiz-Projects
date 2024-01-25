import axios from '../../axios'

export async function getCategory() {
  return await axios.get(`/category/list`)
}
