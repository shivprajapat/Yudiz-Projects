import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { useDisableBodyScroll } from './useDisableBodyScroll'
import { setSearchOverlayActive } from '@/actions/productSearchAction'
import { allRoutes } from '@/constants/allRoutes'
import { isLoggedIn } from '@/helper'
import { createCart } from '@/helper/product-helper'
import { logoutHandler } from '@/helper/account-helper'

export default function useTopHeader() {
  const dispatch = useDispatch()
  const router = useRouter()
  const { searchOverlayActive } = useSelector(
    (state) => state.productSearchReducer
  )
  function convertEntitiesToHTML(asciiString) {
    if (!asciiString) return ''
    let tempElement = document?.createElement('div')
    tempElement.innerHTML = asciiString
    tempElement.innerHTML = tempElement.innerText
    const links = Array.from(tempElement.querySelectorAll('a'))
    const storeLocatorLink = links.find((link) =>
      link.innerText.toLowerCase().includes('store locator')
    )
    if (storeLocatorLink) {
      storeLocatorLink.href = window.location.origin + allRoutes.storeLocator
      storeLocatorLink.removeAttribute('target')
    }
    return tempElement.innerHTML
  }
  const [mobileTopbar, setMobileTopbar] = useState(false)
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [storeHeaderHtml, setStoreHeaderHtml] = useState()
  const [dashboardProfileOpen, setDashboardProfileOpen] = useState(false)

  const storeConfigState = useSelector((state) => state.storeReducer)
  const wishlistStateCount = useSelector(
    (state) => state.productWishlistReducer.items_count
  )

  useDisableBodyScroll(notificationOpen)
  useDisableBodyScroll(cartOpen)

  const handleClick = useCallback(() => {
    dispatch(setSearchOverlayActive(!searchOverlayActive))
  }, [searchOverlayActive, dispatch])
  const handleNotification = () => {
    setNotificationOpen(!notificationOpen)
  }
  const handleCart = () => {
    setCartOpen(!cartOpen)
  }

  const handleDashboardProfile = () => {
    if (isLoggedIn()) {
      setDashboardProfileOpen(!dashboardProfileOpen)
    } else {
      router.push(allRoutes.signIn)
    }
  }

  useEffect(() => {
    createCart(dispatch)
  }, [])

  useEffect(() => {
    const storeHeader = convertEntitiesToHTML(
      storeConfigState.data.storeHeaderDetails
    )
    setStoreHeaderHtml(storeHeader)
  }, [storeConfigState.data.storeHeaderDetails])

  const onLogOutHandle = () => {
    handleAccountNavHide()
    logoutHandler(dispatch, router)
    // deleteCookie(STORAGE_KEYS.token)
    // localStorage.removeItem(STORAGE_KEYS.cartId)
    // setTimeout(() => {
    //   dispatch(resetAccountState())
    //   dispatch(resetWishlistData())
    // }, 1000)
    // router.push(allRoutes.signIn)
    // createCart(dispatch)
    // dispatch(
    //   setMiniCartData({ items: [], totalItems: null, paymentMethods: [] })
    // )
  }

  const handleAccountNavHide = () => {
    setDashboardProfileOpen(false)
  }

  return {
    mobileTopbar,
    setMobileTopbar,
    storeHeaderHtml,
    notificationOpen,
    cartOpen,
    searchOverlayActive,
    handleClick,
    handleNotification,
    handleCart,
    wishlistStateCount,
    dashboardProfileOpen,
    handleDashboardProfile,
    onLogOutHandle,
    handleAccountNavHide,
  }
}
