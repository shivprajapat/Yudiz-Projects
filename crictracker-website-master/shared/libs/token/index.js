import { getCookie, setCookie } from '@shared/utils'

let token = null

/**
 * set user token NOTe: it will only work on client side
 * @params string
 */
export const setToken = (t) => {
  token = t
  setCookie({
    cName: 'token',
    cValue: t,
    exDays: 1
  })
}
/**
 * Get current user token
 * @returns {string}
 */
export const getToken = () => {
  const t = getCookie('token')
  return t || token
}
