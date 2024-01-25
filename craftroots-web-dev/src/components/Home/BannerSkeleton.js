import PropTypes from 'prop-types'

function BannerSkeleton({ className }) {
  return (
    <div
      className={`flex items-center justify-center h-full md:h-[350px] lg:h-[480px] 2xl:h-[537px] w-full bg-slate-100 home-banner-inner ${className}`}
    >
      <div className="w-[50%] sm:w-[40%] max-w-[500px] min-w-[275px]">
        <h1 className="animate-pulse bg-slate-200 rounded h-12 block" />
        <div className="mt-9 animate-pulse bg-slate-200 rounded h-10 block w-[30%] mx-auto" />
      </div>
    </div>
  )
}

BannerSkeleton.propTypes = {
  className: PropTypes.string,
}

export default BannerSkeleton
