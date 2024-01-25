import { getUserInteraction, setUserInteraction } from '@shared/libs/global-store'
import { useEffect, useState } from 'react'

const useOnMouseAndScroll = () => {
  const isFired = getUserInteraction()
  const [isLoaded, setIsLoaded] = useState(isFired || false)

  useEffect(() => {
    if (!isLoaded) {
      window.addEventListener('mousemove', load, { passive: true })
      window.addEventListener('scroll', load, { passive: true })

      function load() {
        if (isLoaded) return true
        setIsLoaded(true)
        setUserInteraction(true)
        window.removeEventListener('mousemove', load)
        window.removeEventListener('scroll', load)
      }

      return () => {
        window.removeEventListener('mousemove', load)
        window.removeEventListener('scroll', load)
      }
    }
  }, [])

  return {
    isLoaded
  }
}

export default useOnMouseAndScroll
