import React, { memo } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import NextImage from './generic/NextImage'
import { allRoutes } from '@/constants/allRoutes'

const PartnershipListItem = ({ title, description, img, id }) => {
  return (
    <div className=" bg-white flex justify-between flex-col items-start">
      <div className="w-full grow flex flex-col">
        <div className="group block overflow-hidden relative grow">
          <Link href={`${allRoutes.partnership}/${id}`}>
            <NextImage
              src={img}
              alt={title}
              className="h-full w-full max-h-[500px] object-cover object-top duration-500 group-hover:scale-110"
              width={500}
              height={500}
              quality={100}
            />
          </Link>
        </div>
        <div className="p-4">
          <Link
            href={`${allRoutes.partnership}/${id}`}
            className="text-xl sm:text-2xl font-playfairDisplay md:text-[28px] md:leading-[36px] text-grey-900 font-medium capitalize hover:text-primary line-clamp-1 mb-1 sm:mb-2"
          >
            {title}
          </Link>
          <p className="text-sm sm:text-base text-secondary-800 font-normal capitalize line-clamp-2">
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}

export default memo(PartnershipListItem)
PartnershipListItem.propTypes = {
  id: PropTypes.string,
  img: PropTypes.object,
  title: PropTypes.string,
  description: PropTypes.string,
}
