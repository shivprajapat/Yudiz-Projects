import React from 'react'
import App from 'next/app'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'

import '../assets/scss/global.scss'
import { setDeviceInfo, setFooterMenu, setHeaderMenu, setHeaderSidebarMenu } from '@shared/libs/menu'

const AppLayout = dynamic(() => import('@shared/components/layout/app'))

function MyApp({ Component, pageProps, headerMenu, footerMenu, headerSidebarMenu, isAmp, device }) {
  const props = { ...pageProps, isAmp, device }
  setDeviceInfo(device)
  setHeaderMenu(headerMenu)
  setFooterMenu(footerMenu)
  setHeaderSidebarMenu(headerSidebarMenu)

  return (
    <AppLayout>
      <Component {...props} />
    </AppLayout>
  )
}
MyApp.propTypes = {
  Component: PropTypes.any,
  pageProps: PropTypes.any,
  headerMenu: PropTypes.array,
  footerMenu: PropTypes.array,
  headerSidebarMenu: PropTypes.array,
  token: PropTypes.string,
  isMobileWebView: PropTypes.bool,
  isAmp: PropTypes.bool,
  device: PropTypes.object
}

MyApp.getInitialProps = async (appContext) => {
  const userAgent = appContext?.ctx?.req?.headers['user-agent']
  const appProps = await App.getInitialProps(appContext)
  const getDeviceDetail = (await import('@shared/utils')).getDeviceDetail

  const ctTheme = appContext?.ctx?.req?.cookies?.ctTheme
  const isAmp = !!appContext?.router?.query?.amp || appContext?.router?.asPath?.startsWith('/amp/')
  const device = getDeviceDetail(userAgent)
  const isMobileWebView = !!appContext?.router?.query?.isMobileWebView
  const mobileWebViewTheme = appContext?.router?.query?.theme

  const { headerMenuApi, footerMenuApi, headerSidebarMenuApi } = (await import('../shared/libs/commonApi'))
  const [header, footer, headerSidebar] = await Promise.allSettled([headerMenuApi(), footerMenuApi(), headerSidebarMenuApi()])
  return {
    ...appProps,
    headerMenu: header?.value,
    footerMenu: footer?.value,
    headerSidebarMenu: headerSidebar?.value,
    ctTheme,
    isAmp,
    isMobileWebView,
    mobileWebViewTheme,
    device
  }
}

export default MyApp

// export function reportWebVitals(metric) {
//   console.log(metric)
// }
