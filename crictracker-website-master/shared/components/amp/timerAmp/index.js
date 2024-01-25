import React from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import useTranslation from 'next-translate/useTranslation'

const TimerAmp = ({ timer, title }) => {
  const newDate = timer ? new Date(timer).toISOString() : ''
  const { t } = useTranslation()

  return (
    <>
      <style jsx amp-custom>{`
      .matchInfo{padding:4px;border-radius:12px;border:1px solid var(--border-light);color:var(--theme-color-medium)}.matchInfo p{margin-bottom:13px;font-size:16px}.matchInfo .countdown{text-align:center}.matchInfo .countdown h1{margin:4px 0 2px}.matchInfo .countdown h1 span{margin:0px 8px}.matchInfo .countdown p span{flex:1}/*# sourceMappingURL=style.css.map */
     `}
      </style>
      <Head>
        <script async custom-element="amp-date-countdown" src="https://cdn.ampproject.org/v0/amp-date-countdown-0.1.js"></script>
        <script async custom-template="amp-mustache" src="https://cdn.ampproject.org/v0/amp-mustache-0.2.js"></script>
      </Head>
      <amp-date-countdown end-date={newDate} layout="fixed-height" height="140" >
        <template type="amp-mustache">
          <div className='matchInfo d-flex text-center flex-grow-1 font-semi my-2'>
            <div className='countdown m-auto my-2'>
              <p className="mb-0">{title || t('common:MatchStartsIn')}</p>
              <h1 className="d-flex">
                <span>{'{{ dd }}'}</span>:
                <span>{'{{ hh }}'}</span>:
                <span>{'{{ mm }}'}</span>:
                <span>{'{{ ss }}'}</span>
              </h1>
              <p className="d-flex mb-0">
                <span>{t('common:Days')}</span>
                <span>{t('common:Hrs')}</span>
                <span>{t('common:Mins')}</span>
                <span>{t('common:Sec')}</span>
              </p>
            </div>
          </div>

        </template>
      </amp-date-countdown>
    </>
  )
}

TimerAmp.propTypes = {
  timer: PropTypes.number,
  title: PropTypes.string
}

export default TimerAmp
