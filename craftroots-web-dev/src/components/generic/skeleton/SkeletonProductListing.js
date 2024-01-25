import SpinnerLoader from '../SpinnerLoader'
import SkeletonFilterSection from './SkeletonFilterSection'
import SkeletonProductItem from './SkeletonProductItem'

const SkeletonProductListing = () => {
  return (
    <section className="pb-10 md:pb-20 lg:pb-20 pt-10 sm:pt-16 md:pt-20 lg:pt-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid-cols-4 grid gap-4">
          <div className="col-span-1 hidden md:block">
            <SkeletonFilterSection />
          </div>
          <div className="md:col-span-3 col-span-4">
            <div className="mb-3 ml-auto w-52 hidden md:block">
              <div className="bg-slate-200 w-full h-10 block" />
            </div>
            <div className="mb-3 flex justify-between gap-3 md:hidden">
              <div className="w-1/2">
                <div className="bg-slate-200 w-full h-10 block" />
              </div>
              <div className="w-1/2">
                <div className="bg-slate-200 w-full h-10 block" />
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-3 lg:gap-x-8 md:gap-x-4 gap-y-8 lg:gap-y-12 pl-0 md:pl-5">
              <SkeletonProductItem display={3} />
            </div>
          </div>
        </div>
      </div>
      <SpinnerLoader />
    </section>
  )
}

export default SkeletonProductListing
