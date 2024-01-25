import Head from 'next/head'
import * as gtag from '@shared-libs/gtag'

function GoogleAnalyticsAMP() {
  return (
    <>
      <Head>
        <script
          async
          custom-element='amp-analytics'
          src="https://cdn.ampproject.org/v0/amp-analytics-0.1.js"
          key="amp-analytics"
        />
      </Head>
      <amp-analytics type="googleanalytics">
        <script
          type="application/json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              vars: {
                account: gtag.GA_TRACKING_ID,
                gtag_id: gtag.GA_TRACKING_ID,
                config: {
                  [gtag.GA_TRACKING_ID]: { groups: 'default' }
                }
              },
              triggers: {
                trackPageview: {
                  on: 'visible',
                  request: 'pageview'
                }
              }
            })
          }}
        />
      </amp-analytics>
      <amp-analytics type="facebookpixel">
        <script
          type="application/json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              vars: {
                pixelId: '1506336022995127'
              },
              triggers: {
                trackPageview: {
                  on: 'visible',
                  request: 'pageview'
                },
                trackViewContent: {
                  on: 'visible',
                  request: 'viewContent'
                }
              }
            })
          }}
        />
      </amp-analytics>
      {/* <amp-pixel src="https://foo.com/tracker/foo" layout="nodisplay"></amp-pixel> */}
      {/* <script
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
    </>
  )
}

export default GoogleAnalyticsAMP
