import { ORDER_STATUS, STORAGE_KEYS } from './constant'
import { createCart } from './product-helper'
import { deleteCookie } from '.'
import { resetAccountState } from '@/actions/accountDetailAction'
import {
  IconCancelled,
  IconDelivered,
  IconReturned,
  IconTrack,
} from '@/assets/images'
import { setMiniCartData } from '@/actions/cartAction'
import { resetWishlistData } from '@/actions/productWishlistAction'
// import { allRoutes } from '@/constants/allRoutes'

export function getTotalPageCount(totalItems, itemsPerPage) {
  const totalPage = Math.ceil(totalItems / itemsPerPage)
  return totalPage
}

export const STATUS_MAPPINGS = {
  [ORDER_STATUS.pending]: {
    icon: IconTrack,
    colorClass: 'text-primary',
    name: 'Pending',
  },
  [ORDER_STATUS.processing]: {
    icon: IconTrack,
    colorClass: 'text-primary',
    name: 'Processing',
  },
  [ORDER_STATUS.delivered]: {
    icon: IconDelivered,
    colorClass: 'text-success',
    name: 'Delivered',
  },
  [ORDER_STATUS.canceled]: {
    icon: IconCancelled,
    colorClass: 'text-error',
    name: 'Cancelled',
  },
  [ORDER_STATUS.returned]: {
    icon: IconReturned,
    colorClass: 'text-secondary-200',
    name: 'Returned',
  },
}

export const logoutHandler = (dispatch, router) => {
  deleteCookie(STORAGE_KEYS.token)
  localStorage.removeItem(STORAGE_KEYS.cartId)
  setTimeout(() => {
    dispatch(resetAccountState())
    dispatch(resetWishlistData())
  }, 1000)
  createCart(dispatch)
  router.push(allRoutes.signIn)
  dispatch(setMiniCartData({ items: [], totalItems: null, paymentMethods: [] }))
}
