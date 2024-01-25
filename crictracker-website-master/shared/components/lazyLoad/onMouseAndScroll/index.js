import PropTypes from 'prop-types'
import useOnMouseAndScroll from '@shared/hooks/useOnMouseAndScroll'

function OnMouseAndScroll({ children }) {
  const { isLoaded } = useOnMouseAndScroll()

  if (isLoaded) return children || ''
  else return null
}

OnMouseAndScroll.propTypes = {
  children: PropTypes.node
}

export default OnMouseAndScroll
