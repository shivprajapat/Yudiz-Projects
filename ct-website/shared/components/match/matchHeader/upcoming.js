import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'

import styles from './style.module.scss'
import useTranslation from 'next-translate/useTranslation'
import Timer from '../timer'
import useTimer from '@shared/hooks/useTimer'

const Header = dynamic(() => import('./header'))
export default function Upcoming({ data, handleTime }) {
  const { t } = useTranslation()
  // const [disableTime, setDisableTime] = useState(false)
  const { timer } = useTimer(data?.dStartDate)

  useEffect(() => {
    timer.sec < 0 && handleTime()
  }, [timer])
  return (
    <>
      <Header data={data} />
      <section className={`${styles.matchHeader}`}>
        <div className={`${styles.matchInfo} d-flex text-primary text-center flex-grow-1 font-semi`}>
          <div className={`${styles.countdown} m-auto mt-2 mb-2`}>
            {timer?.sec < 0 ? <h1 className="d-flex">{t('common:MatchWillStartSoon')}...</h1> : <Timer timer={timer} />}
          </div>
        </div>
      </section>
    </>
  )
}

Upcoming.propTypes = {
  data: PropTypes.object,
  handleTime: PropTypes.func
}
