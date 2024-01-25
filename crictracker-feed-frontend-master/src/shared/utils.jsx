/* eslint-disable no-useless-escape */
/* eslint-disable multiline-ternary */
import { Crypt } from 'hybrid-crypto-js'
import { PUBLIC_KEY } from './constants'

export const encryption = (data) => {
  const crypt = new Crypt()
  const encrypted = crypt.encrypt(PUBLIC_KEY, data)
  return encrypted.toString()
}

// Image Type check function

export const checkImageType = (e) => {
  try {
    if (e === 'image/png' || e === 'image/jpeg' || e === 'image/jpg' || e === 'image/webp') {
      return true
    } else {
      return false
    }
  } catch (error) {
    console.log(error)
  }
}

export function getFileInfo(file, mime) {
  if (typeof file === 'string') {
    const type = file.split('.').pop()
    const fileName = file.split('/').pop()
    return {
      filename: fileName,
      mime: `image/${type}`
    }
  } else {
    const pos = file.name.lastIndexOf('.')
    if (mime === 'image/jpeg') {
      const filename = `${String(file.name).substr(0, pos < 0 ? String(file.name).length : pos)}.jpg`
      return {
        filename,
        mime: 'image/jpeg'
      }
    }
    return {
      filename: file.name,
      mime: file.type
    }
  }
}

export const setSortType = (data, fieldName) => {
  return data.map((data) => {
    if (data.internalName === fieldName) {
      data.type = data.type === 1 ? -1 : 1
    } else {
      data.type = 0
    }
    return data
  })
}

export const parseParams = (params = '') => {
  const urlParams = new URLSearchParams(params)
  const array = [
    'aFilters',
    'aStatusFiltersInput',
    'aStatus',
    'aCountryFilter',
    'aRoleFilter',
    'aCodeFilters',
    'eDesignationFilter',
    'aCategoryFilters',
    'aTagFilters',
    'aFilter',
    'eState',
    'aState',
    'aTeamTagFilters',
    'aVenueTagFilters',
    'aSeriesFilters',
    'aAuthorsFilters',
    'aType'
  ]
  const value = Object.fromEntries(urlParams.entries())
  Object.keys(value).forEach((key) => {
    if (array.includes(key)) {
      value[key] = value[key].split(',')
    }
  })
  return value
}

export const appendParams = (value) => {
  const params = parseParams(location.search)
  const data = { ...params, ...value }
  Object.keys(data).filter((e) => (data[e] === '' || !data[e].toString().length) && delete data[e])
  window.history.pushState({}, null, `${location.pathname}?${new URLSearchParams(data).toString()}`)
}

export const checkTag = (data) => {
  switch (data) {
    case 'Requested':
      return 're'
    case 'Requests':
      return 'r'
    case 'activeTags':
      return 'a'
    default:
      return ''
  }
}

export const convertDate = (date) => {
  const t = new Date(date)
  return t.toDateString()
}

export const convertDateInDMY = (date) => {
  if (date) {
    const t = new Date(date)
    const Day = addLeadingZeros(t.getDate())
    const Month = addLeadingZeros(t.getMonth() + 1)
    const Year = t.getFullYear()
    return Day + '-' + Month + '-' + Year
  }
  return 'YYYY-MM-DD'
}
export const convertDateInYDM = (date) => {
  if (date) {
    const t = new Date(date)
    const Day = addLeadingZeros(t.getDate())
    const Month = addLeadingZeros(t.getMonth() + 1)
    const Year = t.getFullYear()
    return (Year + '-' + Month + '-' + Day).toString()
  }
  return 'YYYY-MM-DD'
}

// Add 0 value in start
export const addLeadingZeros = (value) => {
  value = String(value)
  while (value.length < 2) {
    value = '0' + value
  }
  return value
}

export function dayDifference(date1) {
  const d1 = new Date(date1)
  const d2 = new Date()
  return parseInt((d1.getTime() - d2.getTime()) / (1000 * 60 * 60 * 24))
}
export const range = (start, end) => {
  const length = end - start + 1
  return Array.from({ length }, (_, idx) => idx + start)
}

export const eTypeName = (para) => {
  switch (para) {
    case 'gt':
      return 'General'
    case 'l':
      return 'League'
    case 'p':
      return 'Player'
    case 's':
      return 'Series'
    case 't':
      return 'Team'
    case 'v':
      return 'Venue'
    default:
      return ''
  }
}

export const showCounts = (usedCounts, totalCounts) => {
  const mergedCounts = []
  let mergedCount
  for (let index = 0; index < usedCounts?.length; index++) {
    mergedCount = `${usedCounts[index]}/${totalCounts[index]}`
    mergedCounts.push(mergedCount)
  }
  return mergedCounts
}

export function lastSevenDays() {
  const result = []
  for (let i = 0; i < 7; i++) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const month = ('0' + (d.getMonth() + 1)).slice(-2)
    const day = ('0' + d.getDate()).slice(-2)
    result.push([day, month, d.getFullYear()].join('-'))
  }
  return result
}

export function getDates(data) {
  const result = data.map((item) => {
    return {
      dDate: item.dDate
    }
  })
  return result
}

export function firstLetterCapital(data) {
  return data.charAt(0).toUpperCase() + data.slice(1)
}

export function redirectPage(route) {
  const event = new CustomEvent('login', {
    detail: {
      path: route
    },
    bubbles: true,
    cancelable: true
  })
  document.dispatchEvent(event)
}

export const graphOptions = {
  tooltip: {
    enabled: true,
    fillSeriesColor: true,
    theme: true,
    style: {
      fontSize: '12px'
    },
    x: {
      show: true,
      format: 'dd MMM'
    },
    y: {
      title: {
        formatter: (seriesName) => seriesName
      }
    },
    marker: {
      show: true
    }
  },
  title: {
    text: 'Api Hits',
    align: 'left',
    margin: 10,
    offsetX: 0,
    offsetY: 0,
    floating: false,
    style: {
      fontSize: '22px',
      fontWeight: 600,
      fontFamily: undefined,
      color: '#a7acb4'
    }
  },
  colors: ['#235ce9'],
  chart: {
    height: '400px',
    type: 'bar',
    stacked: true,
    animations: {
      enabled: true
    },
    toolbar: {
      show: false
    },
    foreColor: '#a7acb4'
  },
  grid: {
    show: false
  },
  responsive: [
    {
      breakpoint: 300
    }
  ],
  plotOptions: {
    bar: {
      horizontal: true,
      borderRadius: 5,
      barHeight: '40px'
    }
  },
  xaxis: {
    labels: {
      show: true,
      style: {
        colors: [],
        fontSize: '14px',
        fontFamily: 'Helvetica, Arial, sans-serif',
        fontWeight: 500,
        cssClass: 'apexcharts-xaxis-label'
      },
      offsetX: 0,
      offsetY: 3
    }
  },
  yaxis: {
    labels: {
      show: true,
      style: {
        fontSize: '14px',
        fontFamily: 'Helvetica, Arial, sans-serif',
        fontWeight: 500,
        cssClass: 'apexcharts-yaxis-label'
      }
    }
  }
}
