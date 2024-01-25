import { useEffect, useState } from 'react'

import style from './style.module.scss'
import WhatsApp from '@shared/components/ctIcons/whatsApp'
import { getTimeZone } from '@shared/utils'
import { CT_WHATS_APP_LINK } from '@shared/constants'

function WhatsAppUpdate() {
  const [showBtn, setShowBtn] = useState(false)
  useEffect(() => {
    const tz = getTimeZone()
    setShowBtn(tz === 'Asia/Kolkata' || tz === 'Asia/Calcutta')
  }, [])
  if (showBtn) {
    return (
      <a
        className={`${style?.btn}`}
        target="_blank"
        href={CT_WHATS_APP_LINK}
        rel="noreferrer"
      >
        <WhatsApp />
      </a>
    )
  } else {
    return null
  }
}
export default WhatsAppUpdate
