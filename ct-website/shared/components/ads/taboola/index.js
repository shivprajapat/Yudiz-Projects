import React from 'react'
import Head from 'next/head'
import Script from 'next/script'

function TaboolaAds() {
  return (
    <>
      <Head>
        <script
          className='taboola-script'
          dangerouslySetInnerHTML={{
            __html: `
            window._taboola = window._taboola || [];
            _taboola.push({article:'auto'});
            !function (e, f, u, i) {
              if (!document.getElementById(i)){
                e.async = 1;
                e.src = u;
                e.id = i;
                f.parentNode.insertBefore(e, f);
              }
            }(document.createElement('script'),
            document.getElementsByTagName('script')[0],
            '//cdn.taboola.com/libtrc/crictrackertest2/loader.js',
            'tb_loader_script');
            if(window.performance && typeof window.performance.mark == 'function')
              {window.performance.mark('tbl_ic');}
            `
          }}
        />
      </Head>
      <div id="taboola-below-article-thumbnails"></div>
      <Script
        dangerouslySetInnerHTML={{
          __html: `
          window._taboola = window._taboola || [];
          _taboola.push({
            mode: 'thumbnails-a',
            container: 'taboola-below-article-thumbnails',
            placement: 'Below Article Thumbnails',
            target_type: 'mix'
          });
          `
        }}
      />
    </>
  )
}
export default TaboolaAds
