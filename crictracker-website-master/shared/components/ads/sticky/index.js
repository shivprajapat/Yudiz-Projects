import MyImage from '@shared/components/myImage'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import style from './style.module.scss'
import closeIcon from '@assets/images/icon/close-icon.svg'

function StickyAds() {
  const router = useRouter()
  const [isClosed, setClosed] = useState(false)

  function handleClose() {
    setClosed(true)
    document.body.classList.add('stickyAdRemoved')
  }

  useEffect(() => {
    let ads
    const googletag = window.googletag || { cmd: [] }

    const shoAd = () => {
      googletag.cmd.push(() => {
        const width = window.innerWidth
        if (width >= 728) {
          document.getElementById('div-ad-gpt-138639789-1677753137-0').style.display = 'none'
        } else {
          ads = googletag.defineSlot('/138639789/Crictracker2022_Mobile_Sticky_320x50', [[320, 50]], 'div-ad-gpt-138639789-1677753137-0').addService(googletag.pubads())
          document.getElementById('div-ad-gpt-138639789-1677753137-0').style.minHeight = 50 + 'px'
          googletag.enableServices()
          googletag.display('div-ad-gpt-138639789-1677753137-0')
        }
      })
    }

    const handleRouteChange = (url) => {
      setClosed(false)
      document.body.classList.remove('stickyAdRemoved')
      shoAd()
    }

    shoAd()
    router?.events?.on('routeChangeComplete', handleRouteChange)
    return () => {
      router?.events?.off('routeChangeComplete', handleRouteChange)
      ads && googletag?.destroySlots([ads])
      // ads && googletag?.destroySlots()
    }
  }, [router?.events])

  if (isClosed) return null
  return (
    <div className={`${style?.sticky} d-md-none text-center c-transition start-0 end-0 position-fixed`}>
      <button className={`${style.closebtn} position-absolute border-0 mt-n2 me-3 end-0 br-xs`} onClick={handleClose}>
        <MyImage src={closeIcon} alt="Close" layout="responsive" />
      </button>
      <div id="div-ad-gpt-138639789-1677753137-0" />
    </div>
  )
  // return (
  //   <Script
  //     type='text/javascript'
  //     strategy="lazyOnload"
  //     defer
  //     dangerouslySetInnerHTML={{
  //       __html: '!function(c,b){"use strict";window.googletag=window.top.googletag||{},window.googletag.cmd=window.top.googletag.cmd||[],window.ifCalled=!1;var d=!1,e={dsk:{c:"/138639789/Crictracker2022_Desktop_Sticky_728x90",i:g(2)+g(10),w:728,h:90},mob:{c:"/138639789/Crictracker2022_Mobile_Sticky_320x50",i:g(2)+g(10),w:320,h:50}};function f(a){var c="readyState",d="attachEvent";"interactive"===b[c]||"complete"===b[c]?a():b[d]?b[d]("onreadystatechange",a):b.addEventListener("readystatechange",a)}function g(d,e){var b="",a="";a=1==e?"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ":"0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";for(var c=d;c>0;--c)b+=a[Math.floor(Math.random()*a.length)];return b}function h(){if(!1===ifCalled){ifCalled=!0,b.getElementById("stickyunit")&&b.getElementById("stickyunit").remove();var f,h,a,k,i,g=e.dsk,q=[],r=[],l=100,j=15,m=3;c.screen.width>800?(g=e.dsk,i=1,j=6):((g=e.mob).h<=50&&(l=62),i=.8,m=2,d=!0,j=2);var n=c.screen.width/2-g.w/2,o=n+g.w,p=g.h;(f=b.createElement("div")).id="stickyunit",f.style.position="fixed",f.style.bottom="0px",f.style.height=l+j+"px",f.style.width="100%",f.style.backgroundColor="rgba(242,242,242,0.3)",f.style.justifyContent="center",f.style.display="none",(h=b.createElement("div")).id=g.i,h.className=g.i,h.style.zIndex="50",h.style.position="fixed",h.style.left=n+"px",h.style.bottom="0px",h.style.height=g.h,console.log(g.h),h.style.width=g.w,(a=b.createElement("span")).innerHTML="&#x274E;",a.style.display="none",a.title="Close",!0===d?a.style.right="0px":a.style.left=o+"px",i>0&&(a.style.fontSize=i+"em"),a.style.cursor="pointer",a.style.bottom=0+p-m+"px",a.style.fontWeight="bolder",a.style.color="black",a.style.position="fixed",a.onclick=function(){b.getElementById("stickyunit").style.display="none",null!=r[0]&&googletag.destroySlots(r[0]),f.remove(),h.remove(),a.remove()},k=b.body,f.appendChild(a),f.appendChild(h),k.appendChild(f),googletag.cmd.push(function(){var b=googletag.defineSlot(g.c,[g.w,g.h],g.i).addService(googletag.pubads());q.push(g.i),r.push(b),googletag.enableServices(),googletag.display(g.i),f.style.display="block",a.style.display="block",googletag.pubads().isInitialLoadDisabled()&& -1==googletag.pubads().refresh.toString().indexOf("refresh:")&&(console.log("od : load was disabled"),googletag.pubads().refresh([b]))})}}try{if(void 0!==googletag&& void 0===googletag.apiReady){var a=document.createElement("script");a.onload=function(){googletag.cmd.push(function(){f(h)})},a.src="https://securepubads.g.doubleclick.net/tag/js/gpt.js",a.async=!0,b.head.appendChild(a)}else googletag.cmd.push(function(){f(h)})}catch(i){}}(window.top,window.top.document)'
  //     }}>
  //   </Script>
  // )
}
export default StickyAds
