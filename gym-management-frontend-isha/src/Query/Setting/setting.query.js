import Axios from '../../axios'

export function getSetting() {
  return Axios.get(`/v1/setting/info`)
}