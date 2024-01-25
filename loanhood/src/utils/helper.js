/* eslint-disable multiline-ternary */
export function verifyEmail(value) {
  const emailRex =
    /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  if (emailRex.test(value)) {
    return true
  }
  return false
}

export function checkIsNumber(value) {
  const numbers = /^[0-9.]+$/
  if (numbers.test(value)) {
    return true
  }
  return false
}

export function formateDate(date) {
  const d = (new Date(date) + '').split(' ')
  return [d[0], d[1], d[2], d[3]].join(' ')
}
export function formateDateTime(date) {
  const d = new Date(date)
  return `${d.toDateString()}, ${d.getHours() <= 9 ? '0' + d.getHours() : d.getHours()}:${
    d.getMinutes() <= 9 ? '0' + d.getMinutes() : d.getMinutes()
  }`
}
const arrayMoveMutate = (array, from, to) => {
  array.splice(to < 0 ? array.length + to : to, 0, array.splice(from, 1)[0])
}

export function arrayMove(array, from, to) {
  array = array.slice()
  arrayMoveMutate(array, from, to)
  return array
}

export function handleSortStart({ node }) {
  const tds = document.getElementsByClassName('helperContainerClass')[0].childNodes
  node.childNodes.forEach((node, idx) => {
    tds[idx].style.width = `${node.offsetWidth}px`
  })
}

export const parseParams = (params = '') => {
  const urlParams = new URLSearchParams(params)
  const rawParams = params.replace('?', '').split('&')
  const array = ['aFilters', 'aStatusFiltersInput']
  const extractedParams = {}
  if (rawParams[0]) {
    rawParams.forEach((item) => {
      item = item.split('=')
      extractedParams[item[0]] = array.includes(item[0])
        ? urlParams.get(item[0])
          ? urlParams.get(item[0]).split(',')
          : []
        : Number(item[1]) || item[1]
    })
    return extractedParams
  } else {
    return extractedParams
  }
}

export const appendParams = (value) => {
  const params = parseParams(location.search)
  const data = { ...params, ...value }
  Object.keys(data).filter((e) => (data[e] === '' || !data[e].toString().length) && delete data[e])
  window.history.pushState({}, null, `${location.pathname}?${new URLSearchParams(data).toString()}`)
}
export function removeParam(parameter) {
  let url = document.location.href
  const urlparts = url.split('?')

  if (urlparts.length >= 2) {
    const urlBase = urlparts.shift()
    const queryString = urlparts.join('?')

    const prefix = encodeURIComponent(parameter) + '='
    const pars = queryString.split(/[&;]/g)
    // eslint-disable-next-line space-in-parens
    for (let i = pars.length; i-- > 0; ) if (pars[i].lastIndexOf(prefix, 0) !== -1) pars.splice(i, 1)
    url = urlBase + '?' + pars.join('&')
    window.history.pushState('', document.title, url) // added this line to push the new url directly to url bar .
  }
  return url
}

export function getQueryVariable(variable) {
  const query = window.location.search.substring(1)
  const vars = query.split('&')
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split('=')
    if (pair[0] === variable) {
      return pair[1]
    }
  }
  return false
}
