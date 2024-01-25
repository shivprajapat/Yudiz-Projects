import PropTypes from 'prop-types'

const SkeletonCartAddress = ({ display }) => {
  const totalRenders = []
  while (totalRenders.length < display) {
    totalRenders.push(totalRenders.length)
  }
  return totalRenders.map((r) => (
    <div key={'skeleton' + r} className="animate-pulse py-2 h-52 sm:h-36">
      <div className="bg-slate-200 rounded-sm w-full h-full" />
    </div>
  ))
}

export default SkeletonCartAddress
SkeletonCartAddress.propTypes = {
  display: PropTypes.number,
}
SkeletonCartAddress.defaultProps = {
  display: 1,
}
