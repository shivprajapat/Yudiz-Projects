import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import Link from 'next/link'

import NextImage from '../generic/NextImage'
import { IconAngleRight } from '@/assets/images'
import { allRoutes } from '@/constants/allRoutes'

const BlogListItem = ({ title, description, img, id }) => {
  return (
    <div className="bg-grey-100 h-full flex flex-col">
      <div className="group block overflow-hidden">
        <NextImage
          className="object-cover h-60 w-full duration-500 group-hover:scale-110"
          src={img}
          alt="Noteworthy"
          quality="100"
        />
      </div>
      <div className="px-4 pt-6 pb-4 flex-1 flex flex-col justify-between">
        <div>
          <p className="mb-2 text-grey-700 capitalize  font-medium text-xs">
            12th April, 2023
          </p>
          <Link href={`${allRoutes.blog}/${id}`}>
            <h5 className="mb-3 md:mb-4 text-xl lg:text-2xl font-medium tracking-tight text-grey-900 line-clamp-2">
              {title}
            </h5>
          </Link>
          <p className="mb-3 text-sm md:text-base font-normal text-grey-800 line-clamp-2">
            {description}
          </p>
        </div>
        <Link
          href={`${allRoutes.blog}/${id}`}
          className="inline-flex items-center gap-1 text-base font-normal opacity-80 hover:opacity-100 text-grey-800 duration-300 ease-in-out capitalize hover:text-secondary-200 hover:gap-2"
        >
          <FormattedMessage id="button.readMore" />
          <IconAngleRight className="w-4 h-3" />
        </Link>
      </div>
    </div>
  )
}

export default BlogListItem
BlogListItem.propTypes = {
  id: PropTypes.string,
  img: PropTypes.object,
  title: PropTypes.string,
  description: PropTypes.string,
}
