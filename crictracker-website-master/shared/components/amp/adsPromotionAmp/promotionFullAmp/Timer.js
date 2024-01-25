import React from 'react'
import PropTypes from 'prop-types'
// import useTranslation from 'next-translate/useTranslation'
// import { addLeadingZeros } from '@utils'
// import useTimer from '@shared/hooks/useTimer'
import Head from 'next/head'

const Timer = ({ date }) => {
  const newDate = new Date(date).toISOString()

  return (
    <>
      <style jsx amp-custom>
        {`
        .timer-containter{font-size: 10px; line-height: 14px; font-weight: 400; letter-spacing: 0.2px; gap: 8px}
`}
      </style>
      <Head>
        <script async custom-element="amp-date-countdown" src="https://cdn.ampproject.org/v0/amp-date-countdown-0.1.js"></script>
        <script async custom-template="amp-mustache" src="https://cdn.ampproject.org/v0/amp-mustache-0.2.js"></script>
      </Head>
      <div className='d-flex align-items-center justify-content-center text-uppercase'>
        <amp-date-countdown end-date={newDate} layout="fixed-height" height="60" className="d-flex align-items-center justify-content-center">
          <template type="amp-mustache">
            <div className="timer-containter d-flex align-items-center justify-content-center">
              <div className="d-flex flex-column align-items-center">
                <h3 className="mb-0">{'{{ d }}'}</h3>
                <div>DAYS</div>
              </div>
              <h3 className="mb-0">:</h3>
              <div className="d-flex flex-column align-items-center">
                <h3 className="mb-0">{'{{ h }}'}</h3>
                <div>HOURS</div>
              </div>
              <h3 className="mb-0">:</h3>
              <div className="d-flex flex-column align-items-center">
                <h3 className="mb-0">{'{{ m }}'}</h3>
                <div>MINS</div>
              </div>
              <h3 className="mb-0">:</h3>
              <div className="d-flex flex-column align-items-center">
                <h3 className="mb-0">{'{{ s }}'}</h3>
                <div>SECS</div>
              </div></div>
          </template>
        </amp-date-countdown>
      </div>
    </>
  )
}

Timer.propTypes = {
  date: PropTypes.number,
  isHomePagePromotion: PropTypes.bool
}

export default Timer
