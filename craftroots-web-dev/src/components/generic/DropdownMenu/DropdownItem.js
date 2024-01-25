import PropTypes from 'prop-types'

function DropdownItem({ className, children }) {
  function handleOptionClick(e) {
    e.stopPropagation()
    if (typeof document !== 'undefined') {
      document.activeElement.blur()
    }
  }
  return (
    <li className={className} onClick={handleOptionClick}>
      {children}
    </li>
  )
}

DropdownItem.propTypes = {
  children: PropTypes.element.isRequired,
  className: PropTypes.string,
}
DropdownItem.defaultProps = {
  className: '',
}

export default DropdownItem
