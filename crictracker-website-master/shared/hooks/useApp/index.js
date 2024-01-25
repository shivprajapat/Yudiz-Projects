import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { tagPageview } from '@shared/libs/gtm'
import { useAmp } from 'next/amp'

import GlobalEventsReducer from '@shared/components/global-events/GlobalEventsReducer'
import ToastrReducers from '@shared/components/toastr/ToastrReducers'
import { getPreviewMode } from '@shared/libs/menu'
import { refreshGoogleAds, removeSlot } from '@shared/libs/ads'
import { staticPages } from '@shared/constants/staticPages'
import { checkIsGlanceView } from '@shared/utils'
// import { REACT_APP_ENV } from '@shared/constants'

const useApp = () => {
  const router = useRouter()
  const isAmp = useAmp()
  // const isStaticPage = staticPages.includes(router.asPath)
  const isStaticPage = staticPages.some((path) => router.asPath.startsWith(path))
  const { isPreviewMode, isMobileWebView } = router?.query
  const [isPreview, setIsPreview] = useState(!!isMobileWebView || !!isPreviewMode)
  const [stateGlobalEvents, dispatchGlobalEvents] = React.useReducer(GlobalEventsReducer, {})
  const [state, dispatch] = React.useReducer(ToastrReducers, {})
  const isGlanceView = checkIsGlanceView(router?.query)

  useEffect(() => {
    (!isMobileWebView && !isPreviewMode) && setIsPreview(getPreviewMode())
  }, [getPreviewMode()])

  // useEffect(async () => {
  //   if (REACT_APP_ENV !== 'production' && REACT_APP_ENV !== 'development') {
  //     const { register } = (await import('@shared/libs/serviceWorker'))
  //     register()
  //   }
  // }, [])

  useEffect(async () => {
    const NProgress = (await import('nprogress'))
    const { analyticsPageview } = (await import('@shared-libs/gtag'))

    const handleRouteChange = (url) => {
      handleStop()
      window.gtag && analyticsPageview(url)
      tagPageview(url)
      !isGlanceView && refreshGoogleAds()
    }
    const handleStart = () => {
      removeSlot()
      NProgress.start()
    }
    const handleStop = () => {
      NProgress.done()
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeError', handleStop)
    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleRouteChange)
      router.events.off('routeChangeError', handleStop)
    }
  }, [router.events])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      isStaticPage && removeSlot()
      const adElement = document.getElementById('stickyunit')
      if (isStaticPage && adElement) {
        document.getElementById('stickyunit').style.display = 'none'
      }
    }
  }, [isStaticPage])

  return {
    isAmp,
    state,
    dispatch,
    stateGlobalEvents,
    dispatchGlobalEvents,
    isPreview,
    isStaticPage,
    isGlanceView,
    router,
    isMobileWebView
  }
}
export default useApp
