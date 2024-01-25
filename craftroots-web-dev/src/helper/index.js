import dayjs from 'dayjs'
import {
  STORAGE_KEYS,
  ALL_PRODUCT_CAT_ID_URL,
  PAGE_ATTRIBUTES,
  DISPLAY_DATE_FORMAT,
  PRODUCT_TYPE,
  OUT_OF_STOCK,
  MAX_CHARACTER_LENGTH,
} from './constant'
import {
  CmsPage,
  CreateCustomerCart,
  MpProductAlertNotifyInStock,
  NavigationMenu,
  StoreHeaderDetails,
  storeConfig,
} from '@/queries'
import {
  Breadcrumbs,
  MetaTags,
  ProductList,
  ResolveURL,
} from '@/queries/productListQueries'
import { request } from '@/services/api.service'
import { outOfStockHandler } from '@/actions/cartAction'
import { GetAccountDetails } from '@/queries/accountDetailQueries'
import { RemoveStoreCredit } from '@/queries/checkoutQueries'

export const emailRegex =
  /^\s*(((\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b))|(".+"))\s*$/
export const nameRegex = /^\s*[a-zA-Z]+([ \t][a-zA-Z]+)*\s*$/
export const pinCodeRegex = /^\s*[1-9][0-9]{5}\s*$/
export const phoneRegex =
  /^\s*\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})\s*$/
export const textAreaRegex = /^([\s\S]{0,100})$/
export const passwordRegex =
  /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/

export const uppercaseRegex = /[A-Z]/
export const numberRegex = /\d/

export const validator = (
  required,
  validation,
  name,
  errorFieldName,
  isMaxLength
) => {
  if (required) {
    const baseValidation = {
      required: `${errorFieldName || name} is required`,
      onChange: () => {},
      ...validation,
    }
    // Conditionally include maxLength
    if (isMaxLength) {
      baseValidation.maxLength = {
        value: MAX_CHARACTER_LENGTH,
        message: `Maximum ${MAX_CHARACTER_LENGTH} characters allowed`,
      }
    }
    return baseValidation
  } else {
    return {
      maxLength: { value: 5, message: 'maximun error' },
      // ...validation
    }
  }
}

export const storeConfigData = async () => {
  const storeConfigData = await request(storeConfig)
  return storeConfigData
}

export async function fetchNavigationData({ rootCategoryId }) {
  const NavigationMenuData = await request({
    ...NavigationMenu,
    variables: { id: rootCategoryId },
  })
  if (NavigationMenuData?.category?.children?.length > 0) {
    return {
      navData: NavigationMenuData?.category?.children,
    }
  }
}

export const storeHeaderDetailsData = async () => {
  const storeHeaderDetailsData = await request({
    ...StoreHeaderDetails,
    variables: { identifiers: 'store_header_details' },
  })
  return storeHeaderDetailsData?.cmsBlocks?.items?.[0]?.content
}

export const onImageLoad = (url) => {
  return new Promise((resolve, reject) => {
    const image = document.createElement('img')
    image.src = url
    image.alt = 'product-image-loading'
    image.onload = () => {
      resolve()
    }
    image.onerror = (error) => {
      reject(error)
    }
  })
}

export const productListReq = async (query, url) => {
  let categoryIdRes = null
  if (url && url !== ALL_PRODUCT_CAT_ID_URL.url) {
    categoryIdRes = await request({
      ...ResolveURL,
      variables: {
        urlKey: url,
      },
    })
  }
  const rootCatId =
    url !== ALL_PRODUCT_CAT_ID_URL.url
      ? categoryIdRes?.urlResolver?.id
      : ALL_PRODUCT_CAT_ID_URL.id
  let obj
  if (rootCatId) {
    obj = {
      category_id: {
        in: [rootCatId],
      },
    }
  }

  const queryVariables = {
    pageSize: query?.pageNo
      ? +query?.pageNo * PAGE_ATTRIBUTES.pageSize
      : PAGE_ATTRIBUTES.pageSize,
    currentPage: 1,
    filter: { ...obj },
  }

  if (query?.filter) {
    // Convert the filter object to the desired format
    const queryFilterObj = JSON.parse(query.filter)
    let convertedFilter = {}
    for (const key in queryFilterObj) {
      convertedFilter[key] = { in: queryFilterObj[key] }
    }
    // Merge the convertedFilter with the existing filter object in queryVariables
    queryVariables['filter'] = { ...convertedFilter }
  }
  if (query?.price) {
    const [min, max] = query.price.split(',')
    queryVariables.filter['price'] = { from: min, to: max }
  }
  if (query?.sort) {
    const [value, sortDirection] = query.sort.split(',')
    queryVariables['sort'] = { [value]: sortDirection }
  }
  if (query?.query) {
    // product search query
    queryVariables['search'] = query.query
  }

  const result = await request({
    ...ProductList,
    fetchPolicy: 'network-only',
    variables: queryVariables,
  })

  let metaTags = null
  if (rootCatId !== ALL_PRODUCT_CAT_ID_URL.id) {
    metaTags = await request({
      ...MetaTags,
      variables: {
        category_id: rootCatId.toString(),
      },
    })
  }
  const breadCrumbsRes = await request({
    ...Breadcrumbs,
    variables: {
      category_id: rootCatId,
    },
  })

  return { result, rootCatId, metaTags, breadCrumbsRes }
}

export const isLoggedIn = () => {
  const token = getCookie(STORAGE_KEYS.token)
  return token !== null
}

export const setCookie = (name, value) => {
  if (typeof document !== 'undefined') {
    const expirationTime = 365 * 24 * 60 * 60 * 1000 // 1 year in milliseconds
    const date = new Date()
    date.setTime(date.getTime() + expirationTime)
    const expires = 'expires=' + date.toUTCString()
    document.cookie = name + '=' + value + ';' + expires + ';path=/'
  }
}

export const getCookie = (name) => {
  if (typeof document !== 'undefined') {
    const cookieName = name + '='
    const decodedCookie = decodeURIComponent(document.cookie)
    const cookies = decodedCookie.split(';')
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i]
      while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1)
      }
      if (cookie.indexOf(cookieName) === 0) {
        return cookie.substring(cookieName.length, cookie.length)
      }
    }
  }
  return null
}

export const deleteCookie = (name) => {
  if (typeof document !== 'undefined') {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
  }
}

export function getDisplayDate(date) {
  return dayjs(date).format(DISPLAY_DATE_FORMAT)
}
export const customerCart = async () => {
  try {
    const customerCartResult = await request(CreateCustomerCart)
    return customerCartResult?.customerCart?.id
  } catch (error) {
    console.log('error getDisplayDate', error)
  }
}

function priceWithSymbol(incomingPrice) {
  if (incomingPrice === '') return ''
  let price = incomingPrice.toString()
  if (!price.includes('₹')) {
    if (price < 0) {
      price = ' - ' + '₹' + Math.abs(price)
    } else {
      price = '₹' + price
    }
  }
  return price
}

export function getDisplayPrice(prices, displayRange = false) {
  let displayPrice = prices?.maximum_price?.final_price?.value || prices
  displayPrice = priceWithSymbol(displayPrice)
  if (displayRange) {
    const minimumPrice = priceWithSymbol(
      prices?.minimum_price?.final_price?.value
    )
    displayPrice =
      minimumPrice !== displayPrice
        ? minimumPrice + ' - ' + displayPrice
        : displayPrice
  }
  return displayPrice
}

export const outOfStockStatusHandle = (items, dispatch) => {
  if (items?.length > 0) {
    const status = items?.some(
      (product) =>
        (PRODUCT_TYPE.configuralProduct.title.includes(
          product.product.__typename
        ) &&
          product?.configured_variant?.stock_status_data?.stock_status ===
            OUT_OF_STOCK) ||
        (PRODUCT_TYPE.simpleProduct.title.includes(
          product.product.__typename
        ) &&
          product?.product?.stock_status_data?.stock_status === OUT_OF_STOCK)
    )
    dispatch(outOfStockHandler(status))
  }
}

export const filteredOrderData = (orderData) => {
  if (!orderData || !Object.keys(orderData).length) return {}
  return Object.keys(orderData).reduce((acc, dataKey) => {
    if (orderData[dataKey] !== '₹0' && orderData[dataKey] !== '0') {
      acc[dataKey] = orderData[dataKey]
    }
    return acc
  }, {})
}

export const fetchCMSPageData = async (identifier) => {
  try {
    if (identifier) {
      const CMSData = await request({
        ...CmsPage,
        variables: {
          identifier,
        },
      })
      return CMSData
    }
  } catch (error) {
    console.log('error', error)
  }
}

export const capitalFirstCharacter = (letter) => {
  return letter.charAt(0).toUpperCase() + letter.slice(1)
}

export const getSearchMetaContent = (searchName) => {
  return {
    keyword: `${searchName}, ${searchName} in India, buy ${searchName} online in India, online store for ${searchName}, Shop online for ${searchName}, online shopping for ${searchName}, Online shopping for ${searchName} in India, reviews and prices`,
    description: `${searchName} - Online shopping for ${searchName} in India. ✯ Buy ${searchName} ✯ Cash on Delivery`,
  }
}

export const accountDetails = async () => {
  const accountdetailData = await request({
    ...GetAccountDetails,
  })
  return accountdetailData
}

export function generateSliderItemForLoop(data, maxLength) {
  if (!data || !Array.isArray(data) || !maxLength) {
    return console.warn('please check args of generateSliderItemForLoop', {
      data,
      maxLength,
    })
  }
  let cloneData = [...data]

  const dataLength = cloneData.length
  if (maxLength / 2 < dataLength && dataLength < maxLength) {
    const spliceIndex = {
      start: maxLength / 2 - (maxLength - dataLength),
      deleteCount: maxLength - dataLength,
    }
    cloneData = [
      ...cloneData,
      ...cloneData.splice(spliceIndex.start, spliceIndex.deleteCount),
    ]
  }
  return cloneData
}

export const productAlert = async (notifyMeAsyncHook, email, productSku) => {
  try {
    notifyMeAsyncHook.run(request, {
      ...MpProductAlertNotifyInStock,
      variables: { email: email, productSku: productSku },
    })
  } catch (error) {
    console.error('error while product alert', error)
  }
}

export const removeStoreCreditAction = (removeCredits) => {
  try {
    removeCredits.run(request, {
      ...RemoveStoreCredit,
      variables: {
        cart_id: localStorage.getItem(STORAGE_KEYS.cartId),
      },
    })
  } catch (err) {
    console.log('err', err)
  }
}

export function trimString(str) {
  return str ? str.trim() : ''
}
