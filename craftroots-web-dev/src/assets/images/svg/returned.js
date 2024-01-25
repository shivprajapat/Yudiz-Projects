import PropTypes from 'prop-types'

const IconReturned = ({ className, size }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.47124 3.52876C6.73159 3.78911 6.73159 4.21122 6.47124 4.47157L4.27598 6.66683L6.47124 8.86209C6.73159 9.12244 6.73159 9.54455 6.47124 9.8049C6.21089 10.0653 5.78878 10.0653 5.52843 9.8049L2.86177 7.13823C2.60142 6.87788 2.60142 6.45577 2.86177 6.19543L5.52843 3.52876C5.78878 3.26841 6.21089 3.26841 6.47124 3.52876Z"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.6665 6.66667C2.6665 6.29848 2.96498 6 3.33317 6H10.6665C11.5506 6 12.3984 6.35119 13.0235 6.97631C13.6486 7.60143 13.9998 8.44928 13.9998 9.33333C13.9998 10.2174 13.6486 11.0652 13.0235 11.6904C12.3984 12.3155 11.5506 12.6667 10.6665 12.6667H9.99984C9.63165 12.6667 9.33317 12.3682 9.33317 12C9.33317 11.6318 9.63165 11.3333 9.99984 11.3333H10.6665C11.1969 11.3333 11.7056 11.1226 12.0807 10.7475C12.4558 10.3725 12.6665 9.86377 12.6665 9.33333C12.6665 8.8029 12.4558 8.29419 12.0807 7.91912C11.7056 7.54405 11.1969 7.33333 10.6665 7.33333H3.33317C2.96498 7.33333 2.6665 7.03486 2.6665 6.66667Z"
      />
    </svg>
  )
}
IconReturned.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}
IconReturned.defaultProps = {
  className: '',
  size: '16',
}
export default IconReturned
