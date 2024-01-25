import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Button } from 'react-bootstrap'

import useWindowSize from '@shared/hooks/windowSize'
import ctIcon from '@assets/images/icon/app-phone.png'
import appStore from '@assets/images/app-store.svg'
import googlePlay from '@assets/images/google-play.svg'
import closeIcon from '@assets/images/icon/close-icon.svg'
import { APP_STORE_URL, PLAY_STORE_URL } from '@shared/constants'
import { getCookie, setCookie } from '@shared/utils'
import useOnMouseAndScroll from '@shared/hooks/useOnMouseAndScroll'

const MyImage = dynamic(() => import('@shared/components/myImage'))

const DownloadApp = () => {
  const [width] = useWindowSize()
  const isClosed = Boolean(getCookie('downloadClosed'))
  const { isLoaded } = useOnMouseAndScroll()
  const [loadDownload, setLoadDownload] = useState(false)

  useEffect(() => {
    if (!isClosed && width > 767) {
      if (isLoaded) setLoadDownload(true)
    } else if (!isClosed && width < 767) {
      setLoadDownload(true)
    }
  }, [width, isLoaded])

  useEffect(() => {
    let intervalId
    if (loadDownload) {
      intervalId = setInterval(() => {
        setLoadDownload(false)
      }, 10000)
    }
    return () => {
      clearInterval(intervalId)
    }
  }, [loadDownload])

  function handleClose() {
    setCookie({
      cName: 'downloadClosed',
      cValue: true,
      exDays: 1
    })
    setLoadDownload(false)
  }

  async function handleDownload() {
    const { getMobileOS } = (await import('@shared/utils'))
    if (getMobileOS() === 'iOS') {
      window.open(APP_STORE_URL)
    } else {
      window.open(PLAY_STORE_URL)
    }
  }

  return (
    <>
      {(loadDownload && !isClosed) && (
        <div className="downloadApp w-100 d-flex flex-md-column align-items-center py-2 py-md-4 px-2 px-md-3 start-0 top-0">
          <div className="dp-ctIcon overflow-hidden flex-shrink-0">
            <MyImage
              src={ctIcon}
              width="32"
              height="61"
              alt="CT"
              layout="responsive"
            />
          </div>
          <div>
            <p className="mx-2 my-0 my-md-2">The Infotainment of Cricket with CricTracker App</p>
            <div className="d-none d-md-flex justify-content-center">
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
          <Button className="theme-btn xsmall-btn d-md-none flex-shrink-0 ms-auto" onClick={handleDownload}>Get App</Button>
          <Button variant="link" className="dp-close d-inline-flex position-absolute p-sm-1 ms-2 rounded-circle" onClick={handleClose} >
            <MyImage
              src={closeIcon}
              width="16"
              height="16"
              alt="close"
            />
          </Button>
        </div >
      )}
    </>
  )
}

export default DownloadApp
