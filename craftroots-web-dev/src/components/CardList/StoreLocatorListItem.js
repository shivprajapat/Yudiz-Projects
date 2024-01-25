import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import Image from 'next/image'
import Link from 'next/link'

const StoreLocatorListItem = ({
  title,
  address,
  phone,
  directionLink,
  img,
}) => {
  return (
    <div className="bg-white h-full flex flex-col">
      <div className="block relative h-72 xl:h-80">
        <Image
          className="object-cover h-full w-full"
          src={img}
          alt={title}
          quality="100"
          fill
        />
      </div>
      <div className="px-4 pt-6 pb-4 flex-1 flex flex-col justify-between">
        <div>
          <h5 className="mb-2 md:mb-3 text-lg lg:text-xl font-semibold tracking-tight text-grey-900 line-clamp-2">
            {title}
          </h5>

          <p className="mb-3 md:mb-4 text-sm md:text-base font-normal text-grey-800 line-clamp-2">
            {address}
          </p>
        </div>
        <div>
          <div>
            <div className="flex items-center justify-between">
              <p className="mb-2 text-grey-900 capitalize font-medium text-xs sm:text-base">
                Phone :
                <span className="ml-0.5 text-grey-700 font-normal">
                  {phone}
                </span>
              </p>
              <p className="mb-2 text-grey-900 capitalize font-medium text-xs sm:text-base">
                Timing :
                <span className="ml-0.5 text-grey-700 font-normal">
                  11:00AM to 8:00PM
                </span>
              </p>
            </div>
          </div>
          <Link
            href={directionLink}
            target="_blank"
            className="inline-flex items-center gap-1 text-sm md:text-base font-medium opacity-80 hover:opacity-100 text-grey-800 duration-300 ease-in-out capitalize hover:text-secondary-200 hover:gap-2"
          >
            <FormattedMessage id="getDirections" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default StoreLocatorListItem
StoreLocatorListItem.propTypes = {
  id: PropTypes.string.isRequired,
  img: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  phone: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  directionLink: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
}
