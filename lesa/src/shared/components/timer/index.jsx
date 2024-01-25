import React, { useEffect, useState } from 'react'

import PropTypes from 'prop-types'

import { addLeadingZeros, countDownCalculations, dateCheck } from 'shared/utils'

const Timer = ({ date }) => {
  const [timer, setTimer] = useState({
    days: '00',
    hours: '00',
    min: '00',
    sec: '00'
  })
  useEffect(() => {
    const interval = setInterval(
      () => {
        const startDate = countDownCalculations(dateCheck(date))
        startDate && setTimer(startDate)
      },
      0,
      1000
    )
    return () => {
      clearInterval(interval)
    }
  }, [])
  return (
    <>
      {timer?.sec < 0 ? (
        <>00:00:00:00</>
      ) : (
        <>
          {addLeadingZeros(timer?.days)}:{addLeadingZeros(timer?.hours)}:{addLeadingZeros(timer?.min)}:{addLeadingZeros(timer?.sec)}
        </>
      )}
    </>
  )
}
Timer.propTypes = {
  date: PropTypes.number
}
export default Timer
