import React from 'react'
import PropTypes from 'prop-types'
import NextImage from '../generic/NextImage'

const PressListItem = ({ title, description, img, topTitle }) => {
  return (
    <div>
      <div className="group block overflow-hidden">
        <NextImage
          className="object-cover h-52 w-full duration-500 group-hover:scale-110"
          src={img}
          alt="Noteworthy"
          quality="100"
        />
      </div>
      <div className="px-4 pt-6 pb-4 border border-grey-400">
        <div className="flex justify-between items-center">
          <span className="mb-2 text-grey-700 capitalize font-normal text-sm">
            12th April, 2023
          </span>
          <span className="mb-2 text-grey-700 capitalize font-normal text-sm">
            - {topTitle}
          </span>
        </div>
        <h5 className="mb-2 text-xl md:text-2xl font-medium tracking-tight text-grey-900 line-clamp-1">
          {title}
        </h5>
        <p className="text-sm md:text-base font-normal text-grey-800 line-clamp-2">
          {description}
        </p>
      </div>
    </div>
  )
}

export default PressListItem
PressListItem.propTypes = {
  topTitle: PropTypes.string,
  img: PropTypes.object,
  title: PropTypes.string,
  description: PropTypes.string,
}
