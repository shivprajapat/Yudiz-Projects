import { useEffect, useRef, useState } from 'react'
function useOnScreen(ref, once = false) {
  const [isIntersecting, setIntersecting] = useState(false)
  const observer = useRef(null)

  useEffect(() => {
    if (!observer.current)
      observer.current = new IntersectionObserver(([entry]) => {
        setIntersecting(entry.isIntersecting)
      })
  }, [])

  useEffect(() => {
    if (ref.current && observer.current) {
      if (once && isIntersecting) {
        observer.current.unobserve(ref.current)
      } else {
        observer.current.observe(ref.current)
      }
    }
  }, [isIntersecting, once])

  return isIntersecting
}

export default useOnScreen
