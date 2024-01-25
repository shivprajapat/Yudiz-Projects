import { useAmp } from 'next/amp'
// import Head from 'next/head'
// import Script from 'next/script'
// import { useEffect } from 'react'

function PopupAds() {
  const isAmp = useAmp()

  if (isAmp) return null

  // useEffect(() => {
  //   const gt = window.googletag || { cmd: [] }
  //   gt.cmd.push(() => {
  //     console.log('Lazy')
  //     gt.defineOutOfPageSlot('/138639789/Crictracker2022_Interstitial_1x1', 'div-gpt-ad-1662037240348-0').addService(gt.pubads())
  //     gt.enableServices()
  //     gt.display('div-gpt-ad-1662037240348-0')
  //   })
  // }, [])

  return (
    <>
      {/* <Head> */}
      {/* <script
        // strategy="lazyOnload"
        // defer
        src="https://www.googletagservices.com/tag/js/gpt.js"
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
          var googletag = googletag || {};
          googletag.cmd = googletag.cmd || [];
          `
        }} />
      <div id="div-gpt-ad-1662037240348-0" />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            googletag.cmd.push(function() {
              googletag.defineOutOfPageSlot("/138639789/Crictracker2022_Interstitial_1x1", "div-gpt-ad-1662037240348-0").addService(googletag.pubads());
              googletag.enableServices();
              googletag.display("div-gpt-ad-1662037240348-0");
            });
            `
        }} /> */}
      <script async="async" src="https://www.googletagservices.com/tag/js/gpt.js"></script>
      <script>
      {`var googletag = googletag || {};
      googletag.cmd = googletag.cmd || [];`}
      </script>
      <div id="div-gpt-ad-1662037240348-0">
        <script
        dangerouslySetInnerHTML={{
          __html: `
          googletag.cmd.push(function() {
          googletag.defineOutOfPageSlot("/138639789/Crictracker2022_Interstitial_1x1", "div-gpt-ad-1662037240348-0")
          .addService(googletag.pubads());
          googletag.enableServices();
          googletag.display("div-gpt-ad-1662037240348-0");
          });
          `
        }}
        />
      </div>
      {/* </Head> */}
    </>
  )
}
export default PopupAds
