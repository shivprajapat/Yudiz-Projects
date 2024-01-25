import useTimer from '@shared/hooks/useTimer'
import React, { memo, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import style from './style.module.scss'
import Timer from '@shared/components/match/timer'
import useTranslation from 'next-translate/useTranslation'

function EventTimer({ showTimer, handleHideTimer, data }) {
  const { t } = useTranslation()
  const displayTimer = useMemo(() => showTimer, [showTimer])
  const { timer } = useTimer(data)

  useEffect(() => {
    if (displayTimer) {
      timer.sec < 0 && handleHideTimer()
    }
  }, [timer])

  return (
    <>
      {displayTimer ? <div className={`${style.matchInfo} d-flex text-primary text-center flex-grow-1 p-1 br-md font-semi`}>
        <div className={`${style.countdown} m-auto mt-2 mb-2`}>
          {timer?.sec < 0 ? null : <Timer timer={timer} title={t('common:LiveEventStartsIn')} />}
        </div>
      </div> : null}</>
  )
}

EventTimer.propTypes = {
  showTimer: PropTypes.bool,
  handleHideTimer: PropTypes.func.isRequired,
  data: PropTypes.any
}

export default memo(EventTimer)
