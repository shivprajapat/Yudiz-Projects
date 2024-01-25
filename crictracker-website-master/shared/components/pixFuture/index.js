import React, { useEffect } from 'react'
import { useAmp } from 'next/amp'

import Head from 'next/head'
import { REACT_APP_ENV } from '@shared/constants'

function PixFuture() {
  const isAmp = useAmp()

  function addScript() {
    if (document) {
      const position = document.getElementById('pix-story')
      const script = document.createElement('script')
      script.src = 'https://cdn.pixfuture.com/cw/load-widget.js'
      script.async = true
      script.setAttribute('pixid', '3173x23')
      script.setAttribute('init', 'pxft-main')
      position?.appendChild(script)
    }
  }

  useEffect(() => {
    !isAmp && addScript()
    return () => {
      window.pixId_pxft = null
    }
  }, [])

  if (isAmp) {
    if (REACT_APP_ENV === 'production') {
      return null
    } else {
      return (
        <>
          {/* For amp this code is not useFull check below variable */}
          <Head>
            <script async src="https://cdn.ampproject.org/v0.js"></script>
            <script async custom-element="amp-story-player" src="https://cdn.ampproject.org/v0/amp-story-player-0.1.js"></script>
          </Head>
          <div style={{ textAlign: 'center' }}>
            <amp-story-player id="pix-player" width="336" height="280" className="mb-2">
              <a href="https://served-by.pixfuture.com/www/delivery/cw/amp/gcws.php?affid=3173&wid=23&w=360&h=640"></a>
            </amp-story-player>
          </div>
        </>
      )
    }
  } else {
    return (
      // <script async pixid="3173x23" src="https://cdn.pixfuture.com/cw/load-widget.js" init="pxft-main" />
      <div id='pix-story' className='mb-2 position-relative' style={{ zIndex: 1 }} />
    )
  }
}

export default PixFuture

export const pixFutureAMPString = {
  string: `
  <div style="text-align: center;">
    <amp-story-player id="pix-player" width="336" height="280" class="mb-2">
      <a href="https://served-by.pixfuture.com/www/delivery/cw/amp/gcws.php?affid=3173&wid=23&w=360&h=640"></a>
    </amp-story-player>
  </div>
`,
  script: `
    <script async src="https://cdn.ampproject.org/v0.js"></script>
    <script async custom-element="amp-story-player" src="https://cdn.ampproject.org/v0/amp-story-player-0.1.js"></script>
  `
}
