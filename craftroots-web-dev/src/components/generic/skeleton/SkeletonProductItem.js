import PropTypes from 'prop-types'

const SkeletonProductItem = ({ display }) => {
  const totalRenders = []
  while (totalRenders.length < display) {
    totalRenders.push(totalRenders.length)
  }
  return totalRenders.map((r) => (
    <div key={'skeleton' + r} className="product-item animate-pulse flex-col">
      <div className="w-full">
        <div className="group block overflow-hidden relative mb-4">
          <div>
            <div className="bg-slate-200 h-[230px] sm:h-[300px] md:h-[320px] lg:h-[350px] xl:h-96 w-full" />
          </div>
          <button className="bg-slate-300 w-7 h-7 flex-center rounded-full absolute top-2 right-2">
            <div className="bg-slate-300 rounded-full w-[18px] h-[18px]" />
          </button>
        </div>
        <div className="bg-slate-200 w-full h-4 rounded-full block" />
      </div>
      <div>
        <div>
          <div className="mt-2 bg-slate-200 w-16 h-4 rounded-full block" />
          <div className="mt-2 bg-slate-200 w-16 h-4 rounded-full block" />
        </div>
      </div>
    </div>
  ))
}

export default SkeletonProductItem
SkeletonProductItem.propTypes = {
  display: PropTypes.number,
}
SkeletonProductItem.defaultProps = {
  display: 1,
}
