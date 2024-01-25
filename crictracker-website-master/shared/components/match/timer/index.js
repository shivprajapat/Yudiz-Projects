import React from 'react'
import PropTypes from 'prop-types'

import useTranslation from 'next-translate/useTranslation'
import { addLeadingZeros } from '@utils'

const Timer = ({ timer, title }) => {
  const { t } = useTranslation()

  return (
    <>
      <p className="mb-0">{title || t('common:MatchStartsIn')}</p>
      <h1 className="d-flex mt-1 mb-01">
        <span className="mx-2">{addLeadingZeros(timer?.days)}</span>:<span className="mx-2">{addLeadingZeros(timer?.hours)}</span>:<span className="mx-2">{addLeadingZeros(timer?.min)}</span>:
        <span className="mx-2">{addLeadingZeros(timer?.sec)}</span>
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
  timer: PropTypes.object,
  title: PropTypes.string
}

export default Timer
