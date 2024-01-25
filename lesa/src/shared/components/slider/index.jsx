import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'

import './style.scss'

const Slider = ({ children, gap = 15, nav }) => {
  const [btn, setBtn] = useState({ next: nav, prev: false })
  const ref = useRef()

  const handleNext = () => {
    ref.current.scrollLeft += getItemWidth()
  }

  const handlePrev = () => {
    ref.current.scrollLeft -= getItemWidth()
  }

  const handleScroll = ({ target }) => {
    if (nav) {
      const scrollPosition = ref.current?.scrollWidth - ref.current.clientWidth
      setBtn({ next: scrollPosition !== target.scrollLeft, prev: target.scrollLeft > 0 })
    }
  }

  const getItemWidth = () => ref?.current?.childNodes[0]?.clientWidth + gap

  useEffect(() => {
    const slider = ref.current
    let isDown = false
    let startX
    let scrollLeft

    slider.addEventListener('mousedown', (e) => {
      isDown = true
      slider.classList.add('active')
      startX = e.pageX - slider.offsetLeft
      scrollLeft = slider.scrollLeft
    })
    slider.addEventListener('mouseleave', () => {
      isDown = false
      slider.classList.remove('active')
    })
    slider.addEventListener('mouseup', () => {
      isDown = false
      slider.classList.remove('active')
    })
    slider.addEventListener('mousemove', (e) => {
      if (!isDown) return
      e.preventDefault()
      const x = e.pageX - slider.offsetLeft
      const walk = (x - startX) * 1 // scroll-fast
      slider.scrollLeft = scrollLeft - walk
    })
  }, [])

  return (
    <div className="slider position-relative">
      {btn?.prev && (
        <button className="arrow prev" onClick={handlePrev}>
          prev
        </button>
      )}
      <div className="inner slider-track multiple" style={{ gap }} onScroll={handleScroll} ref={ref}>
        {children}
      </div>
      {btn?.next && (
        <div className="arrow next" onClick={handleNext}>
          next
        </div>
      )}
    </div>
  )
}
Slider.propTypes = {
  children: PropTypes.node,
  gap: PropTypes.number,
  nav: PropTypes.bool
}
export default Slider
