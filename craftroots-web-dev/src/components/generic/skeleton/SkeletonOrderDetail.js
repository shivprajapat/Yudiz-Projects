import PropTypes from 'prop-types'

const SkeletonOrderDetail = ({ display }) => {
  const totalRenders = []
  while (totalRenders.length < display) {
    totalRenders.push(totalRenders.length)
  }
  return totalRenders.map((r) => (
    <div key={'skeleton' + r} className="product-item animate-pulse flex-col">
      <div className="w-full">
        <div className="group block overflow-hidden relative mb-4">
          <div>
            <div className="bg-slate-200 h-[500px] md:h-[250px] xl:h-60 w-full" />
          </div>
        </div>
      </div>
    </div>
  ))
}

export default SkeletonOrderDetail
SkeletonOrderDetail.propTypes = {
  display: PropTypes.number,
}
SkeletonOrderDetail.defaultProps = {
  display: 1,
}
