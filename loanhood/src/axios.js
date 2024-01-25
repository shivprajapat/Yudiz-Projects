import axios from 'axios'

const baseURL = 'https://app.loanhood.com/api/v1'
// const baseURL = 'http://localhost:5001/api/v1'

const instance = axios.create({
  baseURL: baseURL
})

instance.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem('userToken')
    if (!req.url.includes('https') && token) {
      req.headers.Authorization = token
      return req
    }
    return req
  },
  (err) => {
    return Promise.reject(err)
  }
)

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if ((error.response && error.response.status === 417) || error.response.status === 401) {
      localStorage.clear()
    }
    return Promise.reject(error)
  }
)

export default instance
