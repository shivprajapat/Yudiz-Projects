import React from 'react'
import PropTypes from 'prop-types'

import useTranslation from 'next-translate/useTranslation'
import { addLeadingZeros } from '@utils'

const Timer = ({ timer }) => {
  const { t } = useTranslation()

  return (
    <>
      <p className="mb-0">{t('common:MatchStartsIn')}</p>
      <h1 className="d-flex">
        <span>{addLeadingZeros(timer?.days)}</span>:<span>{addLeadingZeros(timer?.hours)}</span>:<span>{addLeadingZeros(timer?.min)}</span>:
        <span>{addLeadingZeros(timer?.sec)}</span>
      </h1>
      <p className="d-flex mb-0">
        <span>{t('common:Days')}</span>
        <span>{t('common:Hrs')}</span>
        <span>{t('common:Mins')}</span>
        <span>{t('common:Sec')}</span>
      </p>
    </>
  )
}

Timer.propTypes = {
  timer: PropTypes.object
}

export default Timer
