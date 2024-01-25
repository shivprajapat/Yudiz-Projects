import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'

import styles from './style.module.scss'
import useTranslation from 'next-translate/useTranslation'
import Timer from '../timer'
import useTimer from '@shared/hooks/useTimer'

const Header = dynamic(() => import('./header'))

export default function Upcoming({ data, handleTime, showShareBtn }) {
  const { t } = useTranslation()
  // const [disableTime, setDisableTime] = useState(false)
  const { timer } = useTimer(data?.dStartDate)

  useEffect(() => {
    timer.sec < 0 && handleTime()
  }, [timer])
  return (
    <>
      <Header data={data} showShareBtn={showShareBtn} />
      <div className={`${styles.matchInfo} py-2 px-2 px-md-3 px-xl-4 light-bg d-flex text-primary text-center flex-grow-1 font-semi br-md mb-01`}>
        <div className={`${styles.countdown} m-auto mt-sm-1 mb-2`}>
          {timer?.sec < 0 ? <h1 className="d-flex mt-1 mb-01">{t('common:MatchWillStartSoon')}...</h1> : <Timer timer={timer} />}
        </div>
      </div>
    </>
  )
}

Upcoming.propTypes = {
  data: PropTypes.object,
  handleTime: PropTypes.func,
  showShareBtn: PropTypes.bool
}
