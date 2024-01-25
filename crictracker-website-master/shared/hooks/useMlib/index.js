import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { GLANCE_MOBILE_UNIT_MLIB } from '@shared/constants'
import { parseParams } from '@shared/utils'

const useMlib = ({ adUnitName, placementName, id, height, width, router, pageName }) => {
  const cRouter = useRouter() || router

  useEffect(() => {
    if (window?.mLibSdk?.isReady) loadAds()
    else window.mLibSdk.stack.push(loadAds)
  }, [cRouter?.asPath])

  function loadAds() {
    const params = parseParams(window.location.search)
    const gpid = router?.query?.gpid || params?.gpid
    const mobileUnit = GLANCE_MOBILE_UNIT_MLIB[router?.query?.utm_medium || params?.utm_medium]
    // console.log(window?.isMLibSdkReady)
    if (window?.mLibSdk?.isReady) {
      const AdBannerInstance = adInstances(mobileUnit, gpid)
      try {
        AdBannerInstance?.registerCallback('onAdLoadSucceed', (data) => {
          console.log(`onAdLoadSucceed=${adUnitName}, div id=${id}`, data)
        })
        AdBannerInstance?.registerCallback('onAdDisplayFailed', (data) => {
          console.log(`onAdDisplayFailed=${adUnitName}, div id=${id}`, data)
        })
        AdBannerInstance?.registerCallback('onAdLoadFailed', (data) => {
          console.log(`onAdLoadFailed=${adUnitName}, div id=${id}`, data)
        })
        AdBannerInstance?.loadAd()
      } catch (error) {
        console.log('ad Error', error)
      }
    } else {
      console.log('before initialized', adUnitName)
    }
  }

  function adInstances(mu, gpid) {
    console.log({
      adUnitName: adUnitName,
      pageName: pageName || 'crictracker.com', // Connect with your Glance Account Manager for this value.
      categoryName: 'sports', // See AdUnitName table for more info
      placementName: placementName || 'InArticleMedium', //
      containerID: id,
      height: height,
      width: width,
      xc: '12.0',
      yc: '3.0',
      gpid: gpid //
      // impid: 'd4df83ef-cfd2-49bf-bdca-87af57a71724'
    })
    const bannerInstance = window?.GlanceAdClientInterface?.getProvider?.({
      adUnitName: adUnitName,
      pageName: pageName || 'crictracker.com', // Connect with your Glance Account Manager for this value.
      categoryName: 'sports', // See AdUnitName table for more info
      placementName: placementName || 'InArticleMedium', //
      containerID: id,
      height: height,
      width: width,
      xc: '12.0',
      yc: '3.0',
      gpid: gpid //
      // impid: 'd4df83ef-cfd2-49bf-bdca-87af57a71724'
    })
    return bannerInstance
  }
}
export default useMlib
