import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
// import { useRouter } from 'next/router'
import style from './style.module.scss'

function Ads({ id, adIdDesktop, adIdMobile, dimensionDesktop, dimensionMobile, className, mobile, ...rest }) {
  useEffect(() => {
    let ads
    const googletag = window.googletag || { cmd: [] }
    googletag.cmd.push(() => {
      // Refresh ads
      // googletag.pubads().refresh()

      if (typeof window !== 'undefined') {
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
      }
    })
    return () => {
      ads && googletag?.destroySlots([ads])
      // ads && googletag?.destroySlots()
    }
  }, [])

  return (
    // <div className={className || ''} style={style}>
    <div className={`${className || ''} ${style.ads}`} id={id} {...rest} />
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
