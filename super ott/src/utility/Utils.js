import defaultImage from '@src/assets/images/pages/coming-soon.svg'

export const src = defaultImage

// ** Checks if an object is empty (returns boolean)
export const isObjEmpty = (obj) => Object.keys(obj).length === 0

// ** Returns K format from a number
export const kFormatter = (num) => (num > 999 ? `${(num / 1000).toFixed(1)}k` : num)

// ** Converts HTML to string
export const htmlToString = (html) => html.replace(/<\/?[^>]+(>|$)/g, '')

// ** Checks if the passed date is today
const isToday = (date) => {
  const today = new Date()
  return (
    /* eslint-disable operator-linebreak */
    date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()
    /* eslint-enable */
  )
}

/**
 ** Format and return date in Humanize format
 ** Intl docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/format
 ** Intl Constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
 * @param {String} value date to format
 * @param {Object} formatting Intl object to format with
 */
export const formatDate = (value, formatting = { month: 'short', day: 'numeric', year: 'numeric' }) => {
  if (!value) return value
  return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
}

// ** Returns short month of passed date
export const formatDateToMonthShort = (value, toTimeForCurrentDay = true) => {
  const date = new Date(value)
  let formatting = { month: 'short', day: 'numeric' }

  if (toTimeForCurrentDay && isToday(date)) {
    formatting = { hour: 'numeric', minute: 'numeric' }
  }

  return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
}

/**
 ** Return if user is logged in
 ** This is completely up to you and how you want to store the token in your frontend application
 *  ? e.g. If you are using cookies to store the application please update this function
 */

// ** login-token
export const adminToken = localStorage.getItem('adminAuthToken')

export const isUserLoggedIn = () => localStorage.getItem('userData')
export const getUserData = () => JSON.parse(localStorage.getItem('userData'))
/**
 ** This function is used for demo purpose route navigation
 ** In real app you won't need this function because your app will navigate to same route for each users regardless of ability
 ** Please note role field is just for showing purpose it's not used by anything in frontend
 ** We are checking role just for ease
 * ? NOTE: If you have different pages to navigate based on user ability then this function can be useful. However, you need to update it.
 * @param {String} userRole Role of user
 */
export const getHomeRouteForLoggedInUser = (userRole) => {
  if (userRole === 'admin') return '/'
  if (userRole === 'client') return '/access-control'
  return '/login'
}

// ** React Select Theme Colors
export const selectThemeColors = (theme) => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary25: '#7367f01a', // for option hover bg-color
    primary: '#7367f0', // for selected option bg-color
    neutral10: '#7367f0', // for tags bg-color
    neutral20: '#ededed', // for input border-color
    neutral30: '#ededed' // for input hover border-color
  }
})

export const userData = () => JSON.parse(localStorage.getItem('userData'))

export const bytesToSize = (bytes) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) return 'n/a'
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10)
  if (i === 0) return `${bytes} ${sizes[i]})`
  return `${((bytes / 1024) ** i).toFixed(1)} ${sizes[i]}`
}

// ** get form data
export const getFormData = (object) =>
  Object.keys(object).reduce((formData, key) => {
    formData.append(key, object[key])
    return formData
  }, new FormData())

// ** upload to s3 bucker

// export const uploadToS3 = async (url, file) => {
//   try {
//     const _formData = new formData()
//     _formData.append('file', file.src)

//     const response = await axios.post(url, _formData)
//   } catch (error) {
//     console.error(error)
//   }
// }

export const debounce = (callBack, delay = 500) => {
  let timeout
  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      callBack(...args)
    }, delay)
  }
}

export const uploadFileToS3 = (fields, url, file) => {
  return new Promise((resolve, reject) => {
    const formData = new FormData()
    Object.keys(fields).forEach((key) => {
      formData.append(key, fields[key])
    })
    formData.append('file', file)
    const xhr = new XMLHttpRequest()
    xhr.open('POST', url, true)
    xhr.send(formData)
    xhr.onload = () => {
      xhr.status === 204 ? resolve() : reject(new Error('something went wrong'))
    }
  })
}
export const limitOptions = [
  { label: '10', value: '10' },
  { label: '20', value: '20' },
  { label: '50', value: '50' },
  { label: '100', value: '100' },
  { label: '500', value: '500' }
]
export const statusOptions = [
  { label: 'Active', value: 'y' },
  { label: 'Inactive', value: 'n' },
  { label: 'Deleted', value: 'd' }
]
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
    second: 'numeric',
    milSec: 'numeric',
    fractionalSecondDigits: 3
  })
  return daysOfWeek[sDay] + ', ' + Day + ' ' + Month + ' ' + Year + ', ' + timeWithAMPM
}

export function getDirtyFormValues(dirtyFields, allValues) {
  if (dirtyFields === true || Array.isArray(dirtyFields)) return allValues
  return Object.fromEntries(Object.keys(dirtyFields).map((key) => [key, getDirtyFormValues(dirtyFields[key], allValues[key])]))
}

export const castOptions = [
  { label: 'Actor', value: 'Actor' },
  { label: 'Producer', value: 'Producer' },
  { label: 'Director', value: 'Director' },
  { label: 'Writer', value: 'Writer' }
]

export const castGujaratiOptions = [
  { label: 'અભિનેતા', value: 'અભિનેતા' },
  { label: 'નિર્માતા', value: 'નિર્માતા' },
  { label: 'દિગ્દર્શક', value: 'દિગ્દર્શક' },
  { label: 'લેખક', value: 'લેખક' }
]

export const ageRestrictionOptions = [
  { label: '13+', value: '13+' },
  { label: '16+', value: '16+' },
  { label: '18+', value: '18+' }
]
export const movieLanguages = [
  { label: 'English', value: 'English' },
  { label: 'Hindi', value: 'Hindi' },
  { label: 'Gujarati', value: 'Gujarati' }
]
