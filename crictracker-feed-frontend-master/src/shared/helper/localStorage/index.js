export function storeInLocalStorage(key, value) {
  localStorage.setItem(key, value)
}
export function getFromLocalStorage(key, value) {
  return localStorage.getItem(key, value)
}
export function removeKeyFromLocalStorage(key) {
  localStorage.removeItem(key)
}
export function clearLocalStorage() {
  localStorage.clear()
}
