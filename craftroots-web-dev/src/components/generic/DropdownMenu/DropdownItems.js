import PropTypes from 'prop-types'

function DropdownItems({ className, children }) {
  return (
    <ul
      class={`hidden group-focus-within:block list-none absolute bg-gray-50 w-40 z-1 shadow-lg ${className}`}
    >
      {children}
    </ul>
  )
}

DropdownItems.propTypes = {
  children: PropTypes.element.isRequired,
  className: PropTypes.string,
}
DropdownItems.defaultProps = {
  className: '',
}
export default DropdownItems
