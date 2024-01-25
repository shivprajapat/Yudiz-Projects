import React from 'react'
import dynamic from 'next/dynamic'

import styles from './style.module.scss'
import ctIcon from '@assets/images/icon/app-phone.png'
import pattern from '@assets/images/bg-pattern.png'
import appStore from '@assets/images/app-store.svg'
import googlePlay from '@assets/images/google-play.svg'
import { APP_STORE_URL, PLAY_STORE_URL } from '@shared/constants'

const MyImage = dynamic(() => import('@shared/components/myImage'))

const DownloadBanner = () => {
  return (
    <>
      <div className={`${styles.downloadBanner} w-100 d-flex flex-column align-items-center mb-2 mb-md-3 position-relative overflow-hidden text-center br-lg`}>
        <div className={`${styles.ctIcon} overflow-hidden flex-shrink-0`}>
          <MyImage
            src={ctIcon}
            width="32"
            height="61"
            alt="CT"
            layout="responsive"
          />
        </div>
        <div>
          <p className="mx-2">The Infotainment of Cricket with CricTracker App</p>
          <p className="mx-2">Download Now</p>
          <div className="d-flex justify-content-center">
            <a className="mx-1" href={APP_STORE_URL} rel="noreferrer" target="_blank">
              <MyImage
                src={appStore}
                width="96"
                height="32"
                alt="CT"
                layout="fixed"
              />
            </a>
            <a className="mx-1" rel="noreferrer" href={PLAY_STORE_URL} target="_blank">
              <MyImage
                src={googlePlay}
                width="109"
                height="32"
                alt="CT"
                layout="fixed"
              />
            </a>
          </div>
        </div>
        <div className={`${styles.pattern} position-absolute`}>
          <MyImage
            src={pattern}
            width="304"
            height="187"
            alt="CT"
            layout="fixed"
          />
        </div>
      </div >
    </>
  )
}

export default DownloadBanner
