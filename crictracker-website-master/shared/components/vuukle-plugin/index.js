// import Head from 'next/head'
import Script from 'next/script'

function VuuklePlugin() {
  return (
    <>
      {/* <Head>
        <script
          strategy='lazyOnload'
          dangerouslySetInnerHTML={{
            __html: `
          var VUUKLE_CONFIG = {
            apiKey: "a92e03ed-307c-4beb-b4ae-6d76b84c6466",
          };
          // ⛔️ DON'T EDIT BELOW THIS LINE
          (function() {
            var d = document,
              s = d.createElement('script');
            s.src = 'https://cdn.vuukle.com/platform.js';
            (d.head || d.body).appendChild(s);
          })();
          `
          }}
        />
      </Head> */}
      <div className='mb-2 pt-2' style={{ display: 'flex', flexWrap: 'wrap', backgroundColor: 'var(--theme-bg)', justifyContent: 'center' }}>
        <div id="vuukle-quiz"></div>
        <div id="vuukle-ad-3"></div>
      </div>
      <Script
        strategy='lazyOnload'
        dangerouslySetInnerHTML={{
          __html: `
          var VUUKLE_CONFIG = {
            apiKey: "a92e03ed-307c-4beb-b4ae-6d76b84c6466",
          };
          // ⛔️ DON'T EDIT BELOW THIS LINE
          (function() {
            var d = document,
              s = d.createElement('script');
            s.src = 'https://cdn.vuukle.com/platform.js';
            (d.head || d.body).appendChild(s);
          })();
          `
        }}
      />
    </>
  )
}
export default VuuklePlugin
