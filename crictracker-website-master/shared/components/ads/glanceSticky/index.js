import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'
import { GLANCE_MOBILE_UNIT } from '@shared/constants'
import style from './style.module.scss'

function GlanceSticky() {
  const router = useRouter()
  const mobileUnit = GLANCE_MOBILE_UNIT[router?.query?.utm_medium]
  const ads = useRef()

  useEffect(() => {
    // let ads
    const googleTag = window.googletag || { cmd: [] }
    const showAd = () => {
      googleTag.cmd.push(() => {
        const REFRESH_KEY = 'refresh'
        const REFRESH_VALUE = 'true'

        ads.current = googleTag.defineSlot(`22029514685/${mobileUnit}/Crictracker_footer_sticky`, [[320, 50], [300, 50]], 'div-gpt-ad-4').setTargeting(REFRESH_KEY, REFRESH_VALUE).setTargeting('test', 'event').addService(googleTag.pubads())

        googleTag.pubads().enableSingleRequest()
        googleTag.pubads().collapseEmptyDivs()
        googleTag.enableServices()
        googleTag.display('div-gpt-ad-4')
      })
    }

    const handleRouteChange = (url) => {
      showAd()
    }

    showAd()
    router?.events?.on('routeChangeComplete', handleRouteChange)
    return () => {
      router?.events?.off('routeChangeComplete', handleRouteChange)
      // ads && googleTag?.destroySlots()
    }
  }, [router?.events])

  return (
    <div id="div-gpt-ad-4" className={style.stickyAd}></div>
  )
}
export default GlanceSticky
