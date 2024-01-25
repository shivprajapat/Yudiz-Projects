import PropTypes from 'prop-types'
// import style from './style.module.scss'

function Skeleton({ className, height, width, radius }) {
  const style = { height: height || '15px', width: width || '100%', borderRadius: radius || '0px', backgroundColor: 'var(--light)' }
  return (
    <div
      className={`${className || ''}`}
      style={style}
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
