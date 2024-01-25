import { useAmp } from 'next/amp'
// import * as gtag from '@shared-libs/gtag'
// import { GTM_ID } from '@shared-libs/gtm'
// import Script from 'next/script'

function GoogleTags() {
  const isAmp = useAmp()
  return (
    <>
      {!isAmp && (
        <>
          {/* <script defer src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"></script> */}
          {/* <link rel="dns-prefetch" href="https://cdn4-hbs.affinitymatrix.com" />
          <link rel="preconnect" href="https://cdn4-hbs.affinitymatrix.com" />
          <script defer dangerouslySetInnerHTML={{
            __html: '(function(){var o=\'script\',s=top.document,a=s.createElement(o),m=s.getElementsByTagName(o)[0],d=new Date(),t=\'\'+d.getDate()+d.getMonth()+d.getHours();a.async=1;a.id="affhbinv";a.className="v3_top_cdn";a.src=\'https://cdn4-hbs.affinitymatrix.com/hbcnf/crictracker.com/\'+t+\'/affhb.data.js?t=\'+t;m.parentNode.insertBefore(a,m)})()'
          }}>
          </script>
          <script defer dangerouslySetInnerHTML={{
            __html: `(function(){function LS() { var o = 'script', s = top.document, a = s.createElement(o), m = s.getElementsByTagName(o)[0], p = location.protocol, t = "https:" == p ? "s" : "", d = new Date(), u = p + '//hb' + t + '.ph.affinity.com/v5/crictracker.com/inparaHVR.php?t=' + d.getDate() + d.getMonth() + d.getHours(); a.async = 1; a.src = u; m.parentNode.insertBefore(a, m) }
            try{if(!top.__aff_rssing){LS()}}catch(e){ }})()`
          }}>
          </script>
          <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7785168419440214" crossOrigin="anonymous"></script> */}

          <script>
            {'var googletag = googletag || {}; googletag.cmd = googletag.cmd || [];'}
          </script>
          <script
            dangerouslySetInnerHTML={{
              __html: '(function(){ window._taboola = window._taboola || []; _taboola.push({flush: true}); })()'
            }}
          />
          {/* // HVR Script */}
          {/* <script
            dangerouslySetInnerHTML={{
              __html: `
              (function(){var o='script',s=top.document,a=s.createElement(o),m=s.getElementsByTagName(o)[0],d=new Date(),timestamp=""+d.getDate()+d.getMonth()+d.getHours();a.async=1;a.src='https://cdn4-hbs.affinitymatrix.com/hvrcnf/crictracker.com/'+ timestamp + '/index?t='+timestamp;m.parentNode.insertBefore(a,m)})();
              `
            }}>
          </script> */}
        </>
      )}
    </>
  )
}
export default GoogleTags
