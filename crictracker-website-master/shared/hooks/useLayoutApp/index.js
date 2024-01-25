import { useRouter } from 'next/router'
import { useAmp } from 'next/amp'

import { staticPages } from '@shared/constants/staticPages'
import { checkGlanceLiveScoreView, checkIsGlanceView } from '@shared/utils'
import { setToken } from '@shared/libs/token'

const useLayoutApp = () => {
  const router = useRouter()
  const isAmp = useAmp()
  // const isStaticPage = staticPages.includes(router.asPath)
  const isStaticPage = staticPages.some((path) => router.asPath.startsWith(path))
  const isMobileWebView = router?.query?.isMobileWebView
  const isGlanceView = checkIsGlanceView(router?.query)
  const isDHView = router?.asPath?.includes('dailyhunt')
  const isGlanceLiveView = checkGlanceLiveScoreView(router)
  const token = router?.query?.token
  if (isMobileWebView && token && token !== 'null') setToken(token)

  return {
    isAmp,
    isStaticPage,
    isGlanceView,
    isMobileWebView,
    isDHView,
    isGlanceLiveView
  }
}
export default useLayoutApp
