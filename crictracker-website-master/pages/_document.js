import Document, { Html, Head, Main, NextScript } from 'next/document'
import GoogleTags from '@shared-components/googleTags'
import { DOMAIN, REACT_APP_ENV } from '@shared/constants'
// import PopupAds from '@shared/components/ads/popup'
class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    const pageProps = this.props?.__NEXT_DATA__?.props
    const themeMode = pageProps?.isMobileWebView ? pageProps?.mobileWebViewTheme || pageProps?.ctTheme : pageProps?.ctTheme
    return (
      <Html>
        <Head>
          {!pageProps?.isAmp && !pageProps?.isMobileWebView && (
            <script dangerouslySetInnerHTML={
              {
                __html: `
                (function () {
                  function setMode() {
                    const theme = window?.localStorage?.getItem("ct-theme") || 'dark'
                    if (theme === "dark") {
                      // console.log({theme}, document.body)
                      window.isDark = true
                      document?.body?.setAttribute('data-mode', 'dark')
                    } else {
                      window.isDark = false
                      document?.body?.setAttribute('data-mode', 'light')
                    }
                  }
                  document.addEventListener("DOMContentLoaded", () => {
                    setMode()
                  });
                  setMode()
                })()
                `
              }
            } />
          )}
          {REACT_APP_ENV !== 'production' && (
            <>
              <meta name="robots" content="noindex" />
              <meta name="robots" content="nofollow" />
            </>
          )}
          <meta name="theme-color" content="#045de9" />
          {/* <meta name="apple-itunes-app" content="app-id=6443913175" /> */}
          <link rel="manifest" href="/manifest.json" />
          <link rel="apple-touch-icon" sizes="180x180" href={`${DOMAIN}images/icons/apple-touch-icon.png`} />
          <link rel="icon" type="image/png" sizes="32x32" href={`${DOMAIN}images/icons/favicon-32x32.png`} />
          <link rel="icon" type="image/png" sizes="16x16" href={`${DOMAIN}images/icons/favicon-16x16.png`} />
          {/* <link rel="manifest" href={`${DOMAIN}images/icons/site.webmanifest`} /> */}
          <GoogleTags />
        </Head>
        <body
          id='body'
          data-mode={themeMode}
        >
          <noscript>
            <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-T8RSSK2" height="0" width="0" style={{ display: 'none', visibility: 'hidden' }} />
          </noscript>

          {/* <div id="inner-body" style={{ height: '100vh', overflow: 'auto' }}> */}
          <noscript>
            <img height="1" width="1" style={{ display: 'none' }}
              src="https://www.facebook.com/tr?id=1506336022995127&ev=PageView&noscript=1"
              alt='Facebook'
            />
          </noscript>
          {/* <PopupAds /> */}
          {/* <noscript>
            <iframe src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`} height="0" width="0" style={{ display: 'none', visibility: 'hidden' }}></iframe>
          </noscript> */}
          <Main />
          <NextScript />
          {/* </div> */}
        </body>
      </Html>
    )
  }
}

export default MyDocument
