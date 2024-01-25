let isUserInteractionFired

/**
 * set user token NOTe: it will only work on client side
 * @params string
 */
export const setUserInteraction = (t) => {
  isUserInteractionFired = t
}
/**
 * Get current user token
 * @returns {string}
 */
export const getUserInteraction = () => {
  return isUserInteractionFired
}
