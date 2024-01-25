import { useState, useEffect, useRef } from 'react'

const useOnScreen = (props) => {
  const [isIntersecting, setIntersecting] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        entry.isIntersecting && setIntersecting(entry.isIntersecting)
        // observer.unobserve(ref.current)
      },
      {
        rootMargin: props?.rootMargin || '0px'
      }
    )
    if (ref.current) {
      observer.observe(ref.current)
    }
    return () => {
      if (observer) {
        observer.disconnect()
        ref.current && observer.unobserve(ref.current)
      }
      ref.current = null
    }
  }, [])

  function observe(ele) {
    ref.current = ele
  }

  return { inView: isIntersecting, observe }
}
export default useOnScreen
