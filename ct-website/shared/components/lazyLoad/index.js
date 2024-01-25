import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'

function LazyLoad({ children }) {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    function onScroll(e) {
      setLoaded(true)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (loaded) {
    return children
  } else {
    return null
  }
}
LazyLoad.propTypes = {
  children: PropTypes.node.isRequired
}
export default LazyLoad
