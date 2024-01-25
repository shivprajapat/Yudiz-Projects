import { countDownCalculations, dateCheck } from '@shared/utils'
import { useEffect, useState } from 'react'

const useTimer = (date) => {
  const [timer, setTimer] = useState({
    days: '00',
    hours: '00',
    min: '00',
    sec: '00'
  })
  useEffect(() => {
    const intervalId = setInterval(
      () => {
        const startDate = countDownCalculations(dateCheck(date))
        startDate && setTimer(startDate)
      }, 0, 1000
    )
    return () => {
      clearInterval(intervalId)
    }
  }, [date])

  return {
    timer
  }
}

export default useTimer
