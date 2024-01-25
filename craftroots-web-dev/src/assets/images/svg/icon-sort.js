import PropTypes from 'prop-types'

function IconSort({ size }) {
  return (
    <svg width={size} height={size} xmlns="http://www.w3.org/2000/svg">
      <path d="M4.2 2.86a.67.67 0 0 1 .94 0L7.8 5.53a.67.67 0 1 1-.94.94L5.33 4.94v7.73a.67.67 0 1 1-1.33 0V4.94L2.47 6.47a.67.67 0 0 1-.94-.94zM11.33 2.67c.37 0 .67.3.67.66v7.73l1.53-1.53a.67.67 0 1 1 .94.94l-2.67 2.67a.67.67 0 0 1-.94 0L8.2 10.47a.67.67 0 0 1 .94-.94l1.53 1.53V3.33c0-.36.3-.66.66-.66z" />
    </svg>
  )
}

IconSort.propTypes = {
  size: PropTypes.string,
}
IconSort.defaultProps = {
  size: '16',
}

export default IconSort
