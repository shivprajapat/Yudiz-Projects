import { useAmp } from 'next/amp'

import GoogleAnalyticsAMP from '@shared/components/amp/googleAnalyticsAMP'
import { useEffect } from 'react'
import useOnMouseAndScroll from '@shared/hooks/useOnMouseAndScroll'

function GoogleAnalytics() {
  const isAmp = useAmp()
  const { isLoaded } = useOnMouseAndScroll()

  useEffect(() => {
    if (!isAmp) {
      if (isLoaded) loadGTM()

      function loadGTM() {
        ((w, d, s, l, i) => {
          w[l] = w[l] || []; w[l].push({
            'gtm.start':
              new Date().getTime(),
            event: 'gtm.js'
          }); const f = d.getElementsByTagName(s)[0]
          // eslint-disable-next-line eqeqeq
          const j = d.createElement(s); const dl = l != 'dataLayer' ? '&l=' + l : ''; j.async = true; j.src =
            'https://www.googletagmanager.com/gtm.js?id=' + i + dl; f.parentNode.insertBefore(j, f)
        })(window, document, 'script', 'dataLayer', 'GTM-T8RSSK2')
      }
    }
  }, [isLoaded])

  if (isAmp) {
    return <GoogleAnalyticsAMP />
  } else {
    // return null
    return (
      <>
        {/* <Script strategy="afterInteractive" dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l] = w[l] || [];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-K32S276');`
        }} /> */}
        {/* Google Analytics */}
        {/* <Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`} />
        <Script
          strategy="afterInteractive"
          id="gtag-init"
          type='text/javascript'
          defer
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gtag.GA_TRACKING_ID}');
            `
          }}
        /> */}
        {/* // Facebook pixel */}
        {/* <Script
          strategy="afterInteractive"
          defer
          type='text/javascript'
          dangerouslySetInnerHTML={{
            __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1506336022995127');
            fbq('track', "PageView");
            fbq('track', 'ViewContent');
            `
          }}
        /> */}
        {/* <Script
          strategy="lazyOnload"
          defer
          type='text/javascript'
          dangerouslySetInnerHTML={{
            __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${GTM_ID}');
            `
          }}
        /> */}
      </>
    )
  }
}
export default GoogleAnalytics
// export default GoogleAnalytics
