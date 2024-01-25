import PropTypes from 'prop-types'

const SkeletonCart = ({ display }) => {
  const totalRenders = []
  while (totalRenders.length < display) {
    totalRenders.push(totalRenders.length)
  }
  return totalRenders.map((r) => (
    <div
      key={'skeleton' + r}
      className="flex animate-pulse items-start justify-between border-b border-slate-200 py-4"
    >
      <div className="flex w-full gap-4 sm:w-fit md:gap-6">
        <div className="h-16 w-16 bg-slate-200 sm:h-24 sm:w-24" />
        <div className="flex-1">
          <div className="mb-2.5 h-5 w-52 rounded-sm bg-slate-200 md:w-36 lg:w-64" />
          <div className="mb-2.5 flex items-center justify-between">
            <div className="h-4 w-16 rounded-sm bg-slate-200 lg:w-24" />
            <div className="h-4 w-16 rounded-sm bg-slate-200 lg:w-24" />
          </div>
          <div className="w-full sm:w-24">
            <div className="mb-4 block h-4 w-20 rounded-sm bg-slate-200 sm:hidden lg:w-24" />
            <div className="flex items-center justify-between">
              <div className="h-4 w-20 rounded-sm bg-slate-200 lg:w-24" />
              <div className="flex gap-6 sm:hidden">
                <div className="h-7 w-7 rounded-full bg-slate-200" />
                <div className="h-7 w-7 rounded-full bg-slate-200" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden h-24 flex-col items-end justify-between sm:flex">
        <div className="h-4 w-20 rounded-sm bg-slate-200 lg:w-24" />
        <div className="flex gap-4">
          <div className="h-7 w-7 rounded-full bg-slate-200" />
          <div className="h-7 w-7 rounded-full bg-slate-200" />
        </div>
      </div>
    </div>
  ))
}

export default SkeletonCart
SkeletonCart.propTypes = {
  display: PropTypes.number,
}
SkeletonCart.defaultProps = {
  display: 1,
}
