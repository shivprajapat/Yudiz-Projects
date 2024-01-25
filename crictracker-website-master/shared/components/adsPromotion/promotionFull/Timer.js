import React from 'react'
import PropTypes from 'prop-types'
import styles from './style.module.scss'
import useTranslation from 'next-translate/useTranslation'
import { addLeadingZeros } from '@utils'
import useTimer from '@shared/hooks/useTimer'

const Timer = ({ date, isHomePagePromotion }) => {
  const { t } = useTranslation()
  const { timer } = useTimer(date)
  const Tag = isHomePagePromotion ? 'h6' : 'h3'

  return (
    <div className={`${isHomePagePromotion ? styles.timerSmall : styles.timer} d-flex align-items-center justify-content-center text-uppercase`}>
      {
        timer?.sec < 0 ? <h1 className="d-flex">{t('common:MatchWillStartSoon')}...</h1> : <>
          <div className={`${styles.time}`}>
            <Tag className="mb-0">{addLeadingZeros(timer?.days)}</Tag>
            <p className="mb-0">{t('common:Days')}</p>
          </div>
          <Tag className="mb-0">:</Tag>
          <div className={`${styles.time}`}>
            <Tag className="mb-0">{addLeadingZeros(timer?.hours)}</Tag>
            <p className="mb-0">{t('common:Hrs')}</p>
          </div>
          <Tag className="mb-0">:</Tag>
          <div className={`${styles.time}`}>
            <Tag className="mb-0">{addLeadingZeros(timer?.min)}</Tag>
            <p className="mb-0">{t('common:Mins')}</p>
          </div>
          <Tag className="mb-0">:</Tag>
          <div className={`${styles.time}`}>
            <Tag className="mb-0">{addLeadingZeros(timer?.sec)}</Tag>
            <p className="mb-0">{t('common:Sec')}</p>
          </div>
        </>
      }
    </div>
  )
}

Timer.propTypes = {
  date: PropTypes.number,
  isHomePagePromotion: PropTypes.bool
}

export default Timer
