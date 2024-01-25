import React, { useEffect } from 'react'
import App from 'next/app'
import PropTypes from 'prop-types'
import MyApolloProvider from '../graphql'
import dynamic from 'next/dynamic'
import SSRProvider from 'react-bootstrap/SSRProvider'
import { useRouter } from 'next/router'

import '../assets/scss/global.scss'
import { ToastrContext } from '@shared/components/toastr'
import { setFooterMenu, setHeaderMenu, setHeaderSidebarMenu, setToken } from '../shared/libs/menu'
import { GlobalEventsContext } from '@shared/components/global-events'
import useApp from '@shared/hooks/useApp'
import ErrorBoundary from '@shared/components/errorBoundary'
import { staticPages } from '@shared/constants/staticPages'
import { removeSlot } from '@shared/libs/ads'
import { clearCookie, hasMobileWebView } from '@shared/utils'

const LazyLoad = dynamic(() => import('@shared/components/lazyLoad'))
const LazyLoadScript = dynamic(() => import('@shared/components/lazyLoadScript'))
const MainHeader = dynamic(() => import('@shared/components/header'))
const Footer = dynamic(() => import('@shared/components/footer'))
const StickyAds = dynamic(() => import('@shared/components/ads/sticky'))
const GoogleAnalytics = dynamic(() => import('@shared/components/scripts/googleAnalytics'))
const PopupAds = dynamic(() => import('@shared/components/ads/popup'))
const HVR = dynamic(() => import('@shared/components/ads/hvr'))
const Toastr = dynamic(() => import('@shared/components/toastr').then(m => m.Toastr))

function MyApp({ Component, pageProps, headerMenu, footerMenu, headerSidebarMenu, token, isMobileWebView }) {
  const { isAmp, isPreview, stateGlobalEvents, dispatchGlobalEvents, state, dispatch } = useApp()
  setHeaderMenu(headerMenu)
  setFooterMenu(footerMenu)
  setHeaderSidebarMenu(headerSidebarMenu)
  const router = useRouter()
  const isStaticPage = staticPages.includes(router.asPath)

  useEffect(() => {
    if (isMobileWebView) {
      token || token !== 'null' || token !== 'undefined' || token !== null || token !== undefined ? setToken(token) : clearCookie()
    }
  }, [token])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      isStaticPage && removeSlot()
      const adElement = document.getElementById('stickyunit')
      if (isStaticPage && adElement) {
        document.getElementById('stickyunit').style.display = 'none'
      }
    }
  }, [isStaticPage])

  return (
    <SSRProvider>
      {(!isAmp) && (
        <>
          <LazyLoad>
            <LazyLoadScript />
            <HVR />
            {!isStaticPage && (
              <>
                <StickyAds />
                <PopupAds />
              </>
            )}
          </LazyLoad>
        </>
      )}
      <GoogleAnalytics />
      <ErrorBoundary>
        <GlobalEventsContext.Provider value={{ stateGlobalEvents, dispatchGlobalEvents }} >
          <ToastrContext.Provider value={{ state, dispatch }} >
            <MyApolloProvider dispatch={dispatch}>
              {!isAmp && !isPreview && <MainHeader />}
              <Component {...pageProps} />
              {!isAmp && !isPreview && <Footer />}
            </MyApolloProvider>
            {state.message && <Toastr type={state.type} msg={state.message} btnTxt={state.btnTxt} />}
          </ToastrContext.Provider>
        </GlobalEventsContext.Provider>
      </ErrorBoundary>
    </SSRProvider>
  )
}
MyApp.propTypes = {
  Component: PropTypes.any,
  pageProps: PropTypes.any,
  headerMenu: PropTypes.array,
  footerMenu: PropTypes.array,
  headerSidebarMenu: PropTypes.array,
  token: PropTypes.string,
  isMobileWebView: PropTypes.bool
}

MyApp.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext)
  const { token, isMobileWebView } = hasMobileWebView(appContext?.ctx?.req, appContext?.ctx?.query)
  try {
    const headerApi = (await import('../shared/libs/commonApi')).headerMenuApi
    const footerApi = (await import('../shared/libs/commonApi')).footerMenuApi
    const headerSidebarApi = (await import('../shared/libs/commonApi')).headerSidebarMenuApi
    const header = await headerApi()
    const footer = await footerApi()
    const headerSidebar = await headerSidebarApi()
    return { ...appProps, headerMenu: header, footerMenu: footer, headerSidebarMenu: headerSidebar, token: token, isMobileWebView: isMobileWebView }
  } catch (e) {
    console.error(e)
    return { ...appProps, headerMenu: [], footerMenu: [], headerSidebarMenu: [], token: token, isMobileWebView: isMobileWebView }
  }
}

export default MyApp
