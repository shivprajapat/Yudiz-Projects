import PropTypes from 'prop-types'

function SlickButtonFix({ children, ...props }) {
  return <span {...props}>{children}</span>
}

export default SlickButtonFix

SlickButtonFix.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  currentSlide: PropTypes.number,
  'data-role': PropTypes.string,
  onClick: PropTypes.func,
  slideCount: PropTypes.number,
  style: PropTypes.object,
}
