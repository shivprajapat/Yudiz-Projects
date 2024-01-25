import axios from 'axios'
import { parseParams } from 'shared/utils'

const baseURL = process.env.REACT_APP_API_URL
// const baseURL = process.env.REACT_APP_LOCAL_URL

const instance = axios.create({
  baseURL
})

const params = parseParams(window.location.search)

instance.interceptors.request.use(
  (req) => {
    req.method === 'get' && document.body.classList.add('global-loader')
    const token = localStorage.getItem('userToken')
    if (params.token) {
      req.headers.Authorization = params.token
    } else if (!req.url.includes('https') && token) {
      req.headers.Authorization = token
      return req
    }
    return req
  },
  (err) => {
    document.body.classList.remove('global-loader')
    return Promise.reject(err)
  }
)

instance.interceptors.response.use(
  (response) => {
    document.body.classList.remove('global-loader')
    return response
  },
  (error) => {
    document.body.classList.remove('global-loader')
    if ((error.response && error.response.status === 417) || error.response.status === 401) {
      localStorage.clear()
    }
    return Promise.reject(error)
  }
)

export default instance
