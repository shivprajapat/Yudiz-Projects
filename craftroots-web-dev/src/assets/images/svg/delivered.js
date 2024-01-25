import React from 'react'
import PropTypes from 'prop-types'

const IconDelivered = ({ size, className }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.59386 0.0861884C9.85243 -0.0287295 10.1476 -0.0287295 10.4061 0.0861884L19.4061 4.08619C19.7673 4.24669 20 4.60481 20 5V15C20 15.3952 19.7673 15.7533 19.4061 15.9138L10.4061 19.9138C10.1476 20.0287 9.85243 20.0287 9.59386 19.9138L0.593862 15.9138C0.232734 15.7533 0 15.3952 0 15V5C0 4.60481 0.232734 4.24669 0.593862 4.08619L9.59386 0.0861884ZM2 5.64987V14.3501L10 17.9057L18 14.3501V5.64987L10 2.09432L2 5.64987Z"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 8C10.5523 8 11 8.44772 11 9V19C11 19.5523 10.5523 20 10 20C9.44772 20 9 19.5523 9 19V9C9 8.44772 9.44772 8 10 8Z"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.9138 4.59362C20.1381 5.09831 19.9108 5.68927 19.4061 5.91357L10.4061 9.91357C9.90146 10.1379 9.3105 9.91058 9.08619 9.4059C8.86189 8.90122 9.08918 8.31025 9.59387 8.08595L18.5939 4.08595C19.0986 3.86165 19.6895 4.08894 19.9138 4.59362Z"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.0861939 4.59362C0.310498 4.08894 0.90146 3.86165 1.40614 4.08595L10.4061 8.08595C10.9108 8.31025 11.1381 8.90122 10.9138 9.4059C10.6895 9.91058 10.0986 10.1379 9.59387 9.91357L0.593867 5.91357C0.0891828 5.68927 -0.13811 5.09831 0.0861939 4.59362Z"
      />
    </svg>
  )
}

IconDelivered.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}
IconDelivered.defaultProps = {
  className: '',
  size: '20',
}
export default IconDelivered
