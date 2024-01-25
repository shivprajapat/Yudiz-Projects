import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import { SSRProvider } from 'react-bootstrap'

// import { REACT_APP_ENV } from '@shared/constants'
import useLayoutApp from '@shared/hooks/useLayoutApp'
import { IS_GLANCE_MLIB, REACT_APP_ENV } from '@shared/constants'

const OnMouseAndScroll = dynamic(() => import('@shared/components/lazyLoad/onMouseAndScroll'))
const LazyLoadScript = dynamic(() => import('@shared/components/lazyLoadScript'))
const StickyAds = dynamic(() => import('@shared/components/ads/sticky'))
const GoogleAnalytics = dynamic(() => import('@shared/components/scripts/googleAnalytics'))
const PopupAds = dynamic(() => import('@shared/components/ads/popup'))
const HVR = dynamic(() => import('@shared/components/ads/hvr'))
const Glance = dynamic(() => import('@shared/components/ads/glance'))
const GlanceSticky = dynamic(() => import('@shared/components/ads/glanceSticky'))
const AppContent = dynamic(() => import('@shared/components/appContent'))
const PushNotification = dynamic(() => import('@shared/components/pushNotification'))
// const Unblockia = dynamic(() => import('@shared/components/ads/unblockia'))
const GlanceMLib = dynamic(() => import('@shared/components/ads/glanceMLib'))
const MLibSticky = dynamic(() => import('@shared/components/ads/glanceMLib/mLibSticky'), { ssr: false })

function AppLayout({ children }) {
  const { isAmp, isStaticPage, isGlanceView, isMobileWebView, isDHView, isGlanceLiveView } = useLayoutApp()

  const AddAdsScript = () => {
    if (!isMobileWebView) {
      if (isGlanceView) {
        if (!IS_GLANCE_MLIB) {
          return (
            <>
              <Glance />
              <GlanceSticky />
            </>
          )
        } else return null
      } else if (!isAmp && !isDHView) {
        return (
          <>
            <OnMouseAndScroll>
              {/* <Unblockia /> */}
              <LazyLoadScript />
              <HVR />
              {(!isStaticPage) && (
                <>
                  <StickyAds />
                  <PopupAds />
                </>
              )}
            </OnMouseAndScroll>
          </>
        )
      } else return null
    } else return null
  }

  return (
    <SSRProvider>
      {REACT_APP_ENV !== 'production' && (
        <OnMouseAndScroll>
          <PushNotification />
        </OnMouseAndScroll>
      )}
      <AddAdsScript />
      {!isMobileWebView && isGlanceView && IS_GLANCE_MLIB && (
        <>
          <GlanceMLib />
          {!isGlanceLiveView && (
            <OnMouseAndScroll>
              <MLibSticky />
            </OnMouseAndScroll>
          )}
        </>
      )}
      {!isMobileWebView && <GoogleAnalytics />}
      {/* {!isMobileWebView && (
        <OnMouseAndScroll>
        </OnMouseAndScroll>
      )} */}
      <AppContent>{children}</AppContent>
    </SSRProvider>
  )
}
AppLayout.propTypes = {
  children: PropTypes.node.isRequired
}
export default AppLayout
