import React from 'react'

import PartnerShipListItem from '@/components/PartnerShipListItem'
import PartnerShipData from '@/helper/partnership'
import { Meta } from '@/components/generic'
import META from '@/helper/meta-constant'

const Partnership = () => {
  return (
    <>
      <Meta
        title={META.partnership.title}
        description={META.partnership.description}
      />
      <section>
        {/* <div className="relative h-52 sm:h-62 md:h-72 lg:h-80">
          <div className="absolute inset-0 h-auto">
            <NextImage
              src={imgPartnership}
              alt="banner"
              className="h-full w-full object-cover"
            />
            <div className="absolute w-full h-full inset-0 bg-grey-900 opacity-50" />
          </div>
        </div> */}
        <div className="py-12 md:py-16 lg:py-20 artist-story partnership">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-3 lg:gap-x-8 md:gap-x-4 gap-y-8 lg:gap-y-12">
              {Object.keys(PartnerShipData).map((key) => {
                const data = PartnerShipData[key]
                return <PartnerShipListItem key={key} {...data} />
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Partnership
