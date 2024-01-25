import React from 'react'
import PropTypes from 'prop-types'
import styles from './style.module.scss'
import useTranslation from 'next-translate/useTranslation'
import { addLeadingZeros } from '@utils'
import useTimer from '@shared/hooks/useTimer'

const Timer = ({ date }) => {
  const { t } = useTranslation()
  const { timer } = useTimer(date)

  return (
    <div className={`${styles.timer} d-flex align-items-center justify-content-center text-uppercase`}>
        {
            timer?.sec < 0 ? <h1 className="d-flex">{t('common:MatchWillStartSoon')}...</h1> : <>
            <div className={`${styles.time}`}>
                <h3 className="mb-0">{addLeadingZeros(timer?.days)}</h3>
                <p className="mb-0">{t('common:Days')}</p>
            </div>
            <h3 className="mb-0">:</h3>
            <div className={`${styles.time}`}>
                <h3 className="mb-0">{addLeadingZeros(timer?.hours)}</h3>
                <p className="mb-0">{t('common:Hrs')}</p>
            </div>
            <h3 className="mb-0">:</h3>
            <div className={`${styles.time}`}>
                <h3 className="mb-0">{addLeadingZeros(timer?.min)}</h3>
                <p className="mb-0">{t('common:Mins')}</p>
            </div>
        </>
        }
    </div>
  )
}

Timer.propTypes = {
  date: PropTypes.number
}

export default Timer
