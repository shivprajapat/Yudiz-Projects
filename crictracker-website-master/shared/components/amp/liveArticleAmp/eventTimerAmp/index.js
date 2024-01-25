
import React from 'react'
import PropTypes from 'prop-types'
import TimerAmp from '@shared/components/amp/timerAmp'
import useTranslation from 'next-translate/useTranslation'

function EventTimerAmp({ data }) {
  const { t } = useTranslation()
  const currentTime = new Date().getTime()

  return (
    <>
      {data < currentTime ? null : <TimerAmp timer={data} title={t('common:LiveEventStartsIn')} />}
    </>
  )
}

EventTimerAmp.propTypes = {
  data: PropTypes.any
}

export default EventTimerAmp
