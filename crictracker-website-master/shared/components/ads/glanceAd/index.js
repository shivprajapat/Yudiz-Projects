import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'
import { GLANCE_MOBILE_UNIT, IS_GLANCE_MLIB } from '@shared/constants'
import { parseParams } from '@shared/utils'
import MLibAd from '../glanceMLib/mLibAd'

function GlanceAd({ id, adId, adUnitName, dimension, className, router, ...rest }) {
  if (IS_GLANCE_MLIB) {
    return (
      <MLibAd
        id={id}
        adUnitName={adUnitName}
        dimension={dimension}
        className={className}
        router={router}
        {...rest}
      />
    )
  } else {
    return (
      <WithOutMLIB
        id={id}
        adId={adId}
        dimension={dimension}
        className={className}
        {...rest}
      />
    )
  }
}

GlanceAd.propTypes = {
  id: PropTypes.string.isRequired,
  adId: PropTypes.string.isRequired,
  dimension: PropTypes.array.isRequired,
  className: PropTypes.string,
  adUnitName: PropTypes.string,
  router: PropTypes.object
}
export default GlanceAd

// eslint-disable-next-line react/prop-types
const WithOutMLIB = ({ id, adId, dimension, className, ...rest }) => {
  const router = useRouter()
  useEffect(() => {
    const params = parseParams(window.location.search)?.utm_medium
    const mobileUnit = GLANCE_MOBILE_UNIT[router?.query?.utm_medium || params]

    let ads

    const googleTag = window.googletag || { cmd: [] }
    window.refreshSlotKeys = JSON.parse('["s7"]')
    window.slotsToRefresh = []

    const showAd = () => {
      googleTag.cmd.push(() => {
        const REFRESH_KEY = 'refresh'
        const REFRESH_VALUE = 'true'

        ads = googleTag.defineSlot(`22029514685/${mobileUnit}/${adId}`, dimension, id).setTargeting(REFRESH_KEY, REFRESH_VALUE).setTargeting('test', 'event').addService(googleTag.pubads())
        googleTag.pubads().enableSingleRequest()
        googleTag.pubads().collapseEmptyDivs()
        googleTag.enableServices()
        googleTag.display(id)
      })
    }

    const handleRouteChange = (url) => {
      showAd()
    }

    showAd()
    router?.events?.on('routeChangeComplete', handleRouteChange)
    return () => {
      router?.events?.off('routeChangeComplete', handleRouteChange)
      ads && googleTag?.destroySlots([ads])
      // ads && googleTag?.destroySlots()
    }
  }, [router?.events])

  return (
    // <div className={className || ''} style={style}>
    <div className={`${className || ''} text-center`} id={id} {...rest} />
    // </div>
  )
}
