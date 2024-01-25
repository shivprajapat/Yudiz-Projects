import PropTypes from 'prop-types'

const SkeletonSideCart = ({ display }) => {
  const totalRenders = []
  while (totalRenders.length < display) {
    totalRenders.push(totalRenders.length)
  }
  return totalRenders.map((r) => (
    <div
      key={'skeleton' + r}
      className="flex border-b border-grey-400 py-4 animate-pulse"
    >
      <div className="flex justify-between items-start gap-2 sm:gap-4 w-full">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12">
            <div className="bg-slate-200 h-full w-full" />
          </div>
          <div>
            <h5 className="bg-slate-200 w-52 h-5 mb-2" />
            <div className="flex items-center justify-between">
              <div className="mt-2 bg-slate-200 w-20 h-5 rounded-md" />
              <div className="mt-2 bg-slate-200 w-20 h-5 rounded-md" />
            </div>
          </div>
        </div>
        <button className="bg-slate-300 w-7 h-7 rounded-full" />
      </div>
    </div>
  ))
}

export default SkeletonSideCart
SkeletonSideCart.propTypes = {
  display: PropTypes.number,
}
SkeletonSideCart.defaultProps = {
  display: 1,
}
