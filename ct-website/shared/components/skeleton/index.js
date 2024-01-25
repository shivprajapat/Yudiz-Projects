import PropTypes from 'prop-types'
import style from './style.module.scss'

function Skeleton({ className, height, width, radius }) {
  return (
    <div
      className={`${className} ${style.skeleton}`}
      style={{
        height: height,
        width: width,
        borderRadius: radius
      }}
    ></div>
  )
}
Skeleton.propTypes = {
  height: PropTypes.string,
  width: PropTypes.string,
  radius: PropTypes.string,
  className: PropTypes.string
}
export default Skeleton
