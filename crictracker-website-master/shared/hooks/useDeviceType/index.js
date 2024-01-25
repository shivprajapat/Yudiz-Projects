import { useEffect, useState } from 'react'

const useDeviceType = () => {
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    setIsTouch((('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)))
  }, [])

  return {
    isTouch
  }
}
export default useDeviceType
