import axios from 'axios'

import { URL_PREFIX } from 'shared/constants'
import { redirectPage } from 'shared/utils'
import { allRoutes } from 'shared/constants/AllRoutes'
import { clearLocalStorage, getFromLocalStorage } from 'shared/helper/localStorage'

const Axios = axios.create({
  baseURL: URL_PREFIX
})

Axios.interceptors.request.use(function(config) {
  const token = getFromLocalStorage('token')
  if (!config.headers.Authorization && token) {
    config.headers.Authorization = token
    return config
  }
  return config
}, function(error) {
  return error.response
})

Axios.interceptors.response.use(function(response) {
  return response.data
}, function(error) {
  if (error?.response?.status === 401) {
    clearLocalStorage();
    (error.config.url === '/api/v1/client/login') ? redirectPage(allRoutes.login) : redirectPage(allRoutes.admin)
  }
  return error.response?.data
})

export default Axios
