import PropTypes from 'prop-types'

const SkeletonCheckoutSummary = ({ display }) => {
  const totalRenders = []
  while (totalRenders.length < display) {
    totalRenders.push(totalRenders.length)
  }
  return totalRenders.map((r) => (
    <div
      key={'skeleton' + r}
      className="animate-pulse border border-slate-200 p-6"
    >
      <div className="mb-4 h-8 rounded-sm bg-slate-100 pr-2" />
      <div>
        <div className="mb-5">
          <div className="mb-5 h-20 bg-slate-100" />
          <div className="h-20 bg-slate-100" />
        </div>
        <div className="flex h-32 flex-col items-end justify-center gap-2 bg-slate-100 px-2"></div>
      </div>
    </div>
  ))
}

export default SkeletonCheckoutSummary
SkeletonCheckoutSummary.propTypes = {
  display: PropTypes.number,
}
SkeletonCheckoutSummary.defaultProps = {
  display: 1,
}
