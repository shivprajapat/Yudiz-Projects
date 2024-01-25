import { useState } from 'react'

const useTab = () => {
  const [isShowing, setIsShowing] = useState(1)

  const tabActiveClass = (index, className) =>
    isShowing === index ? className : ''

  function toggleTab(index) {
    setIsShowing(index)
  }

  return {
    toggleTab,
    tabActiveClass,
  }
}

export default useTab
