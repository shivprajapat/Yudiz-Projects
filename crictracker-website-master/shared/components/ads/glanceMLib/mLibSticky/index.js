import { useMemo } from 'react'
import useMlib from '@shared/hooks/useMlib'
import style from '../../glanceSticky/style.module.scss'
import { useRouter } from 'next/router'
import { checkGlanceLiveScoreView } from '@shared/utils'

function MLibSticky() {
  const router = useRouter()
  const isGlanceLiveView = checkGlanceLiveScoreView(router)
  const id = useMemo(() => {
    return `glance-mlib-sticky-${new Date().getTime() * ((Math.random() + 1) * 1000)}`
  }, [router?.asPath])

  useMlib({
    adUnitName: isGlanceLiveView ? 'Crictracker_Sportstab_StickySmall_Bottom' : 'Crictracker_English_StickySmall_Bottom',
    placementName: 'StickySmall',
    id: id,
    height: 50,
    width: 320,
    pageName: isGlanceLiveView ? 'Crictracker SportsTab' : 'crictracker.com'
  })
  return (
    <div id={id} data-id={id} className={`${style.stickyAd} bottom-0`} />
  )
}
export default MLibSticky
