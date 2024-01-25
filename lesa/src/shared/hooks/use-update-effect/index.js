import { useEffect } from 'react'

import { useFirstRender } from '../use-first-render'

export function useUpdateEffect(effect, deps) {
  const isFirstRender = useFirstRender()

  useEffect(() => {
    if (!isFirstRender) return effect()
  }, deps)
}
