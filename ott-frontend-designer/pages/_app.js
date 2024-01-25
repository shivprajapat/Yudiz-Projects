import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";
import '../assets/scss/global.scss'
import SSRProvider from 'react-bootstrap/SSRProvider'
import ErrorBoundary from '@/shared/components/errorBoundary';

const AppLayout = dynamic(() => import('../shared/layouts/app'))
function MyApp({ Component, pageProps }) {
  if (Component.getLayout) {
    return Component.getLayout(<Component {...pageProps} />)
  }
  return (
    <SSRProvider>
      <ErrorBoundary>
        <AppLayout>
          <Component {...pageProps} />
        </AppLayout>
      </ErrorBoundary>
    </SSRProvider>
  )
}
MyApp.propTypes = {
  Component: PropTypes.any,
  pageProps: PropTypes.any
}

export default MyApp
