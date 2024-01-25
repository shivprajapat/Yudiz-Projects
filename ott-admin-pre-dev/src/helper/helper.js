import { queryClient } from 'App'
import { FormattedMessage } from 'react-intl'
let nav

export function navigationTo(link) {
  nav(link)
}

export function removeToken() {
  localStorage.clear('')
  sessionStorage.clear('')
}

export const FRONT_USER_FILTER = [
  { label: <FormattedMessage id='activateUsers' />, value: 'y' },
  { label: <FormattedMessage id='deActiveUsers' />, value: 'n' }
]

export function toaster(message, type) {
  queryClient.defaultOptions.message(message, type)
}

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat']
export const convertDateInDMY = (date) => {
  const t = new Date(date)
  const Day = t.getDate()
  const Month = t.toLocaleString('en-us', { month: 'short' })
  const Year = t.getFullYear()
  const sDay = t.getDay()
  const timeWithAMPM = t.toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    second: 'numeric'
  })
  return daysOfWeek[sDay] + ', ' + Day + ' ' + Month + ' ' + Year + ', ' + timeWithAMPM
}
