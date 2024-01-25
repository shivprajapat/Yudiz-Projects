import { getCookie, setCookie } from '@shared/utils'

let headerMenu
let footerMenu
let headerSidebarMenu
let isPreviewMode = false
let currentUser
let token

export const setHeaderMenu = (data) => {
  headerMenu = data
}

export const getHeaderMenu = () => headerMenu

export const setFooterMenu = (data) => {
  footerMenu = data
}

export const getFooterMenu = () => footerMenu

export const setHeaderSidebarMenu = (data) => {
  headerSidebarMenu = data
}

export const getHeaderSidebarMenu = () => headerSidebarMenu

export const setPreviewMode = (data) => {
  isPreviewMode = data
}

export const getPreviewMode = () => isPreviewMode
/**
 * set logged in user detail
 * @params {Object}
 */
export const setCurrentUser = (data) => {
  currentUser = data
}
/**
 * get logged in user detail
 * @returns {Object}
 */
export const getCurrentUser = () => currentUser
/**
 * set use token NOT it will only work on client side
 * @params string
 */
export const setToken = (t) => {
  token = t
  setCookie('token', t, 1)
}
/**
 * Get current user token
 * @returns {string}
 */
export const getToken = () => {
  const t = getCookie('token')
  return t || token
}
