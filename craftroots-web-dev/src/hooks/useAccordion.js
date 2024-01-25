import { useState } from 'react'

export default function useAccordion(activeItem) {
  const [activeItemKey, setActiveItemKey] = useState(
    activeItem ? [activeItem] : []
  )
  return {
    activeItemKey,
    setActiveItemKey,
  }
}
