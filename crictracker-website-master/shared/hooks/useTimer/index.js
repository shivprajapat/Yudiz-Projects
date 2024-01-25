import { countDownCalculations, dateCheck } from '@shared/utils'
import { useEffect, useState } from 'react'

const useTimer = (date, interval = 1000) => {
  const [timer, setTimer] = useState(date ? countDownCalculations(dateCheck(date)) : {
    days: '00',
    hours: '00',
    min: '00',
    sec: '00'
  })
  useEffect(() => {
    const intervalId = setInterval(() => {
      const startDate = countDownCalculations(dateCheck(date))
      startDate && setTimer(startDate)
    }, interval)
    return () => {
      clearInterval(intervalId)
    }
  }, [date])

  return {
    timer
  }
}

export default useTimer
