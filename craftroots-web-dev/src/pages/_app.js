import { useEffect } from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import { Provider } from 'react-redux'
import App from 'next/app'
import { IntlProvider } from 'react-intl'
import { useRouter } from 'next/router'
import en from '../lang/en.json'
import store from '@/store'
import '@/styles/globals.css'
import { storeConfigData } from '@/helper'
import { allRoutes } from '@/constants/allRoutes'
import 'nprogress/nprogress.css' //styles of nprogress

const Layout = dynamic(() => import('@/components/Layout'))

const messages = {
  en,
}

function getDirection(locale) {
  if (locale === 'ar') {
    return 'rtl'
  }
  return 'ltr'
}

export default function MyApp({ Component, pageProps, storeConfig, error }) {
  const { locale, push } = useRouter()
  useEffect(() => {
    if (error) {
      push(
        {
          pathname: allRoutes.underMaintenance,
          query: { inMaintenance: true },
        },
        allRoutes.underMaintenance
      )
    }
  }, [error])

  return error ? null : (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <Provider store={store}>
        <Layout storeConfig={storeConfig}>
          <Component {...pageProps} dir={getDirection(locale)} />
        </Layout>
      </Provider>
    </IntlProvider>
  )
}

MyApp.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext)
  if (appContext.router.pathname === allRoutes.underMaintenance) {
    return { ...appProps }
  }
  try {
    const { storeConfig } = await storeConfigData({ onlyStoreConfig: true })
    return { storeConfig }
  } catch (error) {
    return { error }
  }
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object,
  storeConfig: PropTypes.object,
  error: PropTypes.object,
}
