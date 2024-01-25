import React from 'react'
import { FormattedMessage } from 'react-intl'
import Image from 'next/image'
import { iconAngleDown } from '@/assets/images'

const ShowMore = () => {
  return (
    <button className="flex items-center show-more">
      <Image
        src={iconAngleDown}
        alt="iconAngleDown"
        className="mr-2 w-[10px]"
      />
      <span className="text-base cursor-pointer font-medium text-grey-800">
        <FormattedMessage id="button.showMore" />
      </span>
    </button>
  )
}

export default ShowMore
