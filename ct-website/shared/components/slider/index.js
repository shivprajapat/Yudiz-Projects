
import useWindowSize from '@shared/hooks/windowSize'
import Trans from 'next-translate/Trans'
import PropTypes from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'
import styles from './style.module.scss'

function Slider({ children, gap = 15, nav, single, dots, autoplay, navTransparent, destroyBelow = 0 }) {
  const [btn, setBtn] = useState({ next: nav, prev: false })
  const [items, setItems] = useState([])
  const [active, setActive] = useState(0)
  const activeRef = useRef(active)
  const ref = useRef()
  const [width] = useWindowSize()

  function handleNext() {
    ref.current.scrollLeft += getItemWidth()
  }

  function handlePrev() {
    ref.current.scrollLeft -= getItemWidth()
  }

  function handleScroll(e) {
    const t = e?.target || ref.current
    if (nav) {
      const scrollPosition = ref.current?.scrollWidth - ref.current.clientWidth
      setBtn({ next: scrollPosition !== t.scrollLeft, prev: t.scrollLeft > 0 })
    }
  }

  function handleDots(i) {
    setActive(i)
    activeRef.current = i
    ref.current.scrollLeft += (getItemWidth() * i) - ref.current.scrollLeft
  }

  const getItemWidth = () => ref?.current?.childNodes[0]?.clientWidth + gap

  useEffect(() => {
    if (!single) {
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
    }
    handleScroll()
  }, [])

  useEffect(() => {
    let intervalId
    if (ref.current) {
      const child = [...ref.current.childNodes]
      setItems(() => [...ref.current.childNodes])
      if (autoplay) {
        intervalId = setInterval(() => {
          handleDots(activeRef.current === (child.length - 1) ? 0 : activeRef.current + 1)
        }, 4000)
      }
    }
    return () => {
      clearInterval(intervalId)
    }
  }, [children])

  return (
    <div className={`${styles.slider} ${navTransparent && styles.navTransparent} ${destroyBelow > width ? styles.destroy : ''} position-relative`}>
      {(btn?.prev) && <button className={`${styles.arrow} ${styles.prev}`} onClick={handlePrev}><Trans i18nKey="common:Prev" /></button>}
      <div className={`${styles.inner} slider-track ${single ? styles.single : styles.multiple} `} style={{ gap: gap }} onScroll={handleScroll} ref={ref}>
        {children}
      </div>
      {dots && <div className={styles.dots}>
        {items?.map((child, i) => {
          return <button className={active === i ? styles.active : ''} onClick={() => handleDots(i)} key={i}>{i}</button>
        })}
      </div>}
      {(btn?.next) && <div className={`${styles.arrow} ${styles.next}`} onClick={handleNext}><Trans i18nKey="common:Next" /></div>}
    </div>
  )
}
Slider.propTypes = {
  children: PropTypes.node,
  gap: PropTypes.number,
  nav: PropTypes.bool,
  single: PropTypes.bool,
  dots: PropTypes.bool,
  navTransparent: PropTypes.bool,
  autoplay: PropTypes.bool,
  destroyBelow: PropTypes.number
}
export default Slider
