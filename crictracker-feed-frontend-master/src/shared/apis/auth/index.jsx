import axios from '../axios'

export function login(data, path) {
  if (path === '/admin') {
    const response = axios.post('/api/v1/admin/login', data)
    return response
  } else if (path === '/') {
    const response = axios.post('/api/v1/client/login', data)
    return response
  }
}
export function logout(role) {
  if (role === 'admin') {
    const response = axios.post('/api/v1/admin/logout')
    return response
  } else if (role === 'client') {
    const response = axios.post('/api/v1/client/logout')
    return response
  }
}

export function changePassword(data) {
  const response = axios.post('/api/v1/client/change-password', data)
  return response
}

export function forgotPassword(data) {
  const response = axios.post('/api/v1/client/forgot-password', data)
  return response
}

export function resetPassword(data) {
  const response = axios.post('/api/v1/client/reset-password', data)
  return response
}
