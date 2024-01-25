/* eslint-disable no-undef */
import axios from 'axios'
import { removeToken } from 'helpers/helper'

export function setUrl(url = process.env.REACT_APP_BASE_URL) {
  if (process.env.NODE_ENV === 'development') return url
  else return process.env.REACT_APP_BASE_URL
}

const Axios = axios.create({
  // baseURL: "https://4849e03c3629bf.lhrtunnel.link",
  baseURL: process.env.REACT_APP_BASE_URL,
})

Axios.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token')
    if (!req.headers.Authorization && token) {
      req.headers.Authorization = token
      return req
    }
    return req
  },
  (err) => {
    return Promise.reject(err)
  }
)
Axios.interceptors.response.use(
  (res) => {
    return res
  },
  (err) => {
    if ((err?.response && err?.response?.status === 417) || err?.response?.status === 401) {
      removeToken()
      navigationTo({ to: '/login', replace: true })
    }
    return Promise.reject(err)
  }
)

export default Axios
