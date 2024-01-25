import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { tagPageview } from '@shared/libs/gtm'
import * as gtag from '@shared-libs/gtag'
import NProgress from 'nprogress'
import { useAmp } from 'next/amp'
import { GlobalEventsReducer } from '@shared/components/global-events'
import { ToastrReducers } from '@shared/components/toastr'
import { getPreviewMode } from '@shared/libs/menu'
import { refreshGoogleAds } from '@shared/libs/ads'

const useApp = () => {
  const router = useRouter()
  const isAmp = useAmp()
  const [isPreview, setIsPreview] = useState(false)

  const [stateGlobalEvents, dispatchGlobalEvents] = React.useReducer(GlobalEventsReducer, {})
  const [state, dispatch] = React.useReducer(ToastrReducers, {})

  useEffect(() => {
    setIsPreview(getPreviewMode())
  }, [getPreviewMode()])

  useEffect(() => {
    const handleRouteChange = (url) => {
      handleStop()
      window.gtag && gtag.analyticsPageview(url)
      tagPageview(url)
      refreshGoogleAds()
    }
    const handleStart = () => {
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
    if (router?.query?.isMobileWebView) {
      setIsPreview(true)
    }
  }, [router?.asPath])

  return {
    isAmp,
    state,
    dispatch,
    stateGlobalEvents,
    dispatchGlobalEvents,
    isPreview
  }
}
export default useApp
