import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import useOnScreen from '@/hooks/useOnScreen'

function LazyLoad({ children, loadOnce, fadeIn }) {
  const eleRef = useRef()
  const [delayLoad, setDelayLoad] = useState(false)
  const eleRefValue = useOnScreen(eleRef, loadOnce)
  useEffect(() => {
    setTimeout(() => {
      setDelayLoad(true)
    }, 1000)
  }, [])
  return (
    <div
      ref={eleRef}
      className={
        fadeIn && eleRefValue ? 'animate-fadeIn fill-mode-forwards' : ''
      }
    >
      {!fadeIn ? (!delayLoad || eleRefValue) && children : children}
    </div>
  )
}

LazyLoad.propTypes = {
  children: PropTypes.node.isRequired,
  loadOnce: PropTypes.bool,
  fadeIn: PropTypes.bool,
}
LazyLoad.defaultProps = {
  loadOnce: true,
  fadeIn: false,
}

export default LazyLoad
