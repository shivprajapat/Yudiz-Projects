/* eslint-disable no-undef */
import axios from 'axios'
import { navigationTo, removeToken, toaster } from 'helpers'

export function setUrl(url = process.env.REACT_APP_BASE_URL, options = { prod: false, isDev: false }) {
  if (options?.isDev) return process.env.REACT_APP_DEV_URL
  if (options?.prod) return process.env.REACT_APP_BASE_URL
  if (process.env.NODE_ENV === 'development') return url
  return process.env.REACT_APP_BASE_URL
}
const Axios = axios.create({
  // just set prod to true for using production server
  // https://resource-management-backend-pranav.vercel.app
  // http://192.168.13.46:4000
  // http://65.2.95.208:3005
  // http://rmp-back.webdevprojects.cloud
  baseURL: setUrl('http://rmp-back.webdevprojects.cloud', { prod: false, isDev: false }),
})

Axios.interceptors.request.use(
  (req) => {
    // const token = localStorage.getItem('token') || sessionStorage.getItem('token')
    const token = localStorage.getItem('token')
    if (!req.headers.Authorization && token) {
      req.headers.Authorization = token
      return req
    }
    return req
  },
  (err) => Promise.reject(err)
)
Axios.interceptors.response.use(
  (res) => res,
  (err) => {
    if ((err?.response && err?.response?.status === 417) || err?.response?.status === 401) {
      const token = localStorage.getItem('token')
      removeToken(token)
      // toaster('your session has expired, please login again')
      navigationTo({ to: '/login', replace: true })
      return Promise.reject(err)
    }
    if (err?.response?.status === 412) {
      toaster(`You don't have permission for particular action. Contact to Admin`)
      navigationTo({ to: '/', replace: true })
      return Promise.reject(err)
    }
    return Promise.reject(err)
  }
)

export default Axios
