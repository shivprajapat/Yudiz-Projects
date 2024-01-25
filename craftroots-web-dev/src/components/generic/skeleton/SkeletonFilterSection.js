const SkeletonFilterSection = () => {
  return (
    <div className="sticky left-0 top-[140px] bottom-[30px]">
      <div className="mb-3 grid grid-cols-2 gap-3 justify-between">
        <div className="bg-slate-200 h-10 block w-full" />
        <div className="bg-slate-200 h-10 block w-full" />
      </div>
      <div className="animate-pulse">
        <div className="w-full">
          <div className="group block overflow-hidden relative mb-4">
            <div>
              <div className="bg-slate-200 h-[230px] sm:h-[300px] md:h-[390px] lg:h-[420px] xl:h-[460px] w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SkeletonFilterSection
