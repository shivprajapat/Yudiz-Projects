import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'
import { checkIsGlanceView } from '@shared/utils'
import { staticPages } from '@shared/constants/staticPages'

function Ads({ id, adIdDesktop, adIdMobile, dimensionDesktop, dimensionMobile, className, mobile, ...rest }) {
  const router = useRouter()
  const isGlanceView = checkIsGlanceView(router?.query)
  const isStaticPage = staticPages?.some((path) => router?.asPath.startsWith(path))

  useEffect(() => {
    if (!isGlanceView && !isStaticPage) {
      let ads
      const googletag = window.googletag || { cmd: [] }

      const shoAd = () => {
        googletag.cmd.push(() => {
          // Refresh ads
          // googletag.pubads().refresh()
          const width = window.innerWidth
          if (mobile) {
            if (width >= 728) {
              ads = googletag.defineSlot(`/138639789/${adIdDesktop}`, [dimensionDesktop], id).addService(googletag.pubads())
              googletag.enableServices()
              document.getElementById(id).style.minHeight = dimensionDesktop[1] + 'px'
              googletag.display(id)
            } else {
              ads = googletag.defineSlot(`/138639789/${adIdMobile}`, [dimensionMobile], id).addService(googletag.pubads())
              googletag.enableServices()
              document.getElementById(id).style.minHeight = dimensionMobile[1] + 'px'
              googletag.display(id)
            }
          } else {
            ads = googletag.defineSlot(`/138639789/${adIdDesktop}`, [dimensionDesktop], id).addService(googletag.pubads())
            googletag.enableServices()
            document.getElementById(id).style.minHeight = dimensionDesktop[1] + 'px'
            googletag.display(id)
          }
        })
      }

      const handleRouteChange = (url) => {
        shoAd()
      }

      shoAd()
      router?.events?.on('routeChangeComplete', handleRouteChange)
      return () => {
        router?.events?.off('routeChangeComplete', handleRouteChange)
        ads && googletag?.destroySlots([ads])
        // ads && googletag?.destroySlots()
      }
    }
  }, [router?.events])

  return (
    // <div className={className || ''} style={style}>
    !isStaticPage ? <div className={`${className || ''} ads-box overflow-hidden`} id={id} {...rest} ></div> : null
    // </div>
  )
}

Ads.propTypes = {
  id: PropTypes.string,
  adIdDesktop: PropTypes.string,
  adIdMobile: PropTypes.string,
  className: PropTypes.string,
  dimensionDesktop: PropTypes.array,
  dimensionMobile: PropTypes.array,
  mobile: PropTypes.bool
}
export default Ads
