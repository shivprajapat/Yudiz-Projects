import Trans from 'next-translate/Trans'
import { useAmp } from 'next/amp'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { Button } from 'react-bootstrap'
import style from './style.module.scss'

function PopupAds() {
  const [isVisible, setVisible] = useState(false)
  const [timer, setTimer] = useState(10)
  const isAmp = useAmp()
  const router = useRouter()
  const isOpen = useRef(null)
  const interval = useRef(null)
  const id = 'div-ad-gpt-138639789-1664362011-0'
  const desktop = {
    ad: 'Crictracker2022_Desktop_Interstitial_960x490',
    dimension: [[960, 490]]
  }
  const mobile = {
    ad: 'Crictracker2022_Mobile_Interstitial_300x300',
    dimension: [[300, 400], [300, 300]]
  }
  let ads

  useEffect(() => {
    let transition
    const handleRouteChange = () => {
      const gt = window.googletag || { cmd: [] }
      typeof gt?.destroySlots === 'function' && gt?.destroySlots([ads])
      clearTimeout(transition)
      transition = setTimeout(() => {
        showAd(gt)
      }, 4000)
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  useEffect(() => {
    const gt = window.googletag || { cmd: [] }
    showAd(gt)
    return () => {
      ads && gt?.destroySlots([ads])
    }
  }, [])

  function showAd(gTag) {
    gTag.cmd.push(() => {
      if (typeof window !== 'undefined') {
        const width = window.innerWidth
        if (width >= 728) {
          ads = gTag.defineSlot(`/138639789/${desktop?.ad}`, desktop?.dimension, id).addService(gTag.pubads())
          gTag.enableServices()
          // document.getElementById(id).style.minHeight = dimensionDesktop[1] + 'px'
          gTag.display(id)
        } else {
          ads = gTag.defineSlot(`/138639789/${mobile?.ad}`, mobile?.dimension, id).addService(gTag.pubads())
          gTag.enableServices()
          // document.getElementById(id).style.minHeight = dimensionMobile[1] + 'px'
          gTag.display(id)
        }
        gTag.pubads().addEventListener('slotOnload', (event) => {
          if (event.slot.getSlotElementId() === id && !isOpen.current) {
            displayAd()
          }
        })
      }
    })
  }

  function startTimer() {
    interval.current = setInterval(() => {
      setTimer((ti) => {
        if (ti <= 1) {
          clearInterval(interval.current)
          setVisible(false)
          isOpen.current = false
          setTimer(10)
        }
        return ti - 1
      })
    }, 1000)
  }

  function displayAd() {
    setVisible(true)
    isOpen.current = true
    startTimer()
  }

  function handleClose() {
    setTimer(10)
    clearInterval(interval.current)
    setVisible(false)
    isOpen.current = false
  }

  if (isAmp) return null
  return (
    <>
      <div hidden={!isVisible} className={`${style?.popupAd} ${isVisible ? 'd-flex ' : ''}align-items-center justify-content-center`}>
        <div className={style.popupAdInner}>
          <div className={`${style.adHeader} w-100 text-end`}>
            <span className={`${style.count}`}> <Trans i18nKey="common:AdCloseIn" /> - 00:00:{timer > 9 ? timer : `0${timer}`}</span>
            <Button onClick={() => handleClose()} variant="link" className={`${style.closeBtn} btn-close rounded`} />
          </div>
          <div id={id} />
        </div>
      </div>
    </>
    // <>
    //   {/* <Head> */}
    //   {/* <script
    //     // strategy="lazyOnload"
    //     // defer
    //     src="https://www.googletagservices.com/tag/js/gpt.js"
    //   />
    //   <script
    //     dangerouslySetInnerHTML={{
    //       __html: `
    //       var googletag = googletag || {};
    //       googletag.cmd = googletag.cmd || [];
    //       `
    //     }} />
    //   <div id="div-gpt-ad-1662037240348-0" />
    //   <script
    //     dangerouslySetInnerHTML={{
    //       __html: `
    //         googletag.cmd.push(function() {
    //           googletag.defineOutOfPageSlot("/138639789/Crictracker2022_Interstitial_1x1", "div-gpt-ad-1662037240348-0").addService(googletag.pubads());
    //           googletag.enableServices();
    //           googletag.display("div-gpt-ad-1662037240348-0");
    //         });
    //         `
    //     }} /> */}
    //   <script async="async" src="https://www.googletagservices.com/tag/js/gpt.js"></script>
    //   <script>
    //   {`var googletag = googletag || {};
    //   googletag.cmd = googletag.cmd || [];`}
    //   </script>
    //   <div id="div-gpt-ad-1662037240348-0">
    //     <script
    //     dangerouslySetInnerHTML={{
    //       __html: `
    //       googletag.cmd.push(function() {
    //       googletag.defineOutOfPageSlot("/138639789/Crictracker2022_Interstitial_1x1", "div-gpt-ad-1662037240348-0")
    //       .addService(googletag.pubads());
    //       googletag.enableServices();
    //       googletag.display("div-gpt-ad-1662037240348-0");
    //       });
    //       `
    //     }}
    //     />
    //   </div>
    //   {/* </Head> */}
    // </>
  )
}
export default PopupAds
