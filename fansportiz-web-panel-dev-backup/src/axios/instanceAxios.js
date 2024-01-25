import axios from 'axios'
import { store } from '../redux/store'
import packageJson from '../../package.json'
import config from '../config/config'

const instanceAxios = axios.create({
  baseURL: config.BASE_URL,
  headers: { Platform: 'W', app_version: packageJson.version }
})

instanceAxios.interceptors.request.use((req) => {
  const token = localStorage.getItem('Token')
  if (!req.headers.Authorization && token && !req.headers.noAuth) {
    req.headers.Authorization = token
    return req
  }
  return req
}, (err) => Promise.reject(err))

instanceAxios.interceptors.response.use((response) => response, (error) => {
  if (error.response && (error.response.status === 401)) {
    localStorage.removeItem('Token')
    store.dispatch({
      type: 'TOKEN_LOGIN',
      payload: {
        token: null
      }
    })
  }
  return Promise.reject(error)
})

export default instanceAxios
