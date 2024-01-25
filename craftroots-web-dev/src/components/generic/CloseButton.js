import React from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'
import { iconClose } from '@/assets/images'

const CloseButton = ({ onClick, top, className }) => {
  const defaultClass =
    'cursor-pointer duration-300 ease-in-out flex-center w-8 h-8 rounded-full border-none outline-none'
  const topClass = top ? 'absolute right-2 -translate-y-1/2 top-2/4' : ''
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${className} ${topClass} ${defaultClass} icon-close`}
    >
      <Image src={iconClose} alt="close" className="duration-300 ease-in-out" />
    </button>
  )
}

export default CloseButton
CloseButton.propTypes = {
  top: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
}
