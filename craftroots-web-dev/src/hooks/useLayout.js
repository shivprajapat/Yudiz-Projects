import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { setToastDataAction, showToastAction } from '@/actions/toastAction'
import {
  resetWishlistData,
  setWishlistData,
} from '@/actions/productWishlistAction'
import {
  resetAccountState,
  setAccountData,
} from '@/actions/accountDetailAction'
import { accountDetails, deleteCookie, isLoggedIn } from '@/helper'
import { allRoutes } from '@/constants/allRoutes'
import { GRAPHQL_ERROR_MESSAGES, STORAGE_KEYS } from '@/helper/constant'
import { request } from '@/services/api.service'
import { GetWishList } from '@/queries/productWishlistQueries'
import { UserLoginTracking, userSeenMessage } from '@/queries/authQueries'
import { storeConfigAction } from '@/actions/headerAction'

export default function useLayout({ storeConfig }) {
  const [goToTop, setGoToTop] = useState(false)
  const dispatch = useDispatch()
  const router = useRouter()
  const thankYouMessage =
    'Thank you for sign in to our world of hand crafted products'

  const { storeReducer: storeConfigState, toast: toastState } = useSelector(
    (state) => state
  )

  if (!Object.keys(storeConfigState.data).length && storeConfig) {
    dispatch(
      storeConfigAction({
        storeConfig,
      })
    )
  }

  const handleGoToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    const handleGqlError = (e) => {
      const errorMessage = e?.detail?.error?.message || e?.detail?.message
      errorMessage &&
        dispatch(
          setToastDataAction({
            show: true,
            message: errorMessage,
            error: true,
          })
        )
    }
    window.addEventListener('gqlerror', handleGqlError)

    window.addEventListener('scroll', () => {
      setGoToTop(window.scrollY > 400)
    })

    return () => {
      window.removeEventListener('gqlerror', handleGqlError)
    }
  }, [])

  useEffect(() => {
    let timer = null
    if (toastState.show) {
      timer = setTimeout(() => {
        dispatch(showToastAction(false))
      }, 5000)
    }
    return () => {
      if (timer) {
        clearTimeout(timer)
      }
    }
  }, [toastState.show, dispatch])

  const wishlistCount = async () => {
    try {
      const wishlistData = await request({
        ...GetWishList,
      })
      dispatch(setWishlistData(wishlistData?.customer?.wishlist))
    } catch (err) {
      console.log('err', err)
    }
  }

  const accountDetailsRes = async () => {
    const accountdetailData = await accountDetails()
    dispatch(setAccountData(accountdetailData))
  }

  const isTokenValid = async () => {
    try {
      // Token is valid
      await wishlistCount()
      await accountDetailsRes()
    } catch (error) {
      if (error?.message === GRAPHQL_ERROR_MESSAGES.customerNotAuthorized) {
        // Token is invalid
        deleteCookie(STORAGE_KEYS.token)
        router.push(allRoutes.signIn)
        dispatch(resetAccountState())
        dispatch(resetWishlistData())
      }
    }
  }

  const userLoginTrackingData = () => {
    return request({
      ...UserLoginTracking,
    })
  }

  const userSeenMessages = async () => {
    try {
      const userSeenData = await request({
        ...userSeenMessage,
      })
      if (isLoggedIn() && !userSeenData.hasUserSeenMessage) {
        dispatch(
          setToastDataAction({
            show: true,
            message: thankYouMessage,
            error: false,
          })
        )
        userLoginTrackingData()
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (isLoggedIn()) {
      userSeenMessages()
    }
  }, [])

  useEffect(() => {
    if (isLoggedIn()) {
      isTokenValid()
    }
  }, [isLoggedIn()])

  return {
    goToTop,
    handleGoToTop,
    toastState,
  }
}
