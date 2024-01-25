import PropTypes from 'prop-types'

const IconAngleRight = ({ className, size }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.3334 3.99996C11.3334 4.36815 11.0349 4.66663 10.6667 4.66663L1.33341 4.66663C0.965225 4.66663 0.666748 4.36815 0.666748 3.99996C0.666748 3.63177 0.965225 3.33329 1.33341 3.33329L10.6667 3.33329C11.0349 3.33329 11.3334 3.63177 11.3334 3.99996Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.1382 4.47136C10.8778 4.73171 10.4557 4.73171 10.1953 4.47136L7.52868 1.8047C7.26833 1.54435 7.26833 1.12224 7.52868 0.861888C7.78903 0.601539 8.21114 0.601539 8.47149 0.861888L11.1382 3.52855C11.3985 3.7889 11.3985 4.21101 11.1382 4.47136Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.52868 7.13803C7.26833 6.87768 7.26833 6.45557 7.52868 6.19522L10.1953 3.52855C10.4557 3.26821 10.8778 3.2682 11.1382 3.52855C11.3985 3.7889 11.3985 4.21101 11.1382 4.47136L8.47149 7.13803C8.21114 7.39838 7.78903 7.39838 7.52868 7.13803Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default IconAngleRight
IconAngleRight.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}
IconAngleRight.defaultProps = {
  className: '',
  size: '16',
}
