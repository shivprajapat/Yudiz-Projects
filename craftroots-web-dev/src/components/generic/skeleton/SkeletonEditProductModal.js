import PropTypes from 'prop-types'

const SkeletonEditProductModal = ({ display }) => {
  const totalRenders = []
  while (totalRenders.length < display) {
    totalRenders.push(totalRenders.length)
  }
  return totalRenders.map((r) => (
    <div
      key={'skeleton' + r}
      className="flex animate-pulse items-start justify-between border-b border-slate-200 py-4 w-full sm:w-[470px]"
    >
      <div className="md:flex w-full gap-4 md:gap-6 mt-4 sm:mt-0">
        <div className="h-64 sm:h-72 md:h-56 w-full sm:w-44 bg-slate-200 mb-3 sm:mb-0" />
        <div className="flex-1 pr-4 flex flex-col">
          <div>
            <div className="mb-2.5 h-4 w-52 xs:w-60 rounded-sm bg-slate-200 sm:w-36 md:w-56" />
            <div className="mb-3 flex items-center justify-between">
              <div className="h-4 w-16 rounded-sm bg-slate-200 lg:w-24" />
              <div className="h-4 w-16 rounded-sm bg-slate-200 lg:w-24" />
            </div>
            <div className="mb-2.5">
              <div className="h-8 rounded-sm bg-slate-200 w-28" />
            </div>
            <div className="mb-3 flex items-center justify-between">
              <div className="h-7 w-14 md:w-12 rounded-sm lg:w-12 bg-slate-200" />
              <div className="h-7 w-14 md:w-12 rounded-sm lg:w-12 bg-slate-200" />
              <div className="h-7 w-14 md:w-12 rounded-sm lg:w-12 bg-slate-200" />
              <div className="h-7 w-14 md:w-12 rounded-sm lg:w-12 bg-slate-200" />
              <div className="h-7 w-14 md:w-12 rounded-sm lg:w-12 bg-slate-200" />
            </div>
          </div>
          <div className="mt-auto">
            <div className="h-8 rounded-sm bg-slate-200 w-28" />
          </div>
          {/* <div className="w-full sm:w-24">
            <div className="mb-4 block h-4 w-20 rounded-sm bg-slate-200 sm:hidden lg:w-24" />
            <div className="flex items-center justify-between">
              <div className="h-4 w-20 rounded-sm bg-slate-200 lg:w-24" />
              <div className="flex gap-6 sm:hidden">
                <div className="h-7 w-7 rounded-full bg-slate-200" />
                <div className="h-7 w-7 rounded-full bg-slate-200" />
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  ))
}

export default SkeletonEditProductModal
SkeletonEditProductModal.propTypes = {
  display: PropTypes.number,
}
SkeletonEditProductModal.defaultProps = {
  display: 1,
}
