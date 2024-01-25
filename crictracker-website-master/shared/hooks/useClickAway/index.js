import { useEffect } from 'react'

export default function useClickAway(ref, callbackFn) {
  useEffect(
    () => {
      const listener = (event) => {
        if (!ref.current || (ref.current && ref.current?.contains(event.target))) {
          return
        }
        callbackFn(event)
      }
      document.addEventListener('mousedown', listener)
      document.addEventListener('touchstart', listener)
      return () => {
        document.removeEventListener('mousedown', listener)
        document.removeEventListener('touchstart', listener)
      }
    },
    [ref, callbackFn]
  )
}
