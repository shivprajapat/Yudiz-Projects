import React from 'react'
import Image from 'next/image'
import PropTypes from 'prop-types'
import { iconClose } from '@/assets/images'

function FilterBadge({ data, handleFilterClick }) {
  return data?.map((filter) => {
    return (
      filter?.label && (
        <button
          key={filter.label}
          className="border border-grey-400 py-1.5 px-3 flex items-center gap-2"
          onClick={() => handleFilterClick(filter.attribute_code, filter.value)}
        >
          <span className="text-grey-700 font-medium text-sm">
            {filter.label}
          </span>
          <Image src={iconClose} alt="close" className="w-4 h-auto" />
        </button>
      )
    )
  })
}

export default FilterBadge

FilterBadge.propTypes = {
  data: PropTypes.array,
  handleFilterClick: PropTypes.func,
}
