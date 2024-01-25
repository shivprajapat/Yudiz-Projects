import axios from 'axios'

const instance = axios.create({
  baseURL: `${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/api`
})

// eslint-disable-next-line dot-notation
instance.defaults.headers.common['Authorization'] = 'token'

export default instance
