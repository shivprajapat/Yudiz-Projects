import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

import { GLANCE_MOBILE_UNIT_MLIB } from '@shared/constants'
import { parseParams } from '@shared/utils'

function GlanceMLib() {
  const router = useRouter()
  useEffect(() => {
    window.mLibSdk = {
      isReady: false,
      stack: [],
      get value() {
        return this.isReady
      },
      set value(val) {
        this.isReady = val
        if (val) {
          this.stack.forEach(element => {
            element()
          })
        }
        // here you call the code you need
        // this.checkUpdate(this.isReady)
      }
    }
    try {
      const params = parseParams(window.location.search)
      const mobileUnit = GLANCE_MOBILE_UNIT_MLIB[router?.query?.utm_medium || params?.utm_medium]
      const sdkv = getSDVK(params)
      const userId = getUserID(params)
      const init = {
        surface: 'Articles',
        oem: mobileUnit, // Hardcoded for RealMe but can be replaced by other OEM values. Replace RealMe with oemMap[oem] if you are integrating for other OEMs dynamically.
        // mode: 'Test', // Mode needs to be removed from this object. This is for testing purpose only
        app: 'Glance',
        sdkVersion: sdkv, // Capture from the URL as mentioned here.
        userId: userId
        // region: ' <optional>'
      }
      // console.log(initpayload)
      const obj = window.GlanceAdClientInterface.init(init)
      obj?.onSDKInitFailed(() => {
        console.log('mLib sdk failed')
        window.mLibSdk.value = false
      })
      obj?.onSDKInitSuccess((data) => {
        console.log('mLib sdk initialized', data)
        window.mLibSdk.value = true
      })
    } catch (error) {
      console.log('mlib', error)
    }
  }, [])

  function getSDVK(params) {
    const version = router?.query?.sdkv || params?.sdkv || ''
    return (version?.substr(0, 3) / 100)?.toFixed(2)
  }
  function getUserID(params) {
    const id = router?.query?.gl_imp_id || params?.gl_imp_id || ''
    return id?.split(':')[1]
  }

  return (
    <Head>
      <script type="text/javascript" src="https://g.glance-cdn.com/public/content/assets/other/awc.js" />
    </Head>
  )
}
export default GlanceMLib

// url queryParam : &sdkv=8240&gl_imp_id=gl_12345:acajhs6587sd:GlanceId:193827319287
// Amar Kharvi11:30AM
// const urlParams = new URLSearchParams(window.location.search);
// const userId=urlParams.get("gl_imp_id")?.split(":")[1];
