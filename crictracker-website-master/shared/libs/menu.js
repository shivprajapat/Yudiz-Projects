let headerMenu
let footerMenu
let headerSidebarMenu
let isPreviewMode = false
let currentUser
let deviceInfo = {}

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

/** Get device info using
 * @returns Object User device detail
 * @developer Kuldip Dobariya
 */

export const getDeviceInfo = () => {
  return deviceInfo
}

/** set device info for global use
 * @params object
 * @developer Kuldip Dobariya
 */

export const setDeviceInfo = (data) => {
  deviceInfo = data
}
