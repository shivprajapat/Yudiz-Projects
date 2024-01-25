import React from 'react'

import { APP_STORE_URL, PLAY_STORE_URL } from '@shared/constants'

const DownloadAppAMP = () => {
  return (
    <>
      {/* // do not replace css directly */}
      <style jsx amp-custom>{`
      .downloadApp{padding:18px 12px;background:#23272e}.downloadApp p{color:#fff}.close{background:transparent;border:none;outline:none;-webkit-filter:brightness(0) invert(1);filter:brightness(0) invert(1)}.ctIcon{width:22px;border-radius:4px;overflow:hidden;-webkit-flex-shrink:0;flex-shrink:0}/*# sourceMappingURL=style.css.map */
      .select{-webkit-appearance: none; -moz-appearance: none; appearance: none;}
      `}</style>
      <div id="downloadApp" className="downloadApp d-flex align-items-center bg-dark">
        <button on="tap:downloadApp.hide" className="close d-inline-flex me-2">
          <amp-img
            src="/static/close-icon.svg"
            width="20"
            height="20"
            alt="close"
            layout="fixed"
          ></amp-img>
        </button>
        <div className="ctIcon">
          <amp-img
            src="/static/app-phone.png"
            width="32"
            height="61"
            alt="CT"
            layout="responsive"
          ></amp-img>
        </div>
        <div>
          <p className="text-light mb-0 mx-2">The Infotainment of Cricket with CricTracker App</p>
        </div>
        {/* <div dangerouslySetInnerHTML={{ __html: '<a class="cta" [href]="url" />asd</a>' }} ></div> */}
        <select className='ms-auto theme-btn select' on="change:AMP.navigateTo(url=event.value, target=_blank)">
          <option disabled selected>Get App</option>
          <option value={APP_STORE_URL}>IOS</option>
          <option value={PLAY_STORE_URL}>Android</option>
        </select>
        {/* <button id="getApp" on="tap:AMP.navigateTo(url=https://www.google.com/)" className="theme-btn xsmall-btn flex-shrink-0 ms-auto">Get App</button> */}
      </div>
    </>
  )
}

export default DownloadAppAMP
